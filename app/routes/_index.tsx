import { currentUserLoader } from 'app/features/auth/loader';
import Home from 'app/features/home';
import { action } from 'app/features/profile/action';

export { action, currentUserLoader as loader };

export default Home;
