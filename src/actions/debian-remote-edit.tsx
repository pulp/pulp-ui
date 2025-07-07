import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const debianRemoteEditAction = Action({
  title: msg`Edit`,
  onClick: ({ name }, { navigate }) =>
    navigate(formatPath(Paths.debian.remote.edit, { name })),
});
