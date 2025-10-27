import { useLoaderData, Form } from '@remix-run/react';

import styles from './search.module.scss';
import { SearchIcon } from '../components/Icons';
import { ProfileCard } from '../components/ProfileCard';
import { searchLoader } from '../loader';

export default function SearchPage() {
  const { recommendedUsers, searchResults, query } = useLoaderData<typeof searchLoader>();

  const isSearchMode = !!query;

  return (
    <div className={styles.wrapper}>
      <h1>Search</h1>

      <Form method="get" action="/profile/search" className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            name="handle"
            placeholder="사용자 핸들 검색..."
            className={styles.searchInput}
            defaultValue={query ?? ''}
          />
        </div>
        <button type="submit" className={styles.searchButton}>
          <SearchIcon />
        </button>
      </Form>

      <hr />

      {isSearchMode ? (
        <div>
          <h2 className={styles.title}>{`🔍 검색 결과"${query}"`}</h2>
          {searchResults && searchResults.length > 0 ? (
            <div className={styles.profileGrid}>
              {searchResults.map((user) => (
                <ProfileCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <p> {`"${query}"에 대한 검색 결과가 없습니다.`}</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className={styles.title}>✨ 오늘의 추천 프로필</h2>
          <div className={styles.profileGrid}>
            {recommendedUsers.map((user) => (
              <ProfileCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
