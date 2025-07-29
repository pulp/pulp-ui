import { Trans } from '@lingui/react/macro';
import { Banner, Flex, FlexItem } from '@patternfly/react-core';
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';
import { type ElementType } from 'react';
import { Navigate, redirect, useLocation } from 'react-router';
import { ErrorBoundary, ExternalLink, NotFound } from 'src/components';
import {
  AboutProject,
  AnsibleRemoteDetail,
  AnsibleRemoteEdit,
  AnsibleRemoteList,
  AnsibleRepositoryDetail,
  AnsibleRepositoryEdit,
  AnsibleRepositoryList,
  Approvals,
  CollectionContent,
  CollectionDependencies,
  CollectionDetail,
  CollectionDistributions,
  CollectionDocs,
  CollectionImportLog,
  EditNamespace,
  EditRole,
  EditUser,
  ExecutionEnvironmentDetail,
  ExecutionEnvironmentDetailAccess,
  ExecutionEnvironmentDetailActivities,
  ExecutionEnvironmentDetailImages,
  ExecutionEnvironmentList,
  ExecutionEnvironmentManifest,
  ExecutionEnvironmentRegistryList,
  FileRemoteDetail,
  FileRemoteEdit,
  FileRemoteList,
  FileRepositoryDetail,
  FileRepositoryEdit,
  FileRepositoryList,
  GroupDetail,
  GroupList,
  LoginPage,
  MultiSearch,
  MyImports,
  MyNamespaces,
  NamespaceDetail,
  Partners,
  PulpStatus,
  RPMPackageList,
  RPMRepositoryDetail,
  RPMRepositoryList,
  RpmRepositoryEdit,
  RPMRemoteDetail,
  RPMRemoteEdit,
  RPMRemoteList,
  RoleCreate,
  RoleList,
  Search,
  SignatureKeysList,
  TaskDetail,
  TaskListView,
  UserCreate,
  UserDetail,
  UserList,
  UserProfile,
} from 'src/containers';
import { Paths, formatPath } from 'src/paths';
import { config } from 'src/ui-config';
import { loginURL } from 'src/utilities';
import { useUserContext } from './user-context';

interface IRouteConfig {
  beta?: boolean;
  component: ElementType;
  noAuth?: boolean;
  path: string;
}

const routes: IRouteConfig[] = [
  {
    component: ExecutionEnvironmentDetailActivities,
    path: Paths.container.repository.activities,
    beta: true,
  },
  {
    component: ExecutionEnvironmentDetailAccess,
    path: Paths.container.repository.access,
    beta: true,
  },
  {
    component: ExecutionEnvironmentManifest,
    path: Paths.container.repository.manifest,
    beta: true,
  },
  {
    component: ExecutionEnvironmentDetailImages,
    path: Paths.container.repository.images,
    beta: true,
  },
  {
    component: ExecutionEnvironmentDetail,
    path: Paths.container.repository.detail,
    beta: true,
  },
  {
    component: ExecutionEnvironmentList,
    path: Paths.container.repository.list,
    beta: true,
  },
  {
    component: ExecutionEnvironmentRegistryList,
    path: Paths.container.remote.list,
    beta: true,
  },
  {
    component: TaskListView,
    path: Paths.core.task.list,
  },
  {
    component: GroupList,
    path: Paths.core.group.list,
    beta: true,
  },
  {
    component: GroupDetail,
    path: Paths.core.group.detail,
    beta: true,
  },
  {
    component: TaskDetail,
    path: Paths.core.task.detail,
  },
  {
    component: EditRole,
    path: Paths.core.role.edit,
    beta: true,
  },
  {
    component: RoleCreate,
    path: Paths.core.role.create,
    beta: true,
  },
  {
    component: RoleList,
    path: Paths.core.role.list,
    beta: true,
  },
  {
    component: AnsibleRemoteDetail,
    path: Paths.ansible.remote.detail,
  },
  {
    component: AnsibleRemoteEdit,
    path: Paths.ansible.remote.edit,
  },
  {
    component: AnsibleRemoteList,
    path: Paths.ansible.remote.list,
  },
  {
    component: AnsibleRepositoryDetail,
    path: Paths.ansible.repository.detail,
  },
  {
    component: AnsibleRepositoryEdit,
    path: Paths.ansible.repository.edit,
  },
  {
    component: AnsibleRepositoryList,
    path: Paths.ansible.repository.list,
  },
  {
    component: FileRemoteDetail,
    path: Paths.file.remote.detail,
  },
  {
    component: FileRemoteEdit,
    path: Paths.file.remote.edit,
  },
  {
    component: FileRemoteList,
    path: Paths.file.remote.list,
  },
  {
    component: FileRepositoryDetail,
    path: Paths.file.repository.detail,
  },
  {
    component: FileRepositoryEdit,
    path: Paths.file.repository.edit,
  },
  {
    component: FileRepositoryList,
    path: Paths.file.repository.list,
  },
  {
    component: UserProfile,
    path: Paths.core.user.profile,
    beta: true,
  },
  {
    component: UserCreate,
    path: Paths.core.user.create,
    beta: true,
  },
  {
    component: SignatureKeysList,
    path: Paths.core.signature_keys,
  },
  {
    component: EditUser,
    path: Paths.core.user.edit,
    beta: true,
  },
  {
    component: UserDetail,
    path: Paths.core.user.detail,
    beta: true,
  },
  {
    component: UserList,
    path: Paths.core.user.list,
    beta: true,
  },
  {
    component: Approvals,
    path: Paths.ansible.approvals,
    beta: true,
  },
  {
    component: Partners,
    path: Paths.ansible.namespace.list,
    beta: true,
  },
  {
    component: EditNamespace,
    path: Paths.ansible.namespace.edit,
    beta: true,
  },
  {
    component: MyNamespaces,
    path: Paths.ansible.namespace.mine,
    beta: true,
  },
  {
    component: LoginPage,
    path: Paths.meta.login,
    noAuth: true,
  },
  {
    component: CollectionDocs,
    path: Paths.ansible.collection.docs_page,
    beta: true,
  },
  {
    component: CollectionDocs,
    path: Paths.ansible.collection.docs_index,
    beta: true,
  },
  {
    component: CollectionDocs,
    path: Paths.ansible.collection.content_docs,
    beta: true,
  },
  {
    component: CollectionContent,
    path: Paths.ansible.collection.content_list,
    beta: true,
  },
  {
    component: CollectionImportLog,
    path: Paths.ansible.collection.imports,
    beta: true,
  },
  {
    component: CollectionDistributions,
    path: Paths.ansible.collection.distributions,
    beta: true,
  },
  {
    component: CollectionDependencies,
    path: Paths.ansible.collection.dependencies,
    beta: true,
  },
  {
    component: CollectionDetail,
    path: Paths.ansible.collection.detail,
    beta: true,
  },
  {
    component: Search,
    path: Paths.ansible.collection.list,
    beta: true,
  },
  {
    component: MyImports,
    path: Paths.ansible.imports,
    beta: true,
  },
  {
    component: NamespaceDetail,
    path: Paths.ansible.namespace.detail,
    beta: true,
  },
  {
    component: PulpStatus,
    path: Paths.core.status,
    noAuth: true,
  },
  {
    component: MultiSearch,
    path: Paths.meta.search,
    beta: true,
  },
  {
    component: AboutProject,
    path: Paths.meta.about,
    noAuth: true,
  },
  {
    component: RPMPackageList,
    path: Paths.rpm.package.list,
    beta: true,
  },
  {
    component: RPMRepositoryDetail,
    path: Paths.rpm.repository.detail,
    beta: true,
  },
  {
    component: RPMRepositoryList,
    path: Paths.rpm.repository.list,
    beta: true,
  },
  {
    component: RpmRepositoryEdit,
    path: Paths.rpm.repository.edit,
  },
  {
    component: RPMRemoteDetail,
    path: Paths.rpm.remote.detail,
    beta: true,
  },
  {
    component: RPMRemoteEdit,
    path: Paths.rpm.remote.edit,
    beta: true,
  },
  {
    component: RPMRemoteList,
    path: Paths.rpm.remote.list,
    beta: true,
  },
];

const AuthHandler = ({
  beta,
  component: Component,
  noAuth,
  path,
}: IRouteConfig) => {
  const { credentials } = useUserContext();
  const { pathname } = useLocation();

  if (!credentials && !noAuth) {
    // NOTE: also update LoginLink when changing this
    if (config.UI_EXTERNAL_LOGIN_URI) {
      window.location.replace(loginURL(pathname));
      return null;
    }

    return (
      <Navigate to={formatPath(Paths.meta.login, {}, { next: pathname })} />
    );
  }

  const banner = beta ? (
    <Banner variant='blue'>
      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
        <FlexItem>
          <WrenchIcon />
        </FlexItem>
        <FlexItem>
          <Trans>
            This page is under construction and some features may be broken. You
            can contribute at{' '}
            <ExternalLink href='https://github.com/pulp/pulp-ui'>
              Pulp UI
            </ExternalLink>
            .
          </Trans>
        </FlexItem>
      </Flex>
    </Banner>
  ) : null;

  return (
    <>
      {banner}
      <Component path={path} />
    </>
  );
};

const appRoutes = () =>
  routes.map(({ beta, component, noAuth, path, ...rest }) => ({
    element: (
      <AuthHandler
        beta={beta}
        component={component}
        noAuth={noAuth}
        path={path}
      />
    ),
    path: path,
    ...rest,
  }));

const convert = (m) => {
  const {
    default: Component,
    clientLoader: loader,
    clientAction: action,
    ...rest
  } = m;
  return { ...rest, loader, action, Component };
};

export const dataRoutes = [
  {
    id: 'root',
    lazy: () => import('src/routes/root').then((m) => convert(m)),
    children: [
      {
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            loader: () => redirect(formatPath(Paths.core.status)),
          },
          ...appRoutes(),
          // "No matching route" is not handled by the error boundary.
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
];
