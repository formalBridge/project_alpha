import { searchAction } from 'app/features/search/action';
import { searchLoader } from 'app/features/search/loader';
import Search from 'app/features/search/pages/search';

export const meta = () => [{ title: '유저 검색' }];

export const loader = searchLoader;
export const action = searchAction;

export default Search;
