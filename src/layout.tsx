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

export const StandaloneLayout = ({ children }: { children: ReactNode }) => {
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);
  const { credentials, clearCredentials } = useUserContext();

  let aboutModal = null;
  let docsDropdownItems = [];
  let userDropdownItems = [];
  let userName: string;

  if (credentials) {
    userName = credentials.username;

    userDropdownItems = [
      <DropdownItem isDisabled key='username'>
        {t`Username: ${userName}`}
      </DropdownItem>,
      <DropdownSeparator key='separator' />,
      <DropdownItem
        key='profile'
        component={
          <Link to={formatPath(Paths.core.user.profile)}>{t`My profile`}</Link>
        }
      />,

      <DropdownItem
        key='logout'
        aria-label={'logout'}
        onClick={() => clearCredentials()}
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
        {credentials ? (
          <StatefulDropdown
            ariaLabel={t`Docs dropdown`}
            data-cy='docs-dropdown'
            defaultText={<QuestionCircleIcon />}
            items={docsDropdownItems}
            toggleType='icon'
          />
        ) : null}
        {!credentials ? (
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
