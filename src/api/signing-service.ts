import { PulpAPI } from './pulp';

export class SigningServiceType {
  name: string;
  pubkey_fingerprint: string;
  public_key: string;
  pulp_created: string;
  pulp_href: string;
  script: string;
}

const base = new PulpAPI();
base.apiPath = 'signing-services/';

export const SigningServiceAPI = {
  list: (params?) => base.list(params),
};
