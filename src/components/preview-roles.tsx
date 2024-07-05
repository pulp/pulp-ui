import { Trans } from '@lingui/macro';
import { Divider, Flex, FlexItem, Label } from '@patternfly/react-core';
import React, { Fragment } from 'react';
import { type RoleType } from 'src/api';
import { useAppContext } from 'src/app-context';
import { Tooltip } from 'src/components';
import { translateLockedRole } from 'src/utilities';

interface IProps {
  selectedRoles: RoleType[];
  user?: {
    username: string;
  };
  group?: {
    name: string;
  };
}

const splitByDot = (perm: string) => {
  const [category, permission] = perm.split('.', 2);
  const catTitle = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <>
      <strong>{catTitle}:</strong>&nbsp;{permission}
    </>
  );
};

export const PreviewRoles = ({ user, group, selectedRoles }: IProps) => {
  const { model_permissions } = useAppContext().user;

  return (
    <div className='pulp-custom-wizard-layout'>
      <p>
        {user ? (
          <Trans>
            The following roles will be applied to user:{' '}
            <strong>{user.username}</strong>
          </Trans>
        ) : null}
        {group ? (
          <Trans>
            The following roles will be applied to group:{' '}
            <strong>{group.name}</strong>
          </Trans>
        ) : null}
      </p>
      <Flex direction={{ default: 'column' }} className='pulp-preview-roles'>
        {selectedRoles.map((role) => (
          <Fragment key={role.name}>
            <FlexItem>
              <strong>{role.name}</strong>{' '}
              {role.description &&
                `- ${translateLockedRole(role.name, role.description)}`}
              <Flex className='pulp-permissions'>
                {role.permissions.map((permission) => (
                  <FlexItem
                    key={permission}
                    className='pulp-permission'
                    data-cy={`PulpPermission-${permission}`}
                  >
                    <Tooltip
                      content={
                        model_permissions[permission]?.name || permission
                      }
                    >
                      <Label>{splitByDot(permission)}</Label>
                    </Tooltip>
                  </FlexItem>
                ))}
              </Flex>
            </FlexItem>
            <FlexItem>
              <Divider />
            </FlexItem>
          </Fragment>
        ))}
      </Flex>
    </div>
  );
};
