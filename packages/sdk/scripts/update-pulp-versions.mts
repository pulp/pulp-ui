import { writeFileSync } from 'node:fs';
import { fetchRemoteVersions, supportedPlugins } from './versions.mts';

const remoteVersions = await fetchRemoteVersions();

const versions: Record<string, string> = {};

for (const plugin of supportedPlugins) {
  const version = remoteVersions.get(plugin);
  if (version !== undefined) {
    versions[plugin] = version;
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  versions,
};

writeFileSync(
  new URL('../pulp-versions.json', import.meta.url),
  `${JSON.stringify(output, null, 2)}\n`,
);

console.log('Updated pulp-versions.json');
