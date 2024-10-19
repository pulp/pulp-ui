import { t } from '@lingui/macro';
import React, { Component } from 'react';
import { ImportAPI, type ImportDetailType, type ImportListType } from 'src/api';
import { AppContext } from 'src/app-context';
import {
  CollectionHeader,
  ImportConsole,
  LoadingPage,
  Main,
  NotFound,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { ParamHelper, type RouteProps, withRouter } from 'src/utilities';
import { type IBaseCollectionState, loadCollection } from './base';

interface IState extends IBaseCollectionState {
  loadingImports: boolean;
  selectedImportDetail: ImportDetailType;
  selectedImport: ImportListType;
  apiError: string;
}

class CollectionImportLog extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const params = ParamHelper.parseParamString(props.location.search);

    this.state = {
      actuallyCollection: null,
      apiError: undefined,
      collection: null,
      collections: [],
      collectionsCount: 0,
      content: null,
      loadingImports: true,
      notFound: false,
      params,
      selectedImport: undefined,
      selectedImportDetail: undefined,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const {
      actuallyCollection,
      apiError,
      collection,
      collections,
      collectionsCount,
      content,
      loadingImports,
      notFound,
      params,
      selectedImport,
      selectedImportDetail,
    } = this.state;

    if (notFound) {
      return <NotFound />;
    }

    if (!collection) {
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
      { name: t`Import log` },
    ];

    return (
      <>
        <CollectionHeader
          activeTab='import-log'
          actuallyCollection={actuallyCollection}
          breadcrumbs={breadcrumbs}
          collection={collection}
          collections={collections}
          collectionsCount={collectionsCount}
          content={content}
          params={params}
          reload={() => this.loadData(true)}
          updateParams={(params) =>
            this.updateParams(params, () => this.loadData(true))
          }
        />
        <Main>
          <section className='pulp-section'>
            <ImportConsole
              apiError={apiError}
              loading={loadingImports}
              selectedImport={selectedImport}
              task={selectedImportDetail}
            />
          </section>
        </Main>
      </>
    );
  }

  private loadData(forceReload = false) {
    const failMsg = t`Could not load import log`;
    this.setState({ loadingImports: true }, () => {
      this.loadCollection(forceReload, () => {
        ImportAPI.list({
          namespace: this.state.collection.collection_version.namespace,
          name: this.state.collection.collection_version.name,
          version: this.state.collection.collection_version.version,
          sort: '-created',
        })
          .then((importListResult) => {
            const importObj = importListResult.data.data[0];
            ImportAPI.get(importObj.id)
              .then((importDetailResult) => {
                this.setState({
                  apiError: undefined,
                  loadingImports: false,
                  selectedImport: importObj,
                  selectedImportDetail: importDetailResult.data,
                });
              })
              .catch(() => {
                this.setState({
                  apiError: failMsg,
                  loadingImports: false,
                });
              });
          })
          .catch(() => {
            this.setState({
              apiError: failMsg,
              loadingImports: false,
            });
          });
      });
    });
  }

  private loadCollection(forceReload, callback) {
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
        this.setState(
          {
            collections,
            collection,
            content,
            collectionsCount,
            actuallyCollection,
          },
          callback,
        ),
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

export default withRouter(CollectionImportLog);
