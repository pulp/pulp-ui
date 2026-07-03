import { PulpAPI } from "src/api/pulp";
import { createRepositoryAPI } from "./repository";

class RpmClient extends PulpAPI {
    repository = createRepositoryAPI(this);
}

export { RpmClient };
