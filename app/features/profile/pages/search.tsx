import { Form, Link, useLoaderData } from '@remix-run/react';

import styles from './search.module.scss';
import { searchLoader } from '../loader';

export default function Search() {
  const { users } = useLoaderData<typeof searchLoader>();

  return (
    <div className={styles.searchWrapper}>
      <Form>
        <input type="text" name="handle" />
        <button type="submit">검색</button>
      </Form>
      <ul>
        {users.map((user) => (
          <Link key={user.id} to={`/profile/${user.id}/show`}>
            <li>
              {user.name}({user.handle})
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
