import { currentUserLoader } from 'app/features/auth/loader';
import Home from 'app/features/home';
import { addTodaySongAction } from 'app/features/profile/action';

export { addTodaySongAction as action, currentUserLoader as loader };

export default Home;
