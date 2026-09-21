import { msg } from '@lingui/core/macro';
import { downloadString } from '../utilities/download-data';
import { Action } from './action';

export const ansibleRemoteDownloadCAAction = Action({
  title: msg`Download CA certificate`,
  onClick: ({ ca_cert }) => downloadString(ca_cert, 'ca_cert'),
  visible: ({ ca_cert }) => !!ca_cert,
});
