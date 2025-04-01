import { Link } from '@remix-run/react';

import SongItem from '../components/SongItem';

export default function EditList() {
  return (
    <>
      <Link to="../show">Go Back</Link>
      <SongItem />
    </>
  );
}
