import { PulpAPI } from 'src/api/pulp';
import { createDistributionAPI } from './distribution';
import { createPublicationAPI } from './publication';
import { createRemoteAPI } from './remote';
import { createRepositoryAPI } from './repository';

class RpmClient extends PulpAPI {
  repository = createRepositoryAPI(this);
  remote = createRemoteAPI(this);
  distribution = createDistributionAPI(this);
  publication = createPublicationAPI(this);
}

export { RpmClient };
