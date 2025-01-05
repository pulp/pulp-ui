import { Outlet, useNavigation } from 'react-router';
import { AppContextProvider } from 'src/app-context';
import { LoadingSpinner, UIVersion } from 'src/components';
import { StandaloneLayout } from 'src/layout';
import { UserContextProvider } from 'src/user-context';

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <UserContextProvider>
      <AppContextProvider>
        <StandaloneLayout>
          {isNavigating && <LoadingSpinner />}
          <Outlet />
        </StandaloneLayout>
        <UIVersion />
      </AppContextProvider>
    </UserContextProvider>
  );
}
