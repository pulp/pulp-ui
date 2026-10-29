import { t } from '@lingui/core/macro';
import { Table, Td, Th, Tr } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  GenericPulpAPI,
  ContainerRepositoryNativeAPI,
  type ContainerRepositoryVersionType,
} from 'src/api';
import {
  ClipboardCopy,
  DateComponent,
  DetailList,
  Details,
  EmptyStateNoData,
  ListItemActions,
  Spinner,
} from 'src/components';
import { Paths, formatEEPath } from 'src/paths';
import { getContainersURL } from 'src/utilities';
import { type ContainerDetailTabProps } from './execution-environment-detail-native';

const ContentSummary = ({ data }: { data: object }) => {
  if (!Object.keys(data).length) {
    return <>{t`None`}</>;
  }

  return (
    <Table>
      <Tr>
        <Th>{t`Count`}</Th>
        <Th>{t`Pulp type`}</Th>
      </Tr>
      {Object.entries(data).map(([key, value]) => (
        <Tr key={key}>
          <Td>{value['count']}</Td>
          <Th>{key}</Th>
        </Tr>
      ))}
    </Table>
  );
};

const BaseVersion = ({
  basePath,
  data,
}: {
  basePath: string;
  data?: string;
}) => {
  if (!data) {
    return <>{t`None`}</>;
  }

  const number = data.split('/').at(-2);
  return (
    <Link
      to={formatEEPath(
        Paths.container.repository.detail,
        {
          container: basePath,
        },
        {
          repositoryVersion: number,
          tab: 'repository-versions',
        },
      )}
    >
      {number}
    </Link>
  );
};

interface ContainerTagType {
  name: string;
  tagged_manifest: string;
}

interface ContainerManifestType {
  pulp_href: string;
  digest: string;
}

interface PullReference {
  tag: string;
  digest?: string;
}

const PullReferences = ({
  refs,
  basePath,
  loading,
}: {
  refs: PullReference[];
  basePath: string;
  loading: boolean;
}) => {
  if (loading) {
    return <Spinner size='sm' />;
  }

  if (!refs.length) {
    return <>{t`None`}</>;
  }

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      {refs.map((ref) => (
        <div key={`${ref.tag}-${ref.digest || 'no-digest'}`}>
          <div style={{ marginBottom: '4px' }}>
            <strong>{ref.tag}</strong>
          </div>
          <ClipboardCopy isCode isReadOnly variant='inline-compact'>
            {getContainersURL({ name: basePath, tag: ref.tag })}
          </ClipboardCopy>
          {ref.digest ? (
            <div style={{ marginTop: '4px' }}>
              <ClipboardCopy isCode isReadOnly variant='inline-compact'>
                {getContainersURL({ name: basePath, digest: ref.digest })}
              </ClipboardCopy>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export const RepositoryVersionsTab = ({
  item,
  actionContext: { addAlert, state, hasPermission, hasObjectPermission },
}: ContainerDetailTabProps) => {
  const repository = item.repository;

  if (!repository) {
    return (
      <EmptyStateNoData
        title={t`No repository versions yet`}
        description={t`This container does not have an associated repository version history.`}
      />
    );
  }

  const latestHref = repository.latest_version_href;
  const basePath = item.base_path;
  const queryList = ({ params }) =>
    ContainerRepositoryNativeAPI.listVersionsByHref(repository.pulp_href, params);
  const queryDetail = ({ number }) =>
    ContainerRepositoryNativeAPI.listVersionsByHref(repository.pulp_href, {
      number,
    });
  const [modalState, setModalState] = useState({});
  const [version, setVersion] = useState<ContainerRepositoryVersionType | null>(
    null,
  );
  const [pullReferences, setPullReferences] = useState<PullReference[]>([]);
  const [pullReferencesLoading, setPullReferencesLoading] = useState(false);

  useEffect(() => {
    if (state.params.repositoryVersion) {
      queryDetail({ number: state.params.repositoryVersion }).then(({ data }) => {
        if (!data?.results?.[0]) {
          addAlert({
            variant: 'danger',
            title: t`Failed to find repository version`,
          });
        }
        setVersion(data.results[0]);
      });
    } else {
      setVersion(null);
    }
  }, [state.params.repositoryVersion]);

  useEffect(() => {
    if (!version?.pulp_href) {
      setPullReferences([]);
      return;
    }

    setPullReferencesLoading(true);

    Promise.all([
      GenericPulpAPI.list('content/container/tags/', {
        repository_version: version.pulp_href,
        limit: 200,
        offset: 0,
      }),
      GenericPulpAPI.list('content/container/manifests/', {
        repository_version: version.pulp_href,
        limit: 200,
        offset: 0,
      }),
    ])
      .then(([tagResult, manifestResult]) => {
        const tags = (tagResult?.data?.results || []) as ContainerTagType[];
        const manifests =
          (manifestResult?.data?.results || []) as ContainerManifestType[];

        const digestByManifestHref = new Map(
          manifests.map((manifest) => [manifest.pulp_href, manifest.digest]),
        );

        setPullReferences(
          tags.map((tag) => ({
            tag: tag.name,
            digest: digestByManifestHref.get(tag.tagged_manifest),
          })),
        );
      })
      .catch(() => setPullReferences([]))
      .finally(() => setPullReferencesLoading(false));
  }, [version?.pulp_href]);

  const renderTableRow = (
    versionItem: ContainerRepositoryVersionType,
    index: number,
    actionCtx,
    listItemActions,
  ) => {
    const { number, pulp_created, pulp_href } = versionItem;

    const isLatest = latestHref === pulp_href;

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...versionItem, isLatest }, actionCtx),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link
            to={formatEEPath(
              Paths.container.repository.detail,
              {
                container: basePath,
              },
              {
                repositoryVersion: number,
                tab: 'repository-versions',
              },
            )}
          >
            {number}
          </Link>
          {isLatest ? ' ' + t`(latest)` : null}
        </Td>
        <Td>
          <DateComponent date={pulp_created} />
        </Td>
        <ListItemActions kebabItems={kebabItems} />
      </Tr>
    );
  };

  return state.params.repositoryVersion ? (
    version ? (
      <Details
        fields={[
          { label: t`Version number`, value: version.number },
          {
            label: t`Created date`,
            value: <DateComponent date={version.pulp_created} />,
          },
          {
            label: t`Content added`,
            value: <ContentSummary data={version.content_summary?.added || {}} />,
          },
          {
            label: t`Content removed`,
            value: <ContentSummary data={version.content_summary?.removed || {}} />,
          },
          {
            label: t`Current content`,
            value: <ContentSummary data={version.content_summary?.present || {}} />,
          },
          {
            label: t`Base version`,
            value: <BaseVersion basePath={basePath} data={version.base_version} />,
          },
          {
            label: t`Pull references`,
            value: (
              <PullReferences
                refs={pullReferences}
                basePath={basePath}
                loading={pullReferencesLoading}
              />
            ),
          },
        ]}
      />
    ) : (
      <Spinner size='md' />
    )
  ) : (
    <DetailList<ContainerRepositoryVersionType>
      actionContext={{
        addAlert,
        state: modalState,
        setState: setModalState,
        query: queryList,
        hasPermission,
        hasObjectPermission,
      }}
      defaultPageSize={10}
      defaultSort='-pulp_created'
      errorTitle={t`Repository versions could not be displayed.`}
      filterConfig={null}
      listItemActions={[]}
      noDataButton={null}
      noDataDescription={t`Repository versions will appear once the repository is modified.`}
      noDataTitle={t`No repository versions yet`}
      query={queryList}
      renderTableRow={renderTableRow}
      sortHeaders={[
        {
          title: t`Version number`,
          type: 'numeric',
          id: 'number',
        },
        {
          title: t`Created date`,
          type: 'numeric',
          id: 'pulp_created',
        },
      ]}
      title={t`Repository versions`}
    />
  );
};
