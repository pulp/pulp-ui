import { Outlet, useLoaderData } from 'react-router';
import { AppContextProvider } from 'src/app-context';
import { Layout } from 'src/layout';

export const handle = { loggedin: false };

export default function Root() {
  const user = useLoaderData();

  return (
    <AppContextProvider user={user}>
      <Layout>
        <Outlet />
      </Layout>
    </AppContextProvider>
  );
}

export const clientLoader = async () => {
  // TODO Don't use hardcoded paths.
  // TODO Look into using axios/pulp_api instead of plain fetch.
  const response = await fetch('/pulp/api/v3/login/', {
    headers: { 'X-Request-With': 'XMLHttpRequest' },
    credentials: 'same-origin',
  });
  if (response.ok) {
    handle['loggedin'] = true;
    return await response.json();
  } else {
    handle['loggedin'] = false;
    return { username: null };
  }
};
