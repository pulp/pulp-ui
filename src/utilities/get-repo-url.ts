import { config } from 'src/ui-config';

// Returns the API path for a specific repository
export function getRepoURL(distribution_base_path) {
  const host = window.location.origin;
  const { API_BASE_PATH } = config;

  return `${host}${API_BASE_PATH}content/${distribution_base_path}/`;
}

// returns the server name for (protocol-less) container urls
// url/image, url/image:tag, url/image@digest (including sha256: prefix)
export function getContainersURL({
  name,
  tag,
  digest,
}: {
  name: string;
  tag?: string;
  digest?: string;
}) {
  const host = window.location.host;

  return `${host}/${name}${tag ? `:${tag}` : ''}${
    digest && !tag ? `@${digest}` : ''
  }`;
}
