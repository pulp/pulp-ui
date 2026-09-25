import { AnsibleDistributionAPI } from '../api/ansible-distribution';
import { AnsibleRemoteAPI } from '../api/ansible-remote';
import { AnsibleRepositoryAPI } from '../api/ansible-repository';
import {
  ContainerDistributionAPI,
  ContainerPullThroughDistributionAPI,
} from '../api/container-distribution';

export const ModelToApi = {
  // TODO: Add all model translations
  ansiblerepository: AnsibleRepositoryAPI,
  ansibleremote: AnsibleRemoteAPI,
  ansibledistribution: AnsibleDistributionAPI,
  containerdistribution: ContainerDistributionAPI,
  containerpullthroughdistribution: ContainerPullThroughDistributionAPI,
};
