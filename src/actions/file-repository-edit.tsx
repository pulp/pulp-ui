import { msg } from '@lingui/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const fileRepositoryEditAction = Action({
  title: msg`Edit`,
  onClick: ({ name }, { navigate }) =>
    navigate(formatPath(Paths.file.repository.edit, { name })),
});
