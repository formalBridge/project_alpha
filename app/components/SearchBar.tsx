import { Form } from '@remix-run/react';

import styles from './SearchBar.module.scss';

export const SearchBar = ({
  defaultQuery = '',
  actionUrl = '/search',
  tab,
}: {
  defaultQuery?: string;
  actionUrl?: string;
  tab?: string;
}) => {
  return (
    <Form method="get" action={actionUrl} role="search" className={styles.root}>
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
        {tab && <input type="hidden" name="tab" value={tab} />}
      </div>
    </Form>
  );
};
