import { t } from '@lingui/macro';
import { DataList, Label } from '@patternfly/react-core';
import React, { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CollectionVersionAPI,
  ExecutionEnvironmentAPI,
  NamespaceAPI,
} from 'src/api';
import { useAppContext } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  BaseHeader,
  CollectionListItem,
  EmptyStateXs,
  LoadingSpinner,
  Main,
  MultiSearchSearch,
  NamespaceListItem,
  Tooltip,
  closeAlert,
} from 'src/components';
import { Paths, formatEEPath, formatPath } from 'src/paths';
import {
  ParamHelper,
  type RouteProps,
  handleHttpError,
  withRouter,
} from 'src/utilities';

const PageSection = ({ children, ...rest }: { children: ReactNode }) => (
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

const loading = [];

const MultiSearch = (props: RouteProps) => {
  const { featureFlags } = useAppContext();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [params, setParams] = useState({});

  const [collections, setCollections] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [containers, setContainers] = useState([]);

  const keywords = (params as { keywords: string })?.keywords || '';

  function addAlert(alert: AlertType) {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  }

  function query() {
    if (!keywords) {
      setCollections([]);
      setNamespaces([]);
      setContainers([]);
      return;
    }

    const shared = { page_size: 10 };

    setCollections(loading);
    CollectionVersionAPI.list({ ...shared, keywords /* is_highest: true */ })
      .then(({ data: { results } }) => setCollections(results || []))
      .catch(
        handleHttpError(
          t`Failed to search collections (${keywords})`,
          () => setCollections([]),
          addAlert,
        ),
      );

    setNamespaces(loading);
    NamespaceAPI.list({ ...shared, keywords })
      .then(({ data: { data } }) => setNamespaces(data || []))
      .catch(
        handleHttpError(
          t`Failed to search namespaces (${keywords})`,
          () => setNamespaces([]),
          addAlert,
        ),
      );

    if (featureFlags.execution_environments) {
      setContainers(loading);
      ExecutionEnvironmentAPI.list({ ...shared, name__icontains: keywords })
        .then(({ data: { data } }) => setContainers(data || []))
        .catch(
          handleHttpError(
            t`Failed to search containers (${keywords})`,
            () => setContainers([]),
            addAlert,
          ),
        );
    }
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

  const NotFoundSection = ({
    emptyStateTitle,
    items,
    showAllLink,
    title,
  }: {
    emptyStateTitle: string;
    items;
    showAllLink: ReactNode;
    title: string;
  }) =>
    keywords && items !== loading && !items.length ? (
      <Section title={title}>
        <EmptyStateXs title={emptyStateTitle} description={showAllLink} />
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
        <MultiSearchSearch
          params={params}
          updateParams={(p) => updateParams(p)}
        />

        {/* loading and non-empty lists go before not found */}
        <ResultsSection
          items={collections}
          title={t`Collections`}
          showAllLink={
            <Link
              to={formatPath(Paths.ansible.collection.list)}
            >{t`Show all collections`}</Link>
          }
          showMoreLink={
            <Link
              to={formatPath(Paths.ansible.collection.list, {}, { keywords })}
            >{t`Show more collections`}</Link>
          }
        >
          <DataList aria-label={t`Available matching collections`}>
            {collections.map((c, i) => (
              <CollectionListItem
                key={i}
                collection={c}
                displaySignatures={featureFlags.display_signatures}
                showNamespace
              />
            ))}
          </DataList>
        </ResultsSection>

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
              <NamespaceListItem key={i} namespace={ns} />
            ))}
          </DataList>
        </ResultsSection>

        {featureFlags.execution_environments ? (
          <ResultsSection
            items={containers}
            title={t`Containers`}
            showAllLink={
              <Link
                to={formatPath(Paths.container.repository.list)}
              >{t`Show all containers`}</Link>
            }
            showMoreLink={
              <Link
                to={formatPath(
                  Paths.container.repository.list,
                  {},
                  { name__icontains: keywords },
                )}
              >{t`Show more containers`}</Link>
            }
          >
            <DataList
              aria-label={t`Available matching containers`}
              className='pulp-card-layout'
              style={{ paddingTop: '8px' }}
            >
              {containers.map((item, index) => (
                <section
                  key={index}
                  className='card-wrapper'
                  style={{ width: '300px' }}
                >
                  <article className='pf-v5-c-card'>
                    <div className='pf-v5-c-card__title'>
                      <Link
                        to={formatEEPath(Paths.container.repository.detail, {
                          container: item.pulp.distribution.base_path,
                        })}
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className='pf-v5-c-card__body pf-m-truncate'>
                      {item.description ? (
                        <Tooltip content={item.description}>
                          {item.description}
                        </Tooltip>
                      ) : null}
                    </div>
                    <div className='pf-v5-c-card__footer'>
                      <Label>
                        {item.pulp.repository.remote ? t`Remote` : t`Local`}
                      </Label>
                    </div>
                  </article>
                </section>
              ))}
            </DataList>
          </ResultsSection>
        ) : null}

        <SectionSeparator />
        <hr />

        <NotFoundSection
          items={collections}
          title={t`Collections`}
          emptyStateTitle={t`No matching collections found.`}
          showAllLink={
            <Link
              to={formatPath(Paths.ansible.collection.detail)}
            >{t`Show all collections`}</Link>
          }
        />

        <NotFoundSection
          items={namespaces}
          title={t`Namespaces`}
          emptyStateTitle={t`No matching namespaces found.`}
          showAllLink={
            <Link
              to={formatPath(Paths.ansible.namespace.list)}
            >{t`Show all namespaces`}</Link>
          }
        />

        {featureFlags.execution_environments ? (
          <NotFoundSection
            items={containers}
            title={t`Containers`}
            emptyStateTitle={t`No matching containers found.`}
            showAllLink={
              <Link
                to={formatPath(Paths.container.repository.list)}
              >{t`Show all containers`}</Link>
            }
          />
        ) : null}
      </Main>
    </>
  );
};

export default withRouter(MultiSearch);
