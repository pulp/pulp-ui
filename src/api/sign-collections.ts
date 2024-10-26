import { repositoryBasePath } from 'src/utilities';
import { PulpAPI } from './pulp';
import { type CollectionVersionSearch } from './response-types/collection';

interface SignNamespace {
  signing_service?: string;
  repository?: CollectionVersionSearch['repository'];
  repository_name?: string;
  namespace: string;
}

interface SignCollection extends SignNamespace {
  collection?: string;
}

interface SignCollectionVersion extends SignCollection {
  version?: string;
}

type SignProps = SignNamespace | SignCollection | SignCollectionVersion;

const base = new PulpAPI();

// FIXME HubAPI
export const SignCollectionAPI = {
  sign: ({ repository, repository_name: name, ...args }: SignProps) =>
    repositoryBasePath(name, repository?.pulp_href)
      .catch((status) =>
        Promise.reject({
          response: { status },
        }),
      )
      .then((distro_base_path) =>
        base.http.post(`_ui/v1/collection_signing/`, {
          distro_base_path,
          ...args,
        }),
      ),
};
