import type { FC } from 'react';
import './status-indicator.css';

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

interface StatusIndicatorProps {
  tone: StatusTone;
  text: string;
}

const StatusIndicator: FC<StatusIndicatorProps> = ({ tone, text }) => (
  <span
    role='status'
    className={`pulp-status-indicator pulp-status-indicator--${tone}`}
  >
    {text}
  </span>
);

export { StatusIndicator };
export type { StatusTone };
