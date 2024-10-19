import { HubAPI } from './hub';

class API extends HubAPI {
  apiPath = 'v3/tasks/';
}

export const TaskAPI = new API();
