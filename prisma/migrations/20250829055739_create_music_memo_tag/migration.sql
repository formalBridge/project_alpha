-- CreateTable
CREATE TABLE "MusicMemoTag" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "MusicMemoTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicMemoTag_memoId_content_key" ON "MusicMemoTag"("memoId", "content");

-- AddForeignKey
ALTER TABLE "MusicMemoTag" ADD CONSTRAINT "MusicMemoTag_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "UserMusicMemo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
