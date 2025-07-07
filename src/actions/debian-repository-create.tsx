import { msg, t } from '@lingui/core/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const debianRepositoryCreateAction = Action({
  title: msg`Add repository`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.debian.repository.edit, { name: '_' })),
});

