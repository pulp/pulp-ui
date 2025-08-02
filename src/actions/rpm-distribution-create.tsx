import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const rpmDistributionCreateAction = Action({
  title: msg`Create distribution`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.rpm.distribution.edit, { name: '_' })),
});
