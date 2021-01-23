/*
  Warnings:

  - The migration will change the primary key for the `Updoot` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Updoot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Updoot" DROP CONSTRAINT "Updoot_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("postId", "userId");
