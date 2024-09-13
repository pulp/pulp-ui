import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface IUserContextType {
  credentials: { username: string; password: string };
  setCredentials: (username: string, password: string) => void;
  clearCredentials: () => void;
}

export const UserContext = createContext<IUserContextType>(undefined);
export const useUserContext = () => useContext(UserContext);

function cachedCredentials() {
  if (!window.sessionStorage.credentials) {
    return null;
  }

  try {
    return JSON.parse(window.sessionStorage.credentials);
  } catch (e) {
    return null;
  }
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState(cachedCredentials());

  useEffect(() => {
    window.sessionStorage.credentials = JSON.stringify(credentials);
  }, [credentials]);

  return (
    <UserContext.Provider
      value={{
        credentials,
        setCredentials: (username, password) =>
          setCredentials({ username, password }),
        clearCredentials: () => setCredentials(null),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
