import { HubAPI } from './hub';
import { type UserType } from './response-types/user';

class API extends HubAPI {
  getUser(): Promise<UserType> {
    // FIXME
    return Promise.resolve({
      username: 'admin',
      groups: [],
      is_superuser: true,
      is_anonymous: false,
      model_permissions: {},
    });
  }
}

export const ActiveUserAPI = new API();
