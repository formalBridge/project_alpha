import createLoader from 'app/utils/createLoader';

export const musicUserLoader = createLoader(async ({ db, params }) => {
  const songId = Number(params.songId);
  const userId = Number(params.userId);

  const song = await db.song.findUnique({ where: { id: songId } });
  const user = await db.user.findUnique({ where: { id: userId } });
  return { song, user };
});
