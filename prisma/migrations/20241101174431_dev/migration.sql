BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [User_id_df] DEFAULT (newid()),
    [email] VARCHAR(250) NOT NULL,
    [hashedPassword] VARCHAR(250) NOT NULL,
    [isEnabled] BIT NOT NULL CONSTRAINT [User_isEnabled_df] DEFAULT 1,
    [roleId] INT NOT NULL,
    [version] INT NOT NULL CONSTRAINT [User_version_df] DEFAULT 1,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(250) NOT NULL,
    [description] VARCHAR(250) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Role_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [version] INT NOT NULL CONSTRAINT [Role_version_df] DEFAULT 1,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_roleId_idx] ON [dbo].[User]([roleId]);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
