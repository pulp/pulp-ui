import { msg } from '@lingui/macro';
import { Paths, formatPath } from 'src/paths';
import { Action } from './action';

export const ansibleRepositoryCreateAction = Action({
  title: msg`Add repository`,
  onClick: (item, { navigate }) =>
    navigate(formatPath(Paths.ansible.repository.edit, { name: '_' })),
});
