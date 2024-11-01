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
