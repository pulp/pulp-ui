import {
  AnsibleDistributionAPI,
  AnsibleRemoteAPI,
  AnsibleRepositoryAPI,
  ContainerDistributionAPI,
  ContainerPullThroughDistributionAPI,
} from 'src/api';

export const ModelToApi = {
  // TODO: Add all model translations
  ansiblerepository: AnsibleRepositoryAPI,
  ansibleremote: AnsibleRemoteAPI,
  ansibledistribution: AnsibleDistributionAPI,
  containerdistribution: ContainerDistributionAPI,
  containerpullthroughdistribution: ContainerPullThroughDistributionAPI,
};
