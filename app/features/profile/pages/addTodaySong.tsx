import { Link } from '@remix-run/react';

import styles from './addTodaySong.module.scss';
import SearchSongButton from '../components/SearchSongButton';
import SongItem from '../components/SongItem';

export default function AddTodaySong() {
  return (
    <div>
      <Link to="../show">Go Back</Link>
      <h1>오늘의 노래 수정</h1>
      <div className={styles.addTodaySongContainer}>
        <SearchSongButton />
        <SongItem />
      </div>
    </div>
  );
}
