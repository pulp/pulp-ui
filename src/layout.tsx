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
import { ActiveUserAPI, type UserType } from 'src/api';
import {
  ExternalLink,
  LanguageSwitcher,
  LoginLink,
  PulpAboutModal,
  SmallLogo,
  StatefulDropdown,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { StandaloneMenu } from './menu';

interface IProps {
  children: ReactNode;
  setUser: (user) => void;
  user: UserType;
}

export const StandaloneLayout = ({ children, setUser, user }: IProps) => {
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);

  let aboutModal = null;
  let docsDropdownItems = [];
  let userDropdownItems = [];
  let userName: string;

  if (user) {
    userName =
      [user.first_name, user.last_name].filter(Boolean).join(' ') ||
      user.username;

    userDropdownItems = [
      <DropdownItem isDisabled key='username'>
        <Trans>Username: {user.username}</Trans>
      </DropdownItem>,
      <DropdownSeparator key='separator' />,
      <DropdownItem
        key='profile'
        component={
          <Link
            to={formatPath(Paths.userProfileSettings)}
          >{t`My profile`}</Link>
        }
      />,

      <DropdownItem
        key='logout'
        aria-label={'logout'}
        onClick={() =>
          ActiveUserAPI.logout()
            .then(() => ActiveUserAPI.getUser().catch(() => null))
            .then((user) => setUser(user))
        }
      >
        {t`Logout`}
      </DropdownItem>,
    ];

    docsDropdownItems = [
      <DropdownItem
        key='documentation'
        component={
          <ExternalLink
            href={UI_DOCS_URL}
            variant='menu'
          >{t`Documentation`}</ExternalLink>
        }
      />,
      <DropdownItem key='about' onClick={() => setAboutModalVisible(true)}>
        {t`About`}
      </DropdownItem>,
    ].filter(Boolean);

    aboutModal = (
      <PulpAboutModal
        isOpen={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
        user={user}
        userName={userName}
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
          <Link to={formatPath(Paths.search)}>
            <SmallLogo alt={APPLICATION_NAME} />
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
        <LanguageSwitcher />
        {user ? (
          <StatefulDropdown
            ariaLabel={t`Docs dropdown`}
            data-cy='docs-dropdown'
            defaultText={<QuestionCircleIcon />}
            items={docsDropdownItems}
            toggleType='icon'
          />
        ) : null}
        {!user || user.is_anonymous ? (
          <LoginLink />
        ) : (
          <StatefulDropdown
            ariaLabel={t`User dropdown`}
            data-cy='user-dropdown'
            defaultText={userName}
            items={userDropdownItems}
            toggleType='dropdown'
          />
        )}
      </MastheadContent>
    </Masthead>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <StandaloneMenu context={{ user }} />
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
