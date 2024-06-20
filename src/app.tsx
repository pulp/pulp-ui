import './app.scss';
import '@patternfly/patternfly/patternfly.scss';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UIVersion } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { useAppContext } from './app-context';
import { AppRoutes } from './app-routes';
import { StandaloneLayout } from './layout';

export const App = (_props) => {
  const { setUser, user } = useAppContext();

  // Hide navs on login page
  // FIXME: replace with "showing the login page" logic in router
  const location = useLocation();
  const showNav =
    location.pathname !== formatPath(Paths.login) &&
    (location.pathname !== UI_EXTERNAL_LOGIN_URI ||
      UI_EXTERNAL_LOGIN_URI === '/');

  return (
    <>
      {showNav ? (
        <StandaloneLayout user={user} setUser={setUser}>
          <AppRoutes setUser={setUser} />
        </StandaloneLayout>
      ) : (
        <AppRoutes setUser={setUser} />
      )}
      <UIVersion />
    </>
  );
};
