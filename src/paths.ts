import { ParamHelper, type ParamType } from 'src/utilities';

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
    approvals: '/approvals',
    collection: {
      content_docs:
        '/ansible/collections/:repo/:namespace/:collection/content/:type/:name',
      content_list: '/ansible/collections/:repo/:namespace/:collection/content',
      dependencies:
        '/ansible/collections/:repo/:namespace/:collection/dependencies',
      detail: '/ansible/collections/:repo/:namespace/:collection',
      distributions:
        '/ansible/collections/:repo/:namespace/:collection/distributions',
      docs_index: '/ansible/collections/:repo/:namespace/:collection/docs',
      docs_page: '/ansible/collections/:repo/:namespace/:collection/docs/:page',
      imports: '/ansible/collections/:repo/:namespace/:collection/import-log',
      list: '/ansible/collections',
    },
    imports: '/my-imports',
    namespace: {
      detail: '/ansible/namespaces/:namespace',
      edit: '/my-namespaces/edit/:namespace',
      list: '/ansible/namespaces',
      mine: '/ansible/my-namespaces',
    },
    remote: {
      detail: '/ansible/remotes/:name',
      edit: '/ansible/remotes/:name/edit',
      list: '/ansible/remotes',
    },
    repository: {
      detail: '/ansible/repositories/:name',
      edit: '/ansible/repositories/:name/edit',
      list: '/ansible/repositories',
    },
  },
  container: {
    remote: { list: '/registries' },
    repository: {
      access: '/containers/:namespace?/:container/_content/access',
      activities: '/containers/:namespace?/:container/_content/activity',
      detail: '/containers/:namespace?/:container',
      images: '/containers/:namespace?/:container/_content/images',
      list: '/containers',
      manifest: '/containers/:namespace?/:container/_content/images/:digest',
    },
  },
  core: {
    group: {
      detail: '/group/:group',
      list: '/group-list',
    },
    role: {
      create: '/roles/create',
      edit: '/role/:role',
      list: '/roles',
    },
    signature_keys: '/signature-keys',
    status: '/status',
    task: {
      detail: '/task/:task',
      list: '/tasks',
    },
    user: {
      create: '/users/create',
      detail: '/users/:user_id',
      edit: '/users/:user_id/edit',
      list: '/users',
      profile: '/settings/user-profile',
    },
  },
  meta: {
    about: '/about-project',
    login: '/login',
    not_found: '/not-found', // FIXME: don't redirect
    search: '/search',
  },
  rpm: {
    search: '/rpm/search',
    package: { list: '/rpm/rpms' },
  },
};
