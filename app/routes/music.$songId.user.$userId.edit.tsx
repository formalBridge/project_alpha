import { editUserMusicMemoAction } from 'app/features/music/action';
import { musicUserLoader } from 'app/features/music/loader';
import MusicSongUserEditPage from 'app/features/music/pages/music.user.edit';

export const loader = musicUserLoader;
export const action = editUserMusicMemoAction;

export default MusicSongUserEditPage;
