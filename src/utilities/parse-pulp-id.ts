const UUIDRegEx =
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/i;

const IDRegEx = /^[0-9a-f-]+/i;

export function parsePulpIDFromURL(url: string): string {
  for (const section of url.split('/')) {
    if (section.match(UUIDRegEx)) {
      return section;
    }
  }

  return null;
}

export function parsePulpIDFromPRN(prn: string): string {
  // PRNs are of the form prn:app_label.model_label:pulp_id
  const sections = prn.split(':');
  if (sections.length == 3 && sections[2].match(UUIDRegEx)) {
    return sections[2];
  }

  return null;
}

interface PulpResource {
  id: string;
  plugin: string;
  model: string;
  resource_label?: string;
}

export function parsePulpResource(value: string): PulpResource {
  // value can be a url or a prn
  let id = '',
    plugin = '',
    model = '',
    resource_label;
  if (value.startsWith(API_BASE_PATH)) {
    const url = value.replace(API_BASE_PATH, '');
    id = parsePulpIDFromPRN(url);
    [plugin, model] = translateURLToModelLabel(url).split('.');
  } else if (value.startsWith('prn:')) {
    // prn is of the form `prn:app_label.model_label:pulp_id`
    let label;
    [, label, id] = value.split(':');
    [plugin, model] = label.split('.');
  } else if (value.startsWith('pdrn:')) {
    // pdrn is of the form `pdrn:domain_pulp_id:resource_label`
    [, id, resource_label] = value.split(':');
    [plugin, model] = ['core', 'domain'];
  } else {
    return null;
  }
  return {
    id: id,
    plugin: plugin,
    model: model,
    resource_label: resource_label,
  };
}

export function translatePulpResourceToURL(resource: PulpResource): string {
  // Doesn't handle PulpResources from pdrns
  const model_label = resource.plugin + '.' + resource.model;
  const urlPrefix = ModelLabelToURL[model_label];
  return API_BASE_PATH + urlPrefix + '/' + resource.id + '/';
}

function translateURLToModelLabel(url: string): string {
  const value = url.replace(API_BASE_PATH, '');
  const urlParts = value.split('/').filter((part) => !part.match(IDRegEx));
  const searchUrl = urlParts.join('/');
  return URLToModelLabel[searchUrl];
}

const URLToModelLabel = {
  // core
  access_policies: 'core.accesspolicy',
  groups: 'core.group',
  domains: 'core.domain',
  artifacts: 'core.artifact',
  'signing-services': 'core.signingservice',
  workers: 'core.worker',
  tasks: 'core.task',
  'task-groups': 'core.taskgroup',
  'task-schedules': 'core.taskschedule',
  'exporters/core/filesystem': 'core.filesystemexporter',
  'exporters/core/pulp': 'core.pulpexporter',
  'importers/core/pulp': 'core.pulpimporter',
  'contentguards/core/rbac': 'core.rbaccontentguard',
  'contentguards/core/content_redirect': 'core.contentredirectcontentguard',
  'contentguards/core/header': 'core.headercontentguard',
  'contentguards/core/composite': 'core.compositecontentguard',
  'distributions/core/artifacts': 'core.artifactdistribution',
  uploads: 'core.upload',
  'upstream-pulps': 'core.upstreampulp',
  roles: 'core.grouprole',
  // gem
  'content/gem/gem': 'gem.gemcontent',
  'distributions/gem/gem': 'gem.gemdistribution',
  'publications/gem/gem': 'gem.gempublication',
  'remotes/gem/gem': 'gem.gemremote',
  'repositories/gem/gem': 'gem.gemrepository',
  // rpm
  'content/rpm/advisories': 'rpm.updaterecord',
  'content/rpm/packagegroups': 'rpm.packagegroup',
  'content/rpm/packagecategories': 'rpm.packagecategory',
  'content/rpm/packageenvironments': 'rpm.packageenvironment',
  'content/rpm/packagelangpacks': 'rpm.packagelangpacks',
  'content/rpm/repo_metadata_files': 'rpm.repometadatafile',
  'content/rpm/distribution_trees': 'rpm.distributiontree',
  'content/rpm/packages': 'rpm.package',
  'content/rpm/modulemds': 'rpm.modulemd',
  'content/rpm/modulemd_defaults': 'rpm.modulemddefaults',
  'content/rpm/modulemd_obsoletes': 'rpm.modulemdobsolete',
  'remotes/rpm/rpm': 'rpm.rpmremote',
  'remotes/rpm/uln': 'rpm.ulnremote',
  'repositories/rpm/rpm': 'rpm.rpmrepository',
  'publications/rpm/rpm': 'rpm.rpmpublication',
  'distributions/rpm/rpm': 'rpm.rpmdistribution',
  'acs/rpm/rpm': 'rpm.rpmalternatecontentsource',
  // ansible
  'content/ansible/roles': 'ansible.role',
  'ansible/collections': 'ansible.collection',
  'pulp_ansible/tags': 'ansible.tag',
  'content/ansible/collection_versions': 'ansible.collectionversion',
  'content/ansible/collection_marks': 'ansible.collectionversionmark',
  'content/ansible/collection_signatures': 'ansible.collectionversionsignature',
  'content/ansible/namespaces': 'ansible.ansiblenamespacemetadata',
  'remotes/ansible/role': 'ansible.roleremote',
  'remotes/ansible/collection': 'ansible.collectionremote',
  'remotes/ansible/git': 'ansible.gitremote',
  'content/ansible/collection_deprecations':
    'ansible.ansiblecollectiondeprecated',
  'repositories/ansible/ansible': 'ansible.ansiblerepository',
  'distributions/ansible/ansible': 'ansible.ansibledistribution',
  // container
  'content/container/blobs': 'container.blob',
  'content/container/manifests': 'container.manifest',
  'content/container/tags': 'container.tag',
  'content/container/signatures': 'container.manifestsignature',
  'pulp_container/namespaces': 'container.containernamespace',
  'remotes/container/container': 'container.containerremote',
  'remotes/container/pull-through': 'container.containerpullthroughremote',
  'repositories/container/container': 'container.containerrepository',
  'repositories/container/container-push': 'container.containerpushrepository',
  'distributions/container/pull-through':
    'container.containerpullthroughdistribution',
  'distributions/container/container': 'container.containerdistribution',
  // ostree
  'content/ostree/objects': 'ostree.ostreeobject',
  'content/ostree/commits': 'ostree.ostreecommit',
  'content/ostree/refs': 'ostree.ostreeref',
  'content/ostree/content': 'ostree.ostreecontent',
  'content/ostree/configs': 'ostree.ostreeconfig',
  'content/ostree/summaries': 'ostree.ostreesummary',
  'remotes/ostree/ostree': 'ostree.ostreeremote',
  'repositories/ostree/ostree': 'ostree.ostreerepository',
  'distributions/ostree/ostree': 'ostree.ostreedistribution',
  // python
  'distributions/python/pypi': 'python.pythondistribution',
  'content/python/packages': 'python.pythonpackagecontent',
  'publications/python/pypi': 'python.pythonpublication',
  'remotes/python/python': 'python.pythonremote',
  'repositories/python/python': 'python.pythonrepository',
  // maven
  'content/maven/artifact': 'maven.mavenartifact',
  'remotes/maven/maven': 'maven.mavenremote',
  'distributions/maven/maven': 'maven.mavendistribution',
  'repositories/maven/maven': 'maven.mavenrepository',
  // certguard
  'contentguards/certguard/rhsm': 'certguard.rhsmcertguard',
  'contentguards/certguard/x509': 'certguard.x509certguard',
  // file
  'content/file/files': 'file.filecontent',
  'remotes/file/file': 'file.fileremote',
  'repositories/file/file': 'file.filerepository',
  'publications/file/file': 'file.filepublication',
  'distributions/file/file': 'file.filedistribution',
  'acs/file/file': 'file.filealternatecontentsource',
  // deb
  'content/deb/packages': 'deb.package',
  'content/deb/installer_packages': 'deb.installerpackage',
  'content/deb/generic_contents': 'deb.genericcontent',
  'content/deb/source_packages': 'deb.sourcepackage',
  'content/deb/releases': 'deb.release',
  'content/deb/release_architectures': 'deb.releasearchitecture',
  'content/deb/release_components': 'deb.releasecomponent',
  'content/deb/package_release_components': 'deb.packagereleasecomponent',
  'content/deb/source_release_components': 'deb.sourcepackagereleasecomponent',
  'content/deb/release_files': 'deb.releasefile',
  'content/deb/package_indices': 'deb.packageindex',
  'content/deb/installer_file_indices': 'deb.installerfileindex',
  'content/deb/source_indices': 'deb.sourceindex',
  'publications/deb/verbatim': 'deb.verbatimpublication',
  'publications/deb/apt': 'deb.aptpublication',
  'distributions/deb/apt': 'deb.aptdistribution',
  'remotes/deb/apt': 'deb.aptremote',
  'repositories/deb/apt': 'deb.aptrepository',
};

const ModelLabelToURL = Object.keys(URLToModelLabel).reduce((ret, key) => {
  ret[URLToModelLabel[key]] = key;
  return ret;
}, {});
