import { Outlet, useLoaderData, useNavigation } from 'react-router';
import { PulpLoginAPI } from 'src/api';
import { AppContextProvider } from 'src/app-context';
import { LoadingSpinner, UIVersion } from 'src/components';
import { Layout } from 'src/layout';

export default function Root() {
  const account = useLoaderData();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <AppContextProvider account={account}>
        <Layout>
          {isNavigating && <LoadingSpinner />}
          <Outlet />
        </Layout>
        <UIVersion />
      </AppContextProvider>
  );
}

export const clientLoader = async () => {
  try {
    const result = await PulpLoginAPI.get();
    return result.data;
  } catch (e) {
    if (e.status == 401) {
      return { username: null };
    } else {
      throw e;
    }
  }
};
