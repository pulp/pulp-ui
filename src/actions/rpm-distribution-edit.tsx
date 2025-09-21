import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const rpmDistributionEditAction = Action({
  title: msg`Edit`,
  onClick: ({ name }, { navigate }) =>
    navigate(formatPath(Paths.rpm.distribution.edit, { name })),
});
