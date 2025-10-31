import { Form } from '@remix-run/react';

import styles from './SearchBar.module.scss';

export const SearchBar = ({ defaultQuery = '' }: { defaultQuery?: string }) => {
  return (
    <Form method="get" action="/search" role="search" className={styles.root}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          Sonnets
        </a>
        <input
          className={styles.input}
          type="text"
          name="search"
          placeholder="음악, 메모, 사용자를 검색해보세요"
          defaultValue={defaultQuery}
          autoComplete="on"
        />
      </div>
    </Form>
  );
};
