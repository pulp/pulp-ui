import { Trans, t } from '@lingui/macro';
import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
} from '@patternfly/react-core';
import {
  DropdownItem,
  DropdownSeparator,
} from '@patternfly/react-core/deprecated';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';
import React, { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DarkmodeSwitcher,
  ExternalLink,
  LanguageSwitcher,
  LoginLink,
  PulpAboutModal,
  SmallLogo,
  StatefulDropdown,
} from 'src/components';
import { StandaloneMenu } from './menu';
import { Paths, formatPath } from './paths';
import { useUserContext } from './user-context';

const DocsDropdown = ({ showAbout }: { showAbout: () => void }) => (
  <StatefulDropdown
    ariaLabel={t`Docs dropdown`}
    data-cy='docs-dropdown'
    defaultText={<QuestionCircleIcon />}
    items={[
      <DropdownItem
        key='documentation'
        component={
          <ExternalLink
            href={UI_DOCS_URL}
            variant='menu'
          >{t`Documentation`}</ExternalLink>
        }
      />,
      <DropdownItem key='about' onClick={() => showAbout()}>
        {t`About`}
      </DropdownItem>,
    ]}
    toggleType='icon'
  />
);

const UserDropdown = ({
  username,
  clearCredentials,
}: {
  username?: string;
  clearCredentials: () => void;
}) =>
  username ? (
    <StatefulDropdown
      ariaLabel={t`User dropdown`}
      data-cy='user-dropdown'
      defaultText={username}
      items={[
        <DropdownItem isDisabled key='username'>
          <Trans>Username: {username}</Trans>
        </DropdownItem>,
        <DropdownSeparator key='separator' />,
        <DropdownItem
          key='profile'
          component={
            <Link
              to={formatPath(Paths.core.user.profile)}
            >{t`My profile`}</Link>
          }
        />,
        <DropdownItem
          key='logout'
          aria-label={'logout'}
          onClick={() => clearCredentials()}
        >
          {t`Logout`}
        </DropdownItem>,
      ]}
      toggleType='dropdown'
    />
  ) : null;

export const StandaloneLayout = ({ children }: { children: ReactNode }) => {
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);
  const { getUsername, clearCredentials } = useUserContext();

  const username = getUsername();

  const Header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton>
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <Link to={formatPath(Paths.core.status)}>
            <SmallLogo alt={APPLICATION_NAME} />
          </Link>
          <span
            style={{
              padding: '9px 0 0 4px',
            }}
          >
            {APPLICATION_NAME}
          </span>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span style={{ flexGrow: 1 }} />
        <DarkmodeSwitcher />
        <LanguageSwitcher />
        <DocsDropdown showAbout={() => setAboutModalVisible(true)} />
        {username ? (
          <UserDropdown
            clearCredentials={clearCredentials}
            username={username}
          />
        ) : (
          <LoginLink />
        )}
      </MastheadContent>
    </Masthead>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <StandaloneMenu />
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page isManagedSidebar header={Header} sidebar={Sidebar}>
      {children}
      {aboutModalVisible ? (
        <PulpAboutModal
          isOpen
          onClose={() => setAboutModalVisible(false)}
          username={username}
        />
      ) : null}
    </Page>
  );
};
