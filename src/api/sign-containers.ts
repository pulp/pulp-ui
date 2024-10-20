import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const SignContainersAPI = {
  getSigningService: (serviceName: string) =>
    base.http.get(`/signing-services/?name=${serviceName}`),

  sign: (
    containerId: string,
    pulp_type: string,
    signServicePath: string,
    base_path: string,
  ) => {
    const postObj = { manifest_signing_service: signServicePath };
    if (pulp_type === 'container') {
      postObj['future_base_path'] = base_path;
    }

    return base.http.post(
      `/repositories/container/${pulp_type}/${containerId}/sign/`,
      postObj,
    );
  },
};
