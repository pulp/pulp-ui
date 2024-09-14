import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface IUserContextType {
  credentials: { username: string; password: string; remember: boolean };
  setCredentials: (
    username: string,
    password: string,
    remember?: boolean,
  ) => void;
  clearCredentials: () => void;
}

export const UserContext = createContext<IUserContextType>(undefined);
export const useUserContext = () => useContext(UserContext);

function cachedCredentials() {
  if (!window.sessionStorage.credentials && !window.localStorage.credentials) {
    return null;
  }

  try {
    return JSON.parse(
      window.sessionStorage.credentials || window.localStorage.credentials,
    );
  } catch (e) {
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
  }, [credentials]);

  return (
    <UserContext.Provider
      value={{
        credentials,
        setCredentials: (username, password, remember = false) =>
          setCredentials({ username, password, remember }),
        clearCredentials: () => setCredentials(null),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
