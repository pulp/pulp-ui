import { msg } from '@lingui/core/macro';
import { downloadString } from '../utilities/download-data';
import { Action } from './action';

export const ansibleRemoteDownloadRequirementsAction = Action({
  title: msg`Download requirements YAML`,
  onClick: ({ requirements_file }) =>
    downloadString(requirements_file, 'requirements.yml'),
  visible: ({ requirements_file }) => !!requirements_file,
});
