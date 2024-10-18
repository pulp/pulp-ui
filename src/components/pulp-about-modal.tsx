import { t } from '@lingui/macro';
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import React, { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateComponent, ExternalLink, MaybeLink } from 'src/components';
import { Paths, formatPath } from 'src/paths';
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
  userName: string;
}

interface IApplicationInfo {
  pulp_core_version?: string;
}

export const PulpAboutModal = ({ isOpen, onClose, userName }: IProps) => {
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

  // FIXME
  const user = { username: userName, id: null, groups: [] };

  return (
    <AboutModal
      brandImageAlt={t`Pulp Logo`}
      brandImageSrc={PulpLogo}
      isOpen={isOpen}
      onClose={onClose}
      productName={APPLICATION_NAME}
    >
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <Label>{t`Pulp Core Version`}</Label>
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

          <Label>{t`UI Version`}</Label>
          <Value>
            <ExternalLink
              href={`https://github.com/pulp/pulp-ui/commit/${ui_sha}`}
            >
              {ui_sha}
            </ExternalLink>{' '}
            {ui_version ? (
              <>
                <ExternalLink
                  href={`https://github.com/pulp/pulp-ui/releases/tag/v${ui_version}`}
                >
                  {ui_version}
                </ExternalLink>{' '}
              </>
            ) : null}
            <DateComponent date={ui_date} />
          </Value>

          <Label>{t`Username`}</Label>
          <Value>
            <MaybeLink
              to={
                user.id
                  ? formatPath(Paths.core.user.detail, { user_id: user.id })
                  : null
              }
              title={userName}
            >
              {userName}
              {user?.username && user.username !== userName ? (
                <> ({user.username})</>
              ) : null}
            </MaybeLink>
          </Value>

          <Label>{t`User Groups`}</Label>
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
