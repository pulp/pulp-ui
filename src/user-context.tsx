import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IUserContextType {
  clearCredentials: () => void;
  credentials: { username: string; password: string; remember: boolean };
  getUsername: () => string;
  hasPermission: (name: string) => boolean;
  isLoggedIn: () => boolean;
  setCredentials: (
    username: string,
    password: string,
    remember?: boolean,
  ) => void;
  updatePassword: (password: string) => void;
  updateUsername: (username: string) => void;
}

const UserContext = createContext<IUserContextType>(undefined);
export const useUserContext = () => useContext(UserContext);

function cachedCredentials() {
  if (!window.sessionStorage.credentials && !window.localStorage.credentials) {
    return null;
  }

  try {
    return JSON.parse(
      window.sessionStorage.credentials || window.localStorage.credentials,
    );
  } catch (_e) {
    return null;
  }
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState(cachedCredentials());

  useEffect(() => {
    window.sessionStorage.credentials = JSON.stringify(credentials);
    if (credentials?.remember) {
      window.localStorage.credentials = JSON.stringify(credentials);
    }
    if (!credentials) {
      window.localStorage.removeItem('credentials');
      window.sessionStorage.removeItem('credentials');
    }

    // if (!credentials) {
    //   setCredentials({ username: 'HACK' });
    // }
  }, [credentials]);

  const getUsername = () => credentials?.username;
  const isLoggedIn = () => !!credentials?.username;
  const hasPermission = (_name) => true; // FIXME: permission handling

  return (
    <UserContext.Provider
      value={{
        clearCredentials: () => setCredentials(null),
        credentials,
        getUsername,
        hasPermission,
        isLoggedIn,
        setCredentials: (username, password, remember = false) =>
          setCredentials({ username, password, remember }),
        updatePassword: (password) =>
          setCredentials((credentials) => ({ ...credentials, password })),
        updateUsername: (username) =>
          setCredentials((credentials) => ({ ...credentials, username })),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
