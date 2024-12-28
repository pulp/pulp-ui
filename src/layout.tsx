import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
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
import { Link, useFetcher } from 'react-router';
import {
  DarkmodeSwitcher,
  ExternalLink,
  LanguageSwitcher,
  LoginLink,
  PulpAboutModal,
  SmallLogo,
  StatefulDropdown,
  UIVersion,
} from 'src/components';
import { useAppContext } from './app-context';
import { StandaloneMenu } from './menu';
import { Paths, formatPath } from './paths';

export const Layout = ({ children }: { children: ReactNode }) => {
  const fetcher = useFetcher();
  const {
    account: { username },
  } = useAppContext();
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);

  let aboutModal = null;
  let docsDropdownItems = [];
  let userDropdownItems = [];

  const logout = () =>
    fetcher.submit(null, { method: 'delete', action: '/login' });

  if (username) {
    userDropdownItems = [
      <DropdownItem isDisabled key='username'>
        <Trans>Username: {username}</Trans>
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
        userName={username}
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
        <DarkmodeSwitcher />
        <LanguageSwitcher />
        {username ? (
          <StatefulDropdown
            ariaLabel={t`Docs dropdown`}
            data-cy='docs-dropdown'
            defaultText={<QuestionCircleIcon />}
            items={docsDropdownItems}
            toggleType='icon'
          />
        ) : null}
        {!username ? (
          <LoginLink />
        ) : (
          <StatefulDropdown
            ariaLabel={t`User dropdown`}
            data-cy='user-dropdown'
            defaultText={username}
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
        <StandaloneMenu />
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <>
      <Page isManagedSidebar header={Header} sidebar={Sidebar}>
        {children}
        {aboutModalVisible && aboutModal}
      </Page>
      <UIVersion />
    </>
  );
};
