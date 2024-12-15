BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Role] DROP CONSTRAINT [Role_id_df];
ALTER TABLE [dbo].[Role] ADD CONSTRAINT [Role_id_df] DEFAULT (newid()) FOR [id];

-- AlterTable
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_id_df];
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_id_df] DEFAULT (newid()) FOR [id];

-- CreateTable
CREATE TABLE [dbo].[JWTBlacklist] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [JWTBlacklist_id_df] DEFAULT (newid()),
    [token] VARCHAR(500) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [JWTBlacklist_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [JWTBlacklist_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [JWTBlacklist_token_key] UNIQUE NONCLUSTERED ([token])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
