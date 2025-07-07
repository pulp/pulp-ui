import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const debianRemoteCreateAction = Action({
  title: msg`Add remote`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.debian.remote.edit, { name: '_' })),
});
