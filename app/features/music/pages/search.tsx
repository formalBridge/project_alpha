import { useLoaderData, useSearchParams } from '@remix-run/react';

import { MusicInfo } from 'app/external/music/IMusicSearchAPI';

export default function SearchMusic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const results = useLoaderData<MusicInfo[]>();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const title = new FormData(form).get('title') as string;
          setSearchParams({ title: String(title) });
        }}
      >
        <input name="title" placeholder="노래 제목 입력" defaultValue={searchParams.get('title') ?? ''} />
        <button type="submit">검색</button>
      </form>
      <ul>
        {results.map((song, idx) => (
          <li key={idx}>
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
