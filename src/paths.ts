import { ParamHelper, type ParamType } from './utilities';

export function formatPath(
  path: string,
  data = {},
  params?: ParamType,
  options?,
) {
  const url = ((path as string) + '/')
    .replaceAll('//', '/')
    .split('/')
    .map((fragment) => {
      const match = fragment.match(/^:(\w+)\??$/);
      if (!match) {
        return fragment;
      }

      const key = match[1];
      if (!data[key]) {
        if (options?.ignoreMissing) {
          // preserve for activateMenu
          return fragment;
        }

        if (!fragment.endsWith('?')) {
          throw new Error(`missing url param ${key}`);
        }

        return '';
      }

      return encodeURIComponent(data[key]);
    })
    .join('/')
    .replaceAll('//', '/');

  return params ? `${url}?${ParamHelper.getQueryString(params)}` : url;
}

// handle long/short EE routes:
// (path, container: 'namespaced/name') -> (path, { namespace: 'namespaced', container: 'name' })
// (path, container: 'simple') -> (path, { container: 'simple' })
// see also containerName
export function formatEEPath(path, data, params?) {
  if (data.container?.includes('/')) {
    const [namespace, container] = data.container.split('/');
    return formatPath(path, { ...data, namespace, container }, params);
  }

  return formatPath(path, data, params);
}

export const Paths = {
  ansible: {
    approvals: '/ansible/approvals',
    collection: {
      content_docs:
        '/ansible/collections/content_docs/:repo/:namespace/:collection/:type/:name',
      content_list: '/ansible/collections/content/:repo/:namespace/:collection',
      dependencies:
        '/ansible/collections/dependencies/:repo/:namespace/:collection',
      detail: '/ansible/collections/detail/:repo/:namespace/:collection',
      distributions:
        '/ansible/collections/distributions/:repo/:namespace/:collection',
      docs_index:
        '/ansible/collections/docs_index/:repo/:namespace/:collection',
      docs_page:
        '/ansible/collections/docs_page/:repo/:namespace/:collection/:page',
      imports: '/ansible/collections/imports/:repo/:namespace/:collection',
      list: '/ansible/collections',
    },
    imports: '/ansible/my-imports',
    namespace: {
      detail: '/ansible/namespaces/detail/:namespace',
      edit: '/ansible/namespaces/edit/:namespace',
      list: '/ansible/namespaces',
      mine: '/ansible/my-namespaces',
    },
    remote: {
      detail: '/ansible/remotes/detail/:name',
      edit: '/ansible/remotes/edit/:name',
      list: '/ansible/remotes',
    },
    repository: {
      detail: '/ansible/repositories/detail/:name',
      edit: '/ansible/repositories/edit/:name',
      list: '/ansible/repositories',
    },
  },
  container: {
    remote: { list: '/container/remotes' },
    repository: {
      access: '/container/containers/access/:namespace?/:container',
      activities: '/container/containers/activity/:namespace?/:container',
      detail: '/container/containers/detail/:namespace?/:container',
      images: '/container/containers/images/:namespace?/:container',
      list: '/container/containers',
      manifest: '/container/containers/manifest/:namespace?/:container/:digest',
    },
  },
  core: {
    group: {
      detail: '/groups/detail/:group',
      list: '/groups',
    },
    role: {
      create: '/roles/create',
      edit: '/roles/edit/:role',
      list: '/roles',
    },
    signature_keys: '/signature-keys',
    status: '/status',
    task: {
      detail: '/tasks/detail/:task',
      list: '/tasks',
    },
    user: {
      create: '/users/create',
      detail: '/users/detail/:user_id',
      edit: '/users/edit/:user_id',
      list: '/users',
      profile: '/users/profile',
    },
  },
  file: {
    remote: {
      detail: '/file/remotes/detail/:name',
      edit: '/file/remotes/edit/:name',
      list: '/file/remotes',
    },
    repository: {
      detail: '/file/repositories/detail/:name',
      edit: '/file/repositories/edit/:name',
      list: '/file/repositories',
    },
  },
  meta: {
    about: '/about',
    login: '/login',
    search: '/search',
  },
  rpm: {
    package: { list: '/rpm/rpms' },
  },
  debian: {
    remote: {
      detail: '/debian/remotes/detail/:name',
      edit: '/debian/remotes/edit/:name',
      list: '/debian/remotes',
    },
    repository: {
      detail: '/debian/repositories/detail/:name',
      edit: '/debian/repositories/edit/:name',
      list: '/debian/repositories',
    },
  },
};
