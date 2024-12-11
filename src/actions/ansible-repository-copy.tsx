import { msg, t } from '@lingui/core/macro';
import { AnsibleDistributionAPI } from 'src/api';
import { getDistroURL, repositoryDistro } from 'src/utilities';
import { Action } from './action';

export const ansibleRepositoryCopyAction = Action({
  title: msg`Copy CLI configuration`,
  onClick: async (item, { addAlert }) => {
    let distro = null;

    if (!item.distro) {
      addAlert({
        id: 'copy-cli-config',
        title: t`Loading distribution...`,
        variant: 'info',
      });

      distro = await repositoryDistro(
        item.name,
        item.pulp_href,
        AnsibleDistributionAPI,
      ).catch(() => null);
    } else {
      distro = item.distro;
    }

    if (!distro) {
      addAlert({
        id: 'copy-cli-config',
        title: t`There are no distributions associated with this repository.`,
        variant: 'danger',
      });
      return;
    }

    const cliConfig = [
      '[galaxy]',
      `server_list = ${distro.name}`,
      '',
      `[galaxy_server.${distro.name}]`,
      `url=${getDistroURL(distro)}`,
      'token=<put your token here>',
    ].join('\n');

    navigator.clipboard.writeText(cliConfig);
    addAlert({
      description: <pre>{cliConfig}</pre>,
      id: 'copy-cli-config',
      title: t`Successfully copied to clipboard`,
      variant: 'success',
    });
  },
  disabled: (item) => {
    // disabled check only available on detail screen
    if ('distro' in item && !item.distro) {
      return t`There are no distributions associated with this repository.`;
    }

    return null;
  },
});
