import './app.scss';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { I18nProvider } from '@lingui/react';
import '@patternfly/patternfly/patternfly.scss';
import { Button } from '@patternfly/react-core';
import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Alert, LoadingSpinner, UIVersion } from 'src/components';
import { AppContextProvider } from './app-context';
import { AppRoutes } from './app-routes';
import './darkmode';
import './l10n';
import { StandaloneLayout } from './layout';
import { configFallback, configPromise } from './ui-config';
import { UserContextProvider } from './user-context';

// App entrypoint

// redirect to UI_BASE_PATH when outside
// and strip ?lang= and ?pseudolocalization=
function redirect(UI_BASE_PATH) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!window.location.pathname.startsWith(UI_BASE_PATH)) {
    // react-router v6 won't redirect to base path by default
    window.history.pushState(null, null, UI_BASE_PATH);
  } else if (
    searchParams.has('lang') ||
    searchParams.has('pseudolocalization')
  ) {
    // delete lang after src/l10n uses it
    searchParams.delete('lang');
    searchParams.delete('pseudolocalization');
    window.history.pushState(
      null,
      null,
      window.location.pathname +
        (searchParams.toString() ? '?' + searchParams.toString() : ''),
    );
  }
}

configPromise.then(({ UI_BASE_PATH }) => redirect(UI_BASE_PATH));

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <LoadConfig />
    </I18nProvider>
  </StrictMode>,
);

function LoadConfig(_props) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configPromise
      .then((config) => {
        setLoading(false);
        setConfig(config);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !config) {
    return (
      <Alert
        variant='danger'
        isInline
        title={t`Error loading /pulp-ui-config.json`}
      >
        {error.toString()}
        <Button
          variant='link'
          onClick={() => {
            const c = configFallback();
            redirect(c.UI_BASE_PATH);
            setConfig(c);
            setError(null);
          }}
        >{t`Fall back to defaults`}</Button>
      </Alert>
    );
  }

  return (
    <BrowserRouter basename={config.UI_BASE_PATH}>
      <UserContextProvider>
        <AppContextProvider>
          <StandaloneLayout>
            <AppRoutes />
          </StandaloneLayout>
          <UIVersion />
        </AppContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  );
}
