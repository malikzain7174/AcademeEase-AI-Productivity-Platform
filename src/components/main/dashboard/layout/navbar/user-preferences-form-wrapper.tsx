import { getUserPreferences } from '@/actions/user';
import { UserPreferencesForm } from './user-preferences-form';

export async function UserPreferencesFormWrapper() {
  const preferences = await getUserPreferences();
  return (
    <UserPreferencesForm initialValues={preferences} className='px-4 md:px-0' />
  );
}
