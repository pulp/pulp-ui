import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from '../paths';
import { Action } from './action';

export const debianRepositoryEditAction = Action({
  title: msg`Edit`,
  onClick: ({ name }, { navigate }) =>
    navigate(formatPath(Paths.debian.repository.edit, { name })),
});
