import { PulpAPI } from 'src/api/pulp';
import { createRemoteAPI } from './remote';
import { createRepositoryAPI } from './repository';

class RpmClient extends PulpAPI {
  repository = createRepositoryAPI(this);
  remote = createRemoteAPI(this);
}

export { RpmClient };
