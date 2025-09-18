import { Outlet, useNavigation } from 'react-router';
import { AppContextProvider } from 'src/app-context';
import { LoadingSpinner, UIVersion } from 'src/components';
import { AlertsContextProvider } from 'src/components/alerts';
import { Layout } from 'src/layout';
import { UserContextProvider } from 'src/user-context';

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <AlertsContextProvider>
      <UserContextProvider>
        <AppContextProvider>
          <Layout>
            {isNavigating && <LoadingSpinner />}
            <Outlet />
          </Layout>
          <UIVersion />
        </AppContextProvider>
      </UserContextProvider>
    </AlertsContextProvider>
  );
}
