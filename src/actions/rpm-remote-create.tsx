import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const rpmRemoteCreateAction = Action({
  title: msg`Add remote`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.rpm.remote.edit, { name: '_' })),
});
