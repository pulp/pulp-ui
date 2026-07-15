import { PulpAPI } from 'src/api/pulp';
import { createRepositoryAPI } from './repository';
import { createRemoteAPI } from './remote';

class RpmClient extends PulpAPI {
  repository = createRepositoryAPI(this);
  remote = createRemoteAPI(this);
}

export { RpmClient };
