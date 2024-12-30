import { msg } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const fileRepositoryCreateAction = Action({
  title: msg`Add repository`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.file.repository.edit, { name: '_' })),
});
