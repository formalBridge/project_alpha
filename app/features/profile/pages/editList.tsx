import { Link } from '@remix-run/react';

import styles from './editList.module.scss';
import SongItem from '../components/SongItem';

export default function EditList() {
  return (
    <>
      <Link to="../show">Go Back</Link>
      <div className={styles.editListContainer}>
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
      </div>
    </>
  );
}
