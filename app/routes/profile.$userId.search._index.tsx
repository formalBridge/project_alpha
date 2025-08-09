import { searchLoader } from 'app/features/profile/loader';
import Search from 'app/features/profile/pages/search';

export const meta = () => [{ title: '유저 검색' }];

export const loader = searchLoader;

export default Search;
