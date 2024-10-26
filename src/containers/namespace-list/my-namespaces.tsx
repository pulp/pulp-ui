import React from 'react';
import { type RouteProps, withRouter } from 'src/utilities';
import { NamespaceList } from './namespace-list';

const MyNamespaces = (props: RouteProps) => (
  <NamespaceList {...props} filterOwner />
);

export default withRouter(MyNamespaces);
