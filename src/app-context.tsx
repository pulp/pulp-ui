import { type ReactNode, createContext, useContext, useState } from 'react';
import { type AlertType } from 'src/components';

export interface IAccount {
  username?: string;
  pulp_href?: string;
  prn?: string;
}
export interface IAppContextType {
  alerts: AlertType[];
  featureFlags; // deprecated
  hasPermission: (name: string) => boolean;
  queueAlert: (alert: AlertType) => void;
  setAlerts: (alerts: AlertType[]) => void;
  settings; // deprecated
  account: IAccount;
}

export const AppContext = createContext<IAppContextType>(undefined);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({
  account,
  children,
}: {
  account: IAccount;
  children: ReactNode;
}) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  // hub compat for now
  const featureFlags = {
    container_signing: true,
    execution_environments: true,
    external_authentication: false,
    display_repositories: true,
    can_create_signatures: true,
    can_upload_signatures: true,
    collection_auto_sign: true,
    collection_signing: true,
    display_signatures: true,
    require_upload_signatures: false,
  };
  const settings = {
    GALAXY_COLLECTION_SIGNING_SERVICE: 'mock_signing',
    GALAXY_CONTAINER_SIGNING_SERVICE: 'mock_signing',
  };

  const queueAlert = (alert) => setAlerts((alerts) => [...alerts, alert]);
  const hasPermission = (_name) => true; // FIXME: permission handling

  return (
    <AppContext.Provider
      value={{
        alerts,
        featureFlags,
        hasPermission,
        queueAlert,
        setAlerts,
        settings,
        account,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
