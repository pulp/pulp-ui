import { Trans, t } from '@lingui/macro';
import { Flex, FlexItem, Label } from '@patternfly/react-core';
import { Td } from '@patternfly/react-table';
import { type FunctionComponent, useEffect, useState } from 'react';
import { UserAPI } from 'src/api';
import {
  AppliedFilters,
  CompoundFilter,
  EmptyStateFilter,
  EmptyStateNoData,
  LoadingSpinner,
  PulpPagination,
  RadioRow,
  RoleListTable,
} from 'src/components';
import { filterIsSet } from 'src/utilities';

interface UserType {
  username: string;
}

interface IProps {
  assignedUsers: UserType[];
  selectedUser?: UserType;
  updateUser?: (user) => void;
}

export const SelectUser: FunctionComponent<IProps> = ({
  assignedUsers,
  selectedUser,
  updateUser,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [localParams, setLocalParams] = useState({
    page: 1,
    page_size: 10,
  });

  useEffect(() => {
    queryUsers();
  }, [localParams]);

  const queryUsers = () => {
    setLoading(true);
    UserAPI.list(localParams).then(({ data }) => {
      setUsers(data.data);
      setUsersCount(data.meta.count);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className='pulp-custom-wizard-layout pulp-loading-wizard'>
        <LoadingSpinner />
      </div>
    );
  }

  const isSelected = ({ username }) => selectedUser?.username === username;

  const noData = users.length === 0;

  if (noData && !filterIsSet(localParams, ['username__contains'])) {
    return (
      <div className='pulp-custom-wizard-layout pulp-no-data'>
        <EmptyStateNoData
          title={t`No assignable users.`}
          description={t`There are currently no users that can be assigned ownership.`}
        />
      </div>
    );
  }

  const isAssigned = ({ username }) =>
    assignedUsers.some((user) => user.username === username);

  const tabHeader = {
    headers: [
      {
        title: '',
        type: 'none',
        id: 'expander',
      },
      {
        title: t`User`,
        type: 'alpha',
        id: 'username',
      },
    ],
  };

  return (
    <div className='pulp-custom-wizard-layout'>
      <Flex
        justifyContent={{
          default: noData
            ? 'justifyContentFlexStart'
            : 'justifyContentSpaceBetween',
        }}
        direction={{ default: 'column' }}
      >
        <FlexItem className='pulp-select-roles-content'>
          <Flex
            justifyContent={{
              default: noData
                ? 'justifyContentFlexStart'
                : 'justifyContentSpaceBetween',
            }}
            direction={{ default: 'column' }}
          >
            {selectedUser ? (
              <FlexItem>
                <Flex>
                  <FlexItem>
                    <strong>
                      <Trans>Selected user</Trans>
                    </strong>
                  </FlexItem>

                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Flex>
                      <FlexItem
                        key={selectedUser.username}
                        className='pulp-permission'
                      >
                        <Label>{selectedUser.username}</Label>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </FlexItem>
            ) : null}

            <FlexItem>
              <div className='pulp-filter'>
                <CompoundFilter
                  inputText={inputText}
                  onChange={(inputText) => setInputText(inputText)}
                  params={localParams}
                  updateParams={(p) => setLocalParams(p)}
                  filterConfig={[
                    {
                      id: 'username__contains',
                      title: t`Name`,
                    },
                  ]}
                />
              </div>

              <AppliedFilters
                updateParams={(p) => {
                  setLocalParams(p);
                  setInputText('');
                }}
                params={localParams}
                niceNames={{ username__contains: t`Name` }}
                ignoredParams={['sort', 'page_size', 'page']}
                style={{ marginTop: '8px' }}
              />
            </FlexItem>

            <FlexItem style={{ flexGrow: 1 }}>
              {noData && filterIsSet(localParams, ['username__contains']) ? (
                <div className='pulp-no-filter-data'>
                  <EmptyStateFilter />
                </div>
              ) : (
                <div className='pulp-selected-roles-list'>
                  <RoleListTable
                    isStickyHeader
                    params={localParams}
                    updateParams={(p) => {
                      setLocalParams(p);
                    }}
                    tableHeader={tabHeader}
                  >
                    {users.map((user, i) => (
                      <RadioRow
                        rowIndex={i}
                        key={user.username}
                        isSelected={isSelected(user)}
                        onSelect={() => updateUser(user)}
                        isDisabled={isAssigned(user)}
                        data-cy={`UserListTable-CheckboxRow-row-${user.username}`}
                      >
                        <Td>{user.username}</Td>
                      </RadioRow>
                    ))}
                  </RoleListTable>
                </div>
              )}
            </FlexItem>
          </Flex>
        </FlexItem>

        {!noData && (
          <FlexItem>
            <PulpPagination
              params={localParams}
              updateParams={(p) => setLocalParams(p)}
              count={usersCount}
            />
          </FlexItem>
        )}
      </Flex>
    </div>
  );
};
