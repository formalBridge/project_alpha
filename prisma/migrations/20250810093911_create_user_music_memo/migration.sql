-- CreateTable
CREATE TABLE "UserMusicMemo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMusicMemo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMusicMemo_userId_songId_key" ON "UserMusicMemo"("userId", "songId");

-- AddForeignKey
ALTER TABLE "UserMusicMemo" ADD CONSTRAINT "UserMusicMemo_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMusicMemo" ADD CONSTRAINT "UserMusicMemo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
