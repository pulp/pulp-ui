import './app.scss';
import '@patternfly/patternfly/patternfly.scss';
import React from 'react';
import { UIVersion } from 'src/components';
import { useAppContext } from './app-context';
import { AppRoutes } from './app-routes';
import { StandaloneLayout } from './layout';

export const App = (_props) => {
  const { setUser, user } = useAppContext();

  return (
    <>
      <StandaloneLayout user={user} setUser={setUser}>
        <AppRoutes setUser={setUser} />
      </StandaloneLayout>
      <UIVersion />
    </>
  );
};
