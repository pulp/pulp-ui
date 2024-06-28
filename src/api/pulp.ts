import { BaseAPI } from './base';

export class PulpAPI extends BaseAPI {
  mapPageToOffset = true; // offset & limit
  sortParam = 'ordering';

  constructor() {
    super(API_BASE_PATH);
  }
}
