import React, { Component } from 'react';
import { AppContext, type IAppContextType } from 'src/app-context';
import { EmptyStateUnauthorized } from 'src/components';
import { type RouteProps, withRouter } from 'src/utilities';
import { NamespaceList } from './namespace-list';

class MyNamespaces extends Component<RouteProps> {
  static contextType = AppContext;

  render() {
    if (!(this.context as IAppContextType).user) {
      return <EmptyStateUnauthorized />;
    }

    return <NamespaceList {...this.props} filterOwner />;
  }
}

export default withRouter(MyNamespaces);
