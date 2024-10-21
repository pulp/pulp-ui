import { t } from '@lingui/macro';
import React, { Component } from 'react';
import { AppContext } from 'src/app-context';
import {
  CollectionContentList,
  CollectionHeader,
  LoadingPage,
  Main,
  NotFound,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { ParamHelper, type RouteProps, withRouter } from 'src/utilities';
import { type IBaseCollectionState, loadCollection } from './base';

// renders list of contents in a collection
class CollectionContent extends Component<RouteProps, IBaseCollectionState> {
  static contextType = AppContext;

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
  }

  componentDidMount() {
    this.loadCollections(false);
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

    if (notFound) {
      return <NotFound />;
    }

    if (collections.length <= 0) {
      return <LoadingPage />;
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
      { name: t`Content` },
    ];

    return (
      <>
        <CollectionHeader
          activeTab='contents'
          actuallyCollection={actuallyCollection}
          breadcrumbs={breadcrumbs}
          collection={collection}
          collections={collections}
          collectionsCount={collectionsCount}
          content={content}
          params={params}
          reload={() => this.loadCollections(true)}
          updateParams={(params) =>
            this.updateParams(params, () => this.loadCollections(true))
          }
        />
        <Main>
          <section className='pulp-section'>
            <CollectionContentList
              contents={content.contents}
              collection={collection}
              params={params}
              updateParams={(p) => this.updateParams(p)}
            />
          </section>
        </Main>
      </>
    );
  }

  private loadCollections(forceReload) {
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

export default withRouter(CollectionContent);
