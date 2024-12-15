import jsonwebtoken from 'jsonwebtoken';
import { compare } from 'bcrypt';
import prisma from '#database/prisma.js';
import catchAsync from '#utils/catchAsync.js';
import AppError from '#utils/appErrors.js';

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Usuario no registrado', 404);
  }

  const isPasswordValid = await compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    throw new AppError('Contraseña o correo electrónico invalido', 401);
  }

  const token = jsonwebtoken.sign(
    {
      id: user.id,
      role: user.roleId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.status(200).json({
    status: 'success',
    token,
  });
});

export const authenticate = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('El token es requerido', 400);
  }

  const blacklistedToken = await prisma.jWTBlacklist.findUnique({
    where: { token },
  });
  if (blacklistedToken) {
    return res
      .status(403)
      .json({ message: 'El Token se encuentra en la blacklist' });
  }

  let decoded;
  try {
    decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Token inválido o expirado', 401));
  }

  const userId = decoded.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('El usuario no existe', 401);
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('El token es requerido', 400);
  }

  await prisma.jWTBlacklist.create({
    data: { token },
  });

  return res.status(204).json('');
});
