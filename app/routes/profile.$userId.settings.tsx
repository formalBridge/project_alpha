import { settingsAction } from 'app/features/profile/action';
import { settingsLoader } from 'app/features/profile/loader';
import SettingsPage from 'app/features/profile/pages/settings';

export const loader = settingsLoader;
export const action = settingsAction;

export default SettingsPage;
