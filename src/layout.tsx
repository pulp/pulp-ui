import { t } from '@lingui/core/macro';
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
import { type ReactNode, useState } from 'react';
import { Link } from 'react-router';
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
            href='https://docs.pulpproject.org/'
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
  logout,
}: {
  username: string;
  logout: () => void;
}) => (
  <StatefulDropdown
    ariaLabel={t`User dropdown`}
    data-cy='user-dropdown'
    defaultText={username}
    items={[
      <DropdownItem isDisabled key='username'>
        {t`Username: ${username}`}
      </DropdownItem>,
      <DropdownSeparator key='separator' />,
      <DropdownItem
        key='profile'
        component={
          <Link to={formatPath(Paths.core.user.profile)}>{t`My profile`}</Link>
        }
      />,
      <DropdownItem key='logout' aria-label={'logout'} onClick={() => logout()}>
        {t`Logout`}
      </DropdownItem>,
    ]}
    toggleType='dropdown'
  />
);

export const StandaloneLayout = ({ children }: { children: ReactNode }) => {
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);
  const { credentials, clearCredentials } = useUserContext();

  let aboutModal = null;
  let username: string;

  if (credentials) {
    username = credentials.username;

    aboutModal = (
      <PulpAboutModal
        isOpen={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
        username={username}
      />
    );
  }

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
            <SmallLogo alt='Pulp UI' />
          </Link>
          <span
            style={{
              padding: '9px 0 0 4px',
            }}
          >
            Pulp UI
          </span>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span style={{ flexGrow: 1 }} />
        <DarkmodeSwitcher />
        <LanguageSwitcher />
        <DocsDropdown showAbout={() => setAboutModalVisible(true)} />
        {credentials ? (
          <UserDropdown username={username} logout={() => clearCredentials()} />
        ) : null}
        {!credentials ? <LoginLink /> : null}
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
      {aboutModalVisible && aboutModal}
    </Page>
  );
};
