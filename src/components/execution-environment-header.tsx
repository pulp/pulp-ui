import { Trans, t } from '@lingui/macro';
import { type ReactElement } from 'react';
import { type ContainerRepositoryType } from 'src/api';
import {
  BaseHeader,
  Breadcrumbs,
  LinkTabs,
  SignatureBadge,
  Tooltip,
} from 'src/components';
import { Paths, formatEEPath, formatPath } from 'src/paths';
import { lastSyncStatus, lastSynced } from 'src/utilities';

interface IProps {
  container: ContainerRepositoryType;
  displaySignatures: boolean;
  groupId?: number;
  pageControls?: ReactElement;
  tab: string;
}

export const ExecutionEnvironmentHeader = ({
  container,
  displaySignatures,
  groupId,
  pageControls,
  tab,
}: IProps) => {
  const linkParams = { container: container.name };

  const tabs = [
    {
      active: tab === 'detail',
      title: t`Detail`,
      link: formatEEPath(Paths.container.repository.detail, linkParams),
    },
    {
      active: tab === 'activity',
      title: t`Activity`,
      link: formatEEPath(Paths.container.repository.activities, linkParams),
    },
    {
      active: tab === 'images',
      title: t`Images`,
      link: formatEEPath(Paths.container.repository.images, linkParams),
    },
    {
      active: tab === 'access',
      title: t`Access`,
      link: formatEEPath(Paths.container.repository.access, linkParams),
    },
  ];

  const last_sync_task = container.pulp.repository.remote?.last_sync_task;

  return (
    <BaseHeader
      title={container.name}
      breadcrumbs={
        <Breadcrumbs
          links={[
            {
              url: formatPath(Paths.container.repository.list),
              name: t`Containers`,
            },
            {
              name: container.name,
              url:
                tab === 'access'
                  ? formatEEPath(Paths.container.repository.detail, linkParams)
                  : null,
            },
            tab === 'access'
              ? {
                  name: t`Access`,
                  url: groupId
                    ? formatEEPath(
                        Paths.container.repository.access,
                        linkParams,
                      )
                    : null,
                }
              : null,
            tab === 'access' && groupId ? { name: t`Group ${groupId}` } : null,
          ].filter(Boolean)}
        />
      }
      pageControls={pageControls}
    >
      {displaySignatures && container.pulp.repository.sign_state && (
        <SignatureBadge
          isCompact
          signState={
            container.pulp.repository.sign_state == 'signed'
              ? 'signed'
              : 'unsigned'
          }
        />
      )}
      {last_sync_task && (
        <p className='pulp-m-truncated'>
          <Trans>
            Last updated from registry {lastSynced({ last_sync_task })}
          </Trans>{' '}
          {lastSyncStatus({ last_sync_task })}
        </p>
      )}
      <div style={{ height: '10px' }}>&nbsp;</div>
      <Tooltip content={container.description}>
        <p data-cy='description' className={'pulp-m-truncated'}>
          {container.description}
        </p>
      </Tooltip>

      <span />
      <div className='pulp-tab-link-container'>
        <div className='tabs'>
          <LinkTabs tabs={tabs} />
        </div>
      </div>
    </BaseHeader>
  );
};
