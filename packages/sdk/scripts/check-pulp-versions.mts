import {
  fetchRemoteVersions,
  isVersionLess,
  readLocalVersions,
  supportedPlugins,
} from './versions.mts';

const remoteVersions = await fetchRemoteVersions();
const localVersions = readLocalVersions();

const notInstalled: string[] = [];
const notTracked: string[] = [];
const regressions: string[] = [];

for (const plugin of supportedPlugins) {
  const remoteVersion = remoteVersions.get(plugin);
  const localVersion = localVersions[plugin];

  if (remoteVersion === undefined) {
    notInstalled.push(plugin);
    continue;
  }

  if (localVersion === undefined) {
    notTracked.push(plugin);
    continue;
  }

  if (isVersionLess(remoteVersion, localVersion)) {
    regressions.push(plugin);
  }
}

if (notInstalled.length > 0) {
  console.warn(
    'Supported plugins not installed on the running Pulp instance:',
    notInstalled,
  );
}

if (notTracked.length > 0) {
  console.warn('Plugins not yet tracked in pulp-versions.json:', notTracked);
}

if (regressions.length > 0) {
  console.error('Pulp plugin version regressions detected:', regressions);
  process.exit(1);
}
