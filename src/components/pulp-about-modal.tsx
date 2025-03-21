import { t } from '@lingui/core/macro';
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { DateComponent, ExternalLink, MaybeLink } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { config } from 'src/ui-config';
import { plugin_versions } from 'src/utilities';
import PulpLogo from 'static/images/pulp_logo.png';

const Label = ({ children }: { children: ReactNode }) => (
  <TextListItem component={TextListItemVariants.dt}>{children}</TextListItem>
);

const Value = ({ children }: { children: ReactNode }) => (
  <TextListItem component={TextListItemVariants.dd}>{children}</TextListItem>
);

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

interface IApplicationInfo {
  pulp_core_version?: string;
}

export const PulpAboutModal = ({ isOpen, onClose, username }: IProps) => {
  const [applicationInfo, setApplicationInfo] = useState<IApplicationInfo>({});

  useEffect(() => {
    plugin_versions().then((arr) =>
      setApplicationInfo({
        pulp_core_version: arr.find((p) => p.name == 'core').version,
      }),
    );
  }, []);

  const {
    pulp_core_version, // e.g. 3.65.0
  } = applicationInfo;

  const ui_sha = UI_BUILD_INFO?.hash?.slice(0, 7);
  const ui_date = UI_BUILD_INFO?.date;
  const ui_version = UI_BUILD_INFO?.version;
  const ui_extra = config.EXTRA_VERSION;

  // FIXME
  const user = { username, id: null, groups: [] };

  return (
    <AboutModal
      brandImageAlt={t`Pulp logo`}
      brandImageSrc={PulpLogo}
      isOpen={isOpen}
      onClose={onClose}
      productName='Pulp UI'
    >
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <Label>{t`Pulp core version`}</Label>
          <Value>
            {pulp_core_version?.includes('.dev') ? (
              pulp_core_version
            ) : (
              <ExternalLink
                href={`https://github.com/pulp/pulpcore/releases/tag/${pulp_core_version}`}
              >
                {pulp_core_version}
              </ExternalLink>
            )}
          </Value>

          <Label>{t`UI version`}</Label>
          <Value>
            {ui_version ? (
              <>
                <ExternalLink
                  href={`https://github.com/pulp/pulp-ui/releases/tag/v${ui_version}`}
                >
                  {ui_version}
                </ExternalLink>{' '}
              </>
            ) : null}
            {ui_version ? '(' : null}
            <ExternalLink
              href={`https://github.com/pulp/pulp-ui/commit/${ui_sha}`}
            >
              {ui_sha}
            </ExternalLink>
            {', '}
            <DateComponent date={ui_date} />
            {ui_version ? ')' : null}
            {ui_extra ? (
              <>
                <br />
                {ui_extra}
              </>
            ) : null}
          </Value>

          <Label>{t`Username`}</Label>
          <Value>
            <MaybeLink
              to={
                user.id
                  ? formatPath(Paths.core.user.detail, { user_id: user.id })
                  : null
              }
              title={username}
            >
              {username}
              {user?.username && user.username !== username ? (
                <> ({user.username})</>
              ) : null}
            </MaybeLink>
          </Value>

          <Label>{t`User groups`}</Label>
          <Value>
            {user.groups.map(({ id: group, name }, index) => (
              <>
                {index ? ', ' : null}
                <Link
                  key={group}
                  to={formatPath(Paths.core.group.detail, { group })}
                >
                  {name}
                </Link>
              </>
            ))}
          </Value>
        </TextList>
      </TextContent>
    </AboutModal>
  );
};
