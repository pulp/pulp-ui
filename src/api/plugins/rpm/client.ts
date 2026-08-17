import { PulpAPI } from 'src/api/pulp';
import { createRemoteAPI } from './remote';
import { createRepositoryAPI } from './repository';
import { createDistributionAPI } from './distribution';

class RpmClient extends PulpAPI {
  repository = createRepositoryAPI(this);
  remote = createRemoteAPI(this);
  distribution = createDistributionAPI(this);
}

export { RpmClient };
