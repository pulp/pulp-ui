import { msg } from '@lingui/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const ansibleRemoteCreateAction = Action({
  title: msg`Add remote`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.ansible.remote.edit, { name: '_' })),
});
