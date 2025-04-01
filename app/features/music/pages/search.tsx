// 비지니스 로직 (검색 핸들러)을
import { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { useState } from 'react';

export default function SearchMusic() {
    const [title, setTitle] = useState('');
    const [results, setResults] = useState<MusicInfo[]>([]);

    const handleSearch = async () => {
        const query = new URLSearchParams({ title }).toString();
        const res = await fetch(`/api/music?${query}`);
        const data: MusicInfo[] = await res.json();
        setResults(data);
    };

    return (
        <div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='노래 제목 입력' />
            <button onClick={handleSearch}>검색</button>

            <ul>
                {results.map((song, idx) => (
                    <li key={idx}>{song.title} - {song.artist}</li>
                ))}
            </ul>
        </div>
    );
}