import { MetaFunction } from '@remix-run/node';

import { createUserMusicMemoAction } from 'app/features/music/action';
import { musicUserLoader } from 'app/features/music/loader';
import MusicSongUserPage from 'app/features/music/pages/music.user';

export const loader = musicUserLoader;
export const action = createUserMusicMemoAction;

export const meta: MetaFunction<typeof musicUserLoader> = ({ data }) => {
  const song = data?.song;
  return [
    {
      title: song ? `${song.title} - ${song.artist}` : undefined,
    },
  ];
};

export default MusicSongUserPage;
