import { createUserMusicMemoAction } from 'app/features/music/action';
import { musicCreateUserLoader } from 'app/features/music/loader';
import MusicSongUserCreatePage from 'app/features/music/pages/music.user.create';

export const loader = musicCreateUserLoader;
export const action = createUserMusicMemoAction;

export default MusicSongUserCreatePage;
