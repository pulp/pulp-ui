import { AlertActionCloseButton, AlertVariant } from '@patternfly/react-core';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { Alert } from 'src/components';

export interface AlertType {
  key?: number;
  id?: string;
  variant: 'danger' | 'success' | 'warning' | 'info' | 'custom' | AlertVariant;
  title: string | ReactNode;
  description?: string | ReactNode;
}

interface IAlertsContextType {
  alerts: AlertType[];
  addAlert: (alert: AlertType) => void;
  closeAlert: (id: number) => void;
}

// Do not export this to keep alerts and closeAlert private.
const AlertsContext = createContext<IAlertsContextType>(undefined);

// Provide an addAlert method.
// addAlert will add info alerts with 5s timeout.
// If an alert has a 'id' it will replace existing ones with the same 'id'.
export const useAddAlert = () => useContext(AlertsContext).addAlert;

export const AlertsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [{ alerts }, setAlertState] = useState<{
    counter: number;
    alerts: AlertType[];
  }>({ counter: 0, alerts: [] });

  const addAlert = (alert: AlertType) =>
    setAlertState(({ counter, alerts }) => {
      if (alert.variant === AlertVariant.info) {
        setTimeout(() => closeAlert(counter), 5000);
      }
      return {
        counter: counter + 1,
        alerts: [
          ...alerts.filter((item) => alert.id === null || item.id != alert.id),
          { ...alert, key: counter },
        ],
      };
    });

  const closeAlert = (key: number) =>
    setAlertState(({ counter, alerts }) => ({
      counter,
      alerts: alerts.filter((item) => item.key !== key),
    }));

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, closeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const AlertList = () => {
  const { alerts, closeAlert } = useContext(AlertsContext);

  return (
    <div
      style={{
        position: 'fixed',
        right: '5px',
        top: '80px', // 76 + 4
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
      data-cy='AlertList'
    >
      {alerts.map(({ key, title, variant, description }) => (
        <Alert
          style={{ marginBottom: '16px' }}
          key={key}
          title={title}
          variant={variant}
          actionClose={
            <AlertActionCloseButton onClose={() => closeAlert(key)} />
          }
        >
          {description}
        </Alert>
      ))}
    </div>
  );
};
