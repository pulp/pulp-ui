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

export const SigningServiceAPI = {
  list: (params?) => base.list(`signing-services/`, params),
};
