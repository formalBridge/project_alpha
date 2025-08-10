import styles from './music.user.module.scss';

export default function MusicSongUserPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <header className={styles.songHeader}>
          <img
            className={styles.albumCover}
            src="https://i.scdn.co/image/ab67616d0000b273e56c589617d5233c094255b3"
            alt="앨범 커버"
          />
          <div className={styles.songDetails}>
            <h1 className={styles.songTitle}>Far Away</h1>
            <p className={styles.artistName}>Lacuna (라쿠나)</p>
          </div>
        </header>

        <div className={styles.authorInfo}>
          <p className={styles.userName}>박동철</p>
          <time dateTime="2023-03-15">2023년 3월 15일</time>
        </div>

        {/* 블로그 글처럼 꾸민 본문 */}
        <article className={styles.content}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet faucibus dolor. In id velit quis
            turpis dapibus rhoncus. Quisque quam est, commodo id tortor sed, porttitor ultricies leo. Vestibulum
            dignissim, sapien id imperdiet imperdiet, erat nulla efficitur nisl, non suscipit ipsum velit ut orci.
          </p>
          <p>
            Sed gravida justo tempus, fermentum dui eu, auctor erat. Quisque vitae turpis tortor. Ut rhoncus mauris
            lacus. Nulla euismod mollis condimentum. Integer sodales dignissim lacus, eu gravida enim cursus a. Duis
            congue porta arcu, sed pretium ipsum placerat non.
          </p>
        </article>
      </div>
    </div>
  );
}
