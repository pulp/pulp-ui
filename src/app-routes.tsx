import { t } from '@lingui/macro';
import { Banner, Flex, FlexItem } from '@patternfly/react-core';
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';
import React, { Component, type ElementType } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ExternalLink, NotFound } from 'src/components';
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

interface IAuthHandlerProps {
  component: ElementType;
  noAuth: boolean;
  path: string;
}

interface IRouteConfig {
  component: ElementType;
  path: string;
  noAuth?: boolean;
}

const AuthHandler = ({
  component: Component,
  noAuth,
  path,
}: IAuthHandlerProps) => {
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

  return (
    <>
      {![
        Paths.core.task.list,
        Paths.core.task.detail,
        Paths.meta.about,
        Paths.core.signature_keys,
      ].includes(path) && (
        <Banner variant='blue'>
          <Flex spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <WrenchIcon />
            </FlexItem>
            <FlexItem>
              {t`This page is under construction and some features may be broken. You can contribute at `}{' '}
              <ExternalLink href={'https://github.com/pulp/pulp-ui'}>
                Pulp UI{' '}
              </ExternalLink>{' '}
            </FlexItem>
          </Flex>
        </Banner>
      )}
      <Component path={path} />
    </>
  );
};

export class AppRoutes extends Component {
  // Note: must be ordered from most specific to least specific
  getRoutes(): IRouteConfig[] {
    return [
      {
        component: ExecutionEnvironmentDetailActivities,
        path: Paths.container.repository.activities,
      },
      {
        component: ExecutionEnvironmentDetailAccess,
        path: Paths.container.repository.access,
      },
      {
        component: ExecutionEnvironmentManifest,
        path: Paths.container.repository.manifest,
      },
      {
        component: ExecutionEnvironmentDetailImages,
        path: Paths.container.repository.images,
      },
      {
        component: ExecutionEnvironmentDetail,
        path: Paths.container.repository.detail,
      },
      {
        component: ExecutionEnvironmentList,
        path: Paths.container.repository.list,
      },
      {
        component: ExecutionEnvironmentRegistryList,
        path: Paths.container.remote.list,
      },
      {
        component: TaskListView,
        path: Paths.core.task.list,
      },
      { component: GroupList, path: Paths.core.group.list },
      { component: GroupDetail, path: Paths.core.group.detail },
      { component: TaskDetail, path: Paths.core.task.detail },
      { component: EditRole, path: Paths.core.role.edit },
      {
        component: RoleCreate,
        path: Paths.core.role.create,
      },
      { component: RoleList, path: Paths.core.role.list },
      { component: AnsibleRemoteDetail, path: Paths.ansible.remote.detail },
      { component: AnsibleRemoteEdit, path: Paths.ansible.remote.edit },
      { component: AnsibleRemoteList, path: Paths.ansible.remote.list },
      {
        component: AnsibleRepositoryDetail,
        path: Paths.ansible.repository.detail,
      },
      {
        component: AnsibleRepositoryEdit,
        path: Paths.ansible.repository.edit,
      },
      { component: AnsibleRepositoryList, path: Paths.ansible.repository.list },
      { component: UserProfile, path: Paths.core.user.profile },
      {
        component: UserCreate,
        path: Paths.core.user.create,
      },
      { component: SignatureKeysList, path: Paths.core.signature_keys },
      {
        component: EditUser,
        path: Paths.core.user.edit,
      },
      { component: UserDetail, path: Paths.core.user.detail },
      { component: UserList, path: Paths.core.user.list },
      { component: Approvals, path: Paths.ansible.approvals },
      { component: Partners, path: Paths.ansible.namespace.list },
      { component: EditNamespace, path: Paths.ansible.namespace.edit },
      { component: MyNamespaces, path: Paths.ansible.namespace.mine },
      { component: LoginPage, path: Paths.meta.login, noAuth: true },
      {
        component: CollectionDocs,
        path: Paths.ansible.collection.docs_page,
      },
      {
        component: CollectionDocs,
        path: Paths.ansible.collection.docs_index,
      },
      {
        component: CollectionDocs,
        path: Paths.ansible.collection.content_docs,
      },
      {
        component: CollectionContent,
        path: Paths.ansible.collection.content_list,
      },
      {
        component: CollectionImportLog,
        path: Paths.ansible.collection.imports,
      },
      {
        component: CollectionDistributions,
        path: Paths.ansible.collection.distributions,
      },
      {
        component: CollectionDependencies,
        path: Paths.ansible.collection.dependencies,
      },
      { component: CollectionDetail, path: Paths.ansible.collection.detail },
      { component: Search, path: Paths.ansible.collection.list },
      { component: MyImports, path: Paths.ansible.imports },
      { component: NamespaceDetail, path: Paths.ansible.namespace.detail },
      { component: PulpStatus, path: Paths.core.status, noAuth: true },
      { component: MultiSearch, path: Paths.meta.search },
      { component: AboutProject, path: Paths.meta.about, noAuth: true },
      { component: RPMPackageList, path: Paths.rpm.package.list },
    ];
  }

  render() {
    return (
      <Routes>
        {this.getRoutes().map(({ component, noAuth, path }, index) => (
          <Route
            element={
              <AuthHandler component={component} noAuth={noAuth} path={path} />
            }
            key={index}
            path={path}
          />
        ))}
        <Route
          path={'/'}
          element={<Navigate to={formatPath(Paths.core.status)} />}
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    );
  }
}
