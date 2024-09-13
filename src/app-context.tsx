import React, {
  type ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';
import { type FeatureFlagsType, type SettingsType } from 'src/api';
import { type AlertType } from 'src/components';
import { useUserContext } from './user-context';

export interface IAppContextType {
  alerts: AlertType[];
  featureFlags: FeatureFlagsType; // deprecated
  hasPermission: (name: string) => boolean;
  queueAlert: (alert: AlertType) => void;
  selectedRepo?: string; // deprecated
  setAlerts: (alerts: AlertType[]) => void;
  settings: SettingsType; // deprecated
  updateTitle: (title: string) => void; // deprecated
  user; // deprecated
}

export const AppContext = createContext<IAppContextType>(undefined);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const { credentials } = useUserContext();

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
    signatures_enabled: true,
    _messages: [],
  };
  const settings = {
    GALAXY_AUTO_SIGN_COLLECTIONS: true,
    GALAXY_COLLECTION_SIGNING_SERVICE: 'mock_signing',
    GALAXY_CONTAINER_SIGNING_SERVICE: 'mock_signing',
    GALAXY_ENABLE_UNAUTHENTICATED_COLLECTION_ACCESS: true,
    GALAXY_ENABLE_UNAUTHENTICATED_COLLECTION_DOWNLOAD: true,
    GALAXY_REQUIRE_CONTENT_APPROVAL: true,
    GALAXY_REQUIRE_SIGNATURE_FOR_APPROVAL: true,
    GALAXY_SIGNATURE_UPLOAD_ENABLED: true,
    GALAXY_TOKEN_EXPIRATION: null,
    GALAXY_LDAP_MIRROR_ONLY_EXISTING_GROUPS: true,
  };

  const queueAlert = (alert) => setAlerts((alerts) => [...alerts, alert]);
  const hasPermission = (_name) => true; // FIXME: permission handling
  const updateTitle = (title) => {
    document.title = title
      ? `${APPLICATION_NAME} - ${title}`
      : APPLICATION_NAME;
  };

  return (
    <AppContext.Provider
      value={{
        alerts,
        featureFlags,
        hasPermission,
        queueAlert,
        setAlerts,
        settings,
        updateTitle,
        // FIXME: hack
        user: credentials
          ? {
              username: credentials.username,
              groups: [],
              is_superuser: true,
              is_anonymous: false,
              model_permissions: {},
            }
          : null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
