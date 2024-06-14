import { Trans, t } from '@lingui/macro';
import { Bullseye, DataList } from '@patternfly/react-core';
import React, { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectionVersionAPI } from 'src/api';
import {
  BaseHeader,
  CollectionListItem,
  EmptyStateNoData,
  LoadingSpinner,
  Main,
} from 'src/components';
import { useHubContext } from 'src/loaders/app-context';
import { Paths, formatPath } from 'src/paths';
import { ParamHelper, type RouteProps, withRouter } from 'src/utilities';
import NotFoundImage from 'static/images/not_found.svg';

const PageSection = ({ children, ...rest }: { children: ReactNode }) => (
  <section className='body' {...rest}>
    {children}
  </section>
);

const SectionSeparator = () => <section>&nbsp;</section>;

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className='pf-v5-c-title'>{children}</h2>
);

const Dispatch = ({ location, navigate }: RouteProps) => {
  const { featureFlags } = useHubContext();

  const { pathname } = ParamHelper.parseParamString(location.search) as {
    pathname: string;
  };

  const [namespace, name] = pathname.split('/').filter(Boolean);

  const [collections, setCollections] = useState(null);

  useEffect(() => {
    CollectionVersionAPI.list({ namespace, name, is_highest: true })
      .then(({ data: { data } }) => data || [])
      .catch(() => [])
      .then((c) => (setCollections(c), c))
      .then((collections) => {
        if (collections.length === 1) {
          const {
            collection_version: { name: collection, namespace },
            repository: { name: repo },
          } = collections[0];

          navigate(
            formatPath(Paths.collectionByRepo, {
              collection,
              namespace,
              repo,
            }),
          );
        }
      });
  }, [pathname]);

  return (
    <>
      <BaseHeader title={t`404 - Page not found`} />
      <Main>
        <PageSection>
          <Bullseye>
            <div className='hub-c-bullseye__center'>
              <img src={NotFoundImage} alt={t`Not found`} width='128px' />
              <div>{t`We couldn't find the page you're looking for!`}</div>
              <div className='pf-v5-c-content'>
                <Trans>
                  Pathname{' '}
                  <pre style={{ display: 'inline-block' }}>{pathname}</pre>{' '}
                  could refer to a collection.
                </Trans>{' '}
              </div>
            </div>
          </Bullseye>
        </PageSection>
        <SectionSeparator />
        <PageSection>
          <SectionTitle>{t`Collections`}</SectionTitle>

          {collections === null ? (
            <LoadingSpinner />
          ) : collections.length === 0 ? (
            <EmptyStateNoData
              title={t`No matching collections found.`}
              description={
                <Link
                  to={formatPath(Paths.collections)}
                >{t`Show all collections`}</Link>
              }
            />
          ) : (
            <>
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
              <Link
                to={formatPath(Paths.collections)}
              >{t`Show all collections`}</Link>
            </>
          )}
        </PageSection>
      </Main>
    </>
  );
};

export default withRouter(Dispatch);
