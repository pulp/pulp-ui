import { t } from '@lingui/macro';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React, { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RPMPackageAPI, RPMRepositoryAPI } from 'src/api';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  CompoundFilter,
  EmptyStateXs,
  LoadingSpinner,
  Main,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  ParamHelper,
  type RouteProps,
  handleHttpError,
  withRouter,
} from 'src/utilities';

const PageSection = ({
  children,
  ...rest
}: {
  children: ReactNode;
  style?;
}) => (
  <section className='pulp-section' {...rest}>
    {children}
  </section>
);

const SectionSeparator = () => <section>&nbsp;</section>;

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className='pf-v5-c-title'>{children}</h2>
);

const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <>
    <SectionSeparator />
    <PageSection>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </PageSection>
  </>
);

const SearchBar = ({
  params,
  style,
  updateParams,
}: {
  params?;
  style?;
  updateParams: (p) => void;
}) => {
  const [inputText, setInputText] = useState<string>('');

  const filterConfig = [
    {
      id: 'name',
      title: t`Name (exact)`,
    },
    {
      id: 'name__contains',
      title: t`Name (contains)`,
    },
    {
      id: 'name__startswith',
      title: t`Name (starts with)`,
    },
    {
      id: 'epoch',
      title: t`Epoch (exact)`,
    },
    {
      id: 'version',
      title: t`Version (exact)`,
    },
    {
      id: 'release__contains',
      title: t`Release (contains)`,
    },
    {
      id: 'arch__contains',
      title: t`Arch (contains)`,
    },
  ];
  const niceNames = Object.fromEntries(
    filterConfig.map(({ id, title }) => [id, title]),
  );

  return (
    <PageSection style={style}>
      <div className='pulp-toolbar'>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <CompoundFilter
                  inputText={inputText}
                  onChange={setInputText}
                  updateParams={(p) => updateParams(p)}
                  params={params || {}}
                  filterConfig={filterConfig}
                />
                {/* FIXME checkbox for only latest version of each repo vs all .. or number for max? */}
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </div>
      <div>
        <AppliedFilters
          updateParams={(p) => {
            updateParams(p);
            setInputText('');
          }}
          params={params || {}}
          ignoredParams={['page_size', 'page', 'sort', 'ordering']}
          niceNames={niceNames}
        />
      </div>
    </PageSection>
  );
};

// FIXME: `namespace` - eliminate
const PackageListItem = ({
  namespace,
}: {
  namespace: { company: string; name: string };
}) => {
  const { name } = namespace;
  const namespace_url = formatPath(Paths.ansible.namespace.detail, {
    namespace: name,
  });

  return (
    <DataListItem data-cy='PackageListItem'>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key='content' size={10}>
              <div>
                <Link to={namespace_url}>{name}</Link>
              </div>
            </DataListCell>,
          ].filter(Boolean)}
        />
      </DataListItemRow>
    </DataListItem>
  );
};

const loading = [];

function useRepositories({ addAlert }) {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    setRepositories(loading);

    RPMRepositoryAPI.list({ page_size: 100 })
      .then(({ data: { results } }) => setRepositories(results || []))
      .catch(
        handleHttpError(
          t`Failed to load repositories`,
          () => setRepositories([]),
          addAlert,
        ),
      );
  }, []);

  return repositories;
}

const RPMSearch = (props: RouteProps) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [params, setParams] = useState({});

  //const [collections, setCollections] = useState([]);
  const [namespaces, setNamespaces] = useState([]);

  // TODO keywords isn't
  const keywords = (params as { keywords: string })?.keywords || '';

  const repositories = useRepositories({ addAlert });

  function addAlert(alert: AlertType) {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  }

  function query() {
    if (!keywords) {
      //setCollections([]);
      setNamespaces([]);
      return;
    }

    const shared = { page_size: 10 };

    // setCollections(loading);
    // FIXME .. query should only call package api .. but per each repo
    RPMPackageAPI.list({ ...shared, keywords, is_highest: true })
      //   .then(({ data: { data } }) => setCollections(data || []))
      .catch(
        handleHttpError(
          t`Failed to search collections (${keywords})`,
          // () => setCollections([]),
          () => null,
          addAlert,
        ),
      );
  }

  function updateParams(params) {
    delete params.page;

    props.navigate({
      search: '?' + ParamHelper.getQueryString(params || []),
    });

    setParams(params);
  }

  useEffect(() => {
    setParams(ParamHelper.parseParamString(props.location.search));
  }, [props.location.search]);

  useEffect(() => {
    query();
  }, [keywords]);

  const ResultsSection = ({
    children,
    items,
    showAllLink,
    showMoreLink,
    title,
  }: {
    children: ReactNode;
    items;
    showAllLink: ReactNode;
    showMoreLink: ReactNode;
    title: string;
  }) =>
    items === loading || !keywords || items.length ? (
      <Section title={title}>
        {items === loading ? (
          <LoadingSpinner />
        ) : !keywords ? (
          showAllLink
        ) : (
          <>
            {children}
            {showMoreLink}
            <br />
            {showAllLink}
          </>
        )}
      </Section>
    ) : null;

  return (
    <>
      <BaseHeader title={t`Search`} />
      <AlertList
        alerts={alerts}
        closeAlert={(i) => closeAlert(i, { alerts, setAlerts })}
      />
      <Main>
        <SearchBar params={params} updateParams={(p) => updateParams(p)} />

        <Section title={t`Repositories`}>
          {repositories === loading ? (
            <LoadingSpinner />
          ) : !repositories.length ? (
            <EmptyStateXs
              title={t`No repositories found`}
              description={t`TODO link to repositories`}
            />
          ) : (
            t`Found ${repositories.length} repositories`
          )}
        </Section>

        <ResultsSection
          items={namespaces}
          title={t`Namespaces`}
          showAllLink={
            <Link
              to={formatPath(Paths.ansible.namespace.list)}
            >{t`Show all namespaces`}</Link>
          }
          showMoreLink={
            <Link
              to={formatPath(Paths.ansible.namespace.list, {}, { keywords })}
            >{t`Show more namespaces`}</Link>
          }
        >
          <DataList aria-label={t`Available matching namespaces`}>
            {namespaces.map((ns, i) => (
              <PackageListItem key={i} namespace={ns} />
            ))}
          </DataList>
        </ResultsSection>
      </Main>
    </>
  );
};

export default withRouter(RPMSearch);
