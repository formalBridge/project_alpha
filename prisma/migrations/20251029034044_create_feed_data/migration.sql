-- CreateTable
CREATE TABLE "FeedData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeedData" ADD CONSTRAINT "FeedData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedData" ADD CONSTRAINT "FeedData_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "UserMusicMemo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
