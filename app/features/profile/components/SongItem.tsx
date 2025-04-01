import styles from './SongItem.module.scss';

const SongItem = () => {
  return (
    <div className={styles.songItem}>
      <img className={styles.itemImage} />
      <div className={styles.itemTextBox}>
        <p className={styles.itemTitle}>노래 제목</p>
        <p className={styles.itemArtist}>가수 이름</p>
      </div>
    </div>
  );
};

export default SongItem;
