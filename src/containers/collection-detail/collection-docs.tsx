import { t } from '@lingui/macro';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import React, { Component, type RefObject, createRef } from 'react';
import { Link } from 'react-router-dom';
import { type CollectionVersionSearch } from 'src/api';
import { AppContext } from 'src/app-context';
import {
  CollectionHeader,
  EmptyStateCustom,
  ExternalLink,
  LoadingPage,
  Main,
  NotFound,
  TableOfContents,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { ParamHelper, type RouteProps, withRouter } from 'src/utilities';
import { type IBaseCollectionState, loadCollection } from './base';
import './collection-detail.scss';

// renders markdown files in collection docs/ directory
class CollectionDocs extends Component<RouteProps, IBaseCollectionState> {
  static contextType = AppContext;

  docsRef: RefObject<HTMLDivElement>;
  searchBarRef: RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    const params = ParamHelper.parseParamString(props.location.search);

    this.state = {
      actuallyCollection: null,
      collection: null,
      collections: [],
      collectionsCount: 0,
      content: null,
      notFound: false,
      params,
    };
    this.docsRef = createRef();
    this.searchBarRef = createRef();
  }

  componentDidMount() {
    this.loadCollection(false);
  }

  render() {
    const {
      actuallyCollection,
      collection,
      collections,
      collectionsCount,
      content,
      notFound,
      params,
    } = this.state;
    const urlFields = this.props.routeParams;

    if (notFound) {
      return <NotFound />;
    }

    if (!collection || !content) {
      return <LoadingPage />;
    }

    // If the parser can't find anything that matches the URL, neither of
    // these variables should be set
    let displayHTML: string;
    let pluginData;

    const contentType = urlFields['type'] || 'docs';
    const contentName = urlFields['name'] || urlFields['page'] || null;

    if (contentType === 'docs' && contentName) {
      if (content.docs_blob.documentation_files) {
        const file = content.docs_blob.documentation_files.find(
          ({ name }) => name === urlFields['page'],
        );

        if (file) {
          displayHTML = file.html;
        }
      }
    } else if (contentName) {
      // check if contents exists
      if (content.docs_blob.contents) {
        const selectedContent = content.docs_blob.contents.find(
          (x) =>
            x.content_type === contentType && x.content_name === contentName,
        );

        if (selectedContent) {
          if (contentType === 'role') {
            displayHTML = selectedContent['readme_html'];
          } else {
            pluginData = selectedContent;
          }
        }
      }
    } else {
      if (content.docs_blob.collection_readme) {
        displayHTML = content.docs_blob.collection_readme.html;
      }
    }

    const { collection_version, repository } = collection;

    const breadcrumbs = [
      { name: t`Namespaces`, url: formatPath(Paths.ansible.namespace.list) },
      {
        url: formatPath(Paths.ansible.namespace.detail, {
          namespace: collection_version.namespace,
        }),
        name: collection_version.namespace,
      },
      {
        url: formatPath(Paths.ansible.collection.detail, {
          namespace: collection_version.namespace,
          collection: collection_version.name,
          repo: repository.name,
        }),
        name: collection_version.name,
      },
      { name: t`Documentation` },
    ];

    return (
      <>
        <CollectionHeader
          activeTab='documentation'
          actuallyCollection={actuallyCollection}
          breadcrumbs={breadcrumbs}
          collection={collection}
          collections={collections}
          collectionsCount={collectionsCount}
          content={content}
          params={params}
          reload={() => this.loadCollection(true)}
          updateParams={(p) =>
            this.updateParams(p, () => this.loadCollection(true))
          }
        />
        <Main className='pulp-docs-main'>
          <section className='pulp-docs-container'>
            <TableOfContents
              className='pulp-docs-sidebar'
              namespace={collection.collection_version.namespace}
              collection={collection.collection_version.name}
              repository={collection.repository.name}
              docs_blob={content.docs_blob}
              selectedName={contentName}
              selectedType={contentType}
              params={params}
              updateParams={(p) => this.updateParams(p)}
              searchBarRef={this.searchBarRef}
            />

            <div
              className='pulp-section pulp-docs-content pf-v5-c-content pulp-content-alert-fix'
              ref={this.docsRef}
            >
              {displayHTML || pluginData ? (
                // if neither variable is set, render not found
                displayHTML ? (
                  // if displayHTML is set, render it
                  <div
                    dangerouslySetInnerHTML={{
                      __html: displayHTML,
                    }}
                  />
                ) : (
                  // if plugin data is set render it
                  'FIXME'
                )
              ) : collection.repository.name === 'community' &&
                !content.docs_blob.contents ? (
                this.renderCommunityWarningMessage()
              ) : (
                this.renderNotFound(collection.collection_version.name)
              )}
            </div>
          </section>
        </Main>
      </>
    );
  }

  private renderDocLink(
    name,
    href,
    collection: CollectionVersionSearch,
    params,
  ) {
    if (!!href && href.startsWith('http')) {
      return <ExternalLink href={href}>{name}</ExternalLink>;
    } else if (href) {
      // TODO: right now this will break if people put
      // ../ at the front of their urls. Need to find a
      // way to document this

      const { collection_version, repository } = collection;

      return (
        <Link
          to={formatPath(
            Paths.ansible.collection.docs_page,
            {
              namespace: collection_version.namespace,
              collection: collection_version.name,
              page: href,
              repo: repository.name,
            },
            params,
          )}
        >
          {name}
        </Link>
      );
    } else {
      return null;
    }
  }

  private renderNotFound(collectionName) {
    return (
      <EmptyStateCustom
        title={t`Not found`}
        description={t`The file is not available for this version of ${collectionName}`}
        icon={ExclamationCircleIcon}
      />
    );
  }

  private renderCommunityWarningMessage() {
    return (
      <EmptyStateCustom
        title={t`Warning`}
        description={t`Community collections do not have docs nor content counts, but all content gets synchronized`}
        icon={ExclamationTriangleIcon}
      />
    );
  }

  private loadCollection(forceReload) {
    loadCollection({
      forceReload,
      matchParams: this.props.routeParams,
      setCollection: (
        collections,
        collection,
        content,
        collectionsCount,
        actuallyCollection,
      ) =>
        this.setState({
          collections,
          collection,
          content,
          collectionsCount,
          actuallyCollection,
        }),
      setNotFound: (notFound) => this.setState({ notFound }),
      stateParams: this.state.params,
    });
  }

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
    });
  }
}

export default withRouter(CollectionDocs);
