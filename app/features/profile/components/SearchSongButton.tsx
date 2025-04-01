import { debounce } from 'es-toolkit';
import { useState } from 'react';

const SearchSongButton = () => {
  const [searchText, setSearchText] = useState('');

  const debouncedSetSearchText = debounce((text: string) => {
    setSearchText(text);
  }, 300);

  return (
    <div>
      <button>
        <span>노래 검색</span>
      </button>
      <div>
        <input
          onChange={(e) => debouncedSetSearchText(e.target.value)}
          type="text"
          placeholder="노래 제목 또는 아티스트 검색"
        />
        {searchText}
      </div>
    </div>
  );
};

export default SearchSongButton;
