import WrenchIcon from '@patternfly/react-icons//dist/esm/icons/wrench-icon';
import React from 'react';
import { EmptyStateCustom } from 'src/components';
import { t } from '@lingui/macro';

// TODO add link to Pulp page
export const EmptyStateNotImplemented = () => {
  return (
    <EmptyStateCustom
      icon={WrenchIcon}
      title={t`Under construction`}
      description={t`This functionality is not yet finished. For mor information please go to Pulp page`}
    />
  );
};
