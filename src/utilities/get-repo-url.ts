import { config } from 'src/ui-config';
import { parsePulpResource } from 'src/utilities';
import { ModelToApi } from 'src/utilities';

export function getDistroURL(distribution) {
  const resource = parsePulpResource(
    distribution.prn ? distribution.prn : distribution.pulp_href,
  );
  let getURL = (data) => data.base_url;
  if (resource) {
    const api = ModelToApi[resource.model];
    if (api && api.url) {
      getURL = api.url;
    }
  }
  return getURL(distribution);
}

// These two are specific to GalaxyNG
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
