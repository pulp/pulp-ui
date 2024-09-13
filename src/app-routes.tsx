import React, { Component, type ElementType } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
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
  NotFound,
  Partners,
  PulpStatus,
  RoleCreate,
  RoleList,
  Search,
  SignatureKeysList,
  TaskDetail,
  TaskListView,
  Token,
  UserCreate,
  UserDetail,
  UserList,
  UserProfile,
} from 'src/containers';
import { Paths, formatPath } from 'src/paths';
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
    //const isExternalAuth = featureFlags.external_authentication;
    // NOTE: also update LoginLink when changing this
    //if (isExternalAuth && UI_EXTERNAL_LOGIN_URI) {
    //  window.location.replace(loginURL(pathname));
    //  return null;
    //}

    return <Navigate to={formatPath(Paths.login, {}, { next: pathname })} />;
  }

  return <Component path={path} />;
};

export class AppRoutes extends Component {
  // Note: must be ordered from most specific to least specific
  getRoutes(): IRouteConfig[] {
    return [
      {
        component: ExecutionEnvironmentDetailActivities,
        path: Paths.executionEnvironmentDetailActivities,
      },
      {
        component: ExecutionEnvironmentDetailAccess,
        path: Paths.executionEnvironmentDetailAccess,
      },
      {
        component: ExecutionEnvironmentManifest,
        path: Paths.executionEnvironmentManifest,
      },
      {
        component: ExecutionEnvironmentDetailImages,
        path: Paths.executionEnvironmentDetailImages,
      },
      {
        component: ExecutionEnvironmentDetail,
        path: Paths.executionEnvironmentDetail,
      },
      {
        component: ExecutionEnvironmentList,
        path: Paths.executionEnvironments,
      },
      {
        component: ExecutionEnvironmentRegistryList,
        path: Paths.executionEnvironmentsRegistries,
      },
      {
        component: TaskListView,
        path: Paths.taskList,
      },
      { component: GroupList, path: Paths.groupList },
      { component: GroupDetail, path: Paths.groupDetail },
      { component: TaskDetail, path: Paths.taskDetail },
      { component: EditRole, path: Paths.roleEdit },
      {
        component: RoleCreate,
        path: Paths.createRole,
      },
      { component: RoleList, path: Paths.roleList },
      { component: AnsibleRemoteDetail, path: Paths.ansibleRemoteDetail },
      { component: AnsibleRemoteEdit, path: Paths.ansibleRemoteEdit },
      { component: AnsibleRemoteList, path: Paths.ansibleRemotes },
      {
        component: AnsibleRepositoryDetail,
        path: Paths.ansibleRepositoryDetail,
      },
      {
        component: AnsibleRepositoryEdit,
        path: Paths.ansibleRepositoryEdit,
      },
      { component: AnsibleRepositoryList, path: Paths.ansibleRepositories },
      { component: UserProfile, path: Paths.userProfileSettings },
      {
        component: UserCreate,
        path: Paths.createUser,
      },
      { component: SignatureKeysList, path: Paths.signatureKeys },
      {
        component: EditUser,
        path: Paths.editUser,
      },
      { component: UserDetail, path: Paths.userDetail },
      { component: UserList, path: Paths.userList },
      { component: Approvals, path: Paths.approvals },
      { component: NotFound, path: Paths.notFound },
      { component: Token, path: Paths.token },
      { component: Partners, path: Paths.namespaces },
      { component: EditNamespace, path: Paths.editNamespace },
      { component: MyNamespaces, path: Paths.myNamespaces },
      { component: LoginPage, path: Paths.login, noAuth: true },
      { component: CollectionDocs, path: Paths.collectionDocsPage },
      { component: CollectionDocs, path: Paths.collectionDocsIndex },
      { component: CollectionDocs, path: Paths.collectionContentDocs },
      { component: CollectionContent, path: Paths.collectionContentList },
      { component: CollectionImportLog, path: Paths.collectionImportLog },
      {
        component: CollectionDistributions,
        path: Paths.collectionDistributions,
      },
      {
        component: CollectionDependencies,
        path: Paths.collectionDependencies,
      },
      { component: CollectionDetail, path: Paths.collection },
      { component: Search, path: Paths.collections },
      { component: MyImports, path: Paths.myImports },
      { component: NamespaceDetail, path: Paths.namespaceDetail },
      { component: Search, path: Paths.collections },
      { component: PulpStatus, path: Paths.status, noAuth: true },
      { component: MultiSearch, path: Paths.search },
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
          element={<Navigate to={formatPath(Paths.status)} />}
        />
        <Route
          path='*'
          element={<AuthHandler component={NotFound} noAuth path={null} />}
        />
      </Routes>
    );
  }
}
