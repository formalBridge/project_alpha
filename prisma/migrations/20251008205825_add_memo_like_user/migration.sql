-- CreateTable
CREATE TABLE "MemoLikesUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoLikesUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemoLikesUser_userId_memoId_key" ON "MemoLikesUser"("userId", "memoId");

-- AddForeignKey
ALTER TABLE "MemoLikesUser" ADD CONSTRAINT "MemoLikesUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoLikesUser" ADD CONSTRAINT "MemoLikesUser_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "UserMusicMemo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
