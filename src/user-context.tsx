import Cookies from 'js-cookie';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { config } from 'src/ui-config';

interface IUserContextType {
  credentials: Credentials | null;
  isLoading: boolean;
  setCredentials: (
    username: string,
    password: string,
    remember?: boolean,
  ) => void;
  clearCredentials: () => Promise<void>;
  updateUsername: (username: string) => void;
  updatePassword: (password: string) => void;
}

interface Credentials {
  username: string;
  password: string;
  remember: boolean;
  authentication?: 'basic' | 'session';
}

const UserContext = createContext<IUserContextType>(undefined);
export const useUserContext = () => useContext(UserContext);

function cachedCredentials() {
  if (!window.sessionStorage.credentials && !window.localStorage.credentials) {
    return null;
  }

  try {
    const credentials = JSON.parse(
      window.sessionStorage.credentials || window.localStorage.credentials,
    );
    // A Django session is represented by its cookie, not by client-side
    // credentials. Always revalidate it after a page load.
    return credentials.authentication === 'session' ? null : credentials;
  } catch (_e) {
    return null;
  }
}

async function getSessionPage() {
  const response = await fetch(`${config.API_BASE_PATH}users/?limit=1`, {
    credentials: 'same-origin',
    headers: { Accept: 'text/html' },
  });

  if (!response.ok) {
    return {};
  }

  const document = new DOMParser().parseFromString(
    await response.text(),
    'text/html',
  );

  return {
    csrfToken: document.querySelector<HTMLInputElement>(
      'input[name="csrfmiddlewaretoken"]',
    )?.value,
    username: document
      .querySelector('a.dropdown-toggle[href="#"]')
      ?.textContent?.trim(),
  };
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState(cachedCredentials());
  const [isLoading, setIsLoading] = useState(
    Boolean(config.UI_EXTERNAL_LOGIN_URI && !credentials),
  );

  useEffect(() => {
    if (credentials || !config.UI_EXTERNAL_LOGIN_URI) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      // The browsable users endpoint exposes the authenticated Django session
      // user in its header. It avoids probing an unrelated permission such as
      // viewing tasks and is also the API backing the user's profile page.
      const { username } = await getSessionPage();

      if (!cancelled && username) {
        setCredentials({
          username,
          password: '',
          remember: false,
          authentication: 'session',
        });
      }
    };

    restoreSession()
      .catch(() => null)
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (credentials?.authentication === 'session') {
      window.localStorage.removeItem('credentials');
      window.sessionStorage.removeItem('credentials');
    } else if (credentials) {
      window.sessionStorage.credentials = JSON.stringify(credentials);
    }
    if (credentials?.remember && credentials.authentication !== 'session') {
      window.localStorage.credentials = JSON.stringify(credentials);
    }
    if (!credentials) {
      window.localStorage.removeItem('credentials');
      window.sessionStorage.removeItem('credentials');
    }
  }, [credentials]);

  const clearCredentials = async () => {
    try {
      if (credentials?.authentication === 'session') {
        // Django 5's LogoutView accepts POST only. Prefer the standard CSRF
        // cookie and fall back to the browsable API form token.
        const sessionPage = await getSessionPage();
        const csrfToken = Cookies.get('csrftoken') || sessionPage.csrfToken;

        if (csrfToken) {
          await fetch('/auth/logout/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-CSRFToken': csrfToken,
            },
            body: new URLSearchParams({
              csrfmiddlewaretoken: csrfToken,
              next: '/ui/status/',
            }),
          });
        }
      }
    } finally {
      // Always clear the local identity, even if the server-side logout is
      // temporarily unavailable. A remaining server session is revalidated
      // from its cookie on the next page load.
      window.localStorage.removeItem('credentials');
      window.sessionStorage.removeItem('credentials');
      setCredentials(null);
      window.location.assign('/ui/status/');
    }
  };

  return (
    <UserContext.Provider
      value={{
        credentials,
        isLoading,
        setCredentials: (username, password, remember = false) =>
          setCredentials({
            username,
            password,
            remember,
            authentication: 'basic',
          }),
        clearCredentials,
        updateUsername: (username) =>
          setCredentials((credentials) => ({ ...credentials, username })),
        updatePassword: (password) =>
          setCredentials((credentials) => ({ ...credentials, password })),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
