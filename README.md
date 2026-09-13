<p align="center">
  <img src="static/images/pulp_logo.png" alt="Pulp logo" width="150">
</p>

# PulpUI

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.32.2-brightgreen)](package.json)

PulpUI is a community driven single-page application that talks to a running [pulpcore](https://github.com/pulp/pulpcore) instance over its REST API, giving that content - across whichever plugins your Pulp deployment has installed - a shared, consistent web UI instead of requiring the CLI or raw API calls.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Contributing & Help](#contributing--help)
- [License](#license)

## Features
### Core
- Task Management
- User / Group / Role management
- Content Signing Keys
- Cross-plugin search

### Plugins
- Ansible (repositories, remotes, collections, namespaces, approvals, imports)
- File (repositories, remotes)
- RPM (content)
- Container (execution environments, tags, manifests)

## Requirements
- Node.js >= 22.32.2
- npm >= 10
- Python 3 + pip

## Quick start

### 1. Run a Pulp backend

Follow the [pulp-oci-images quickstart](https://pulpproject.org/pulp-oci-images/docs/admin/tutorials/quickstart/)

#### Setup

```sh
mkdir -p ~/pulp-backend-oci/{settings/certs,pulp_storage,pgsql,containers}
cd ~/pulp-backend-oci/
echo "
CONTENT_ORIGIN='http://$(hostname):8080'
ANSIBLE_API_HOSTNAME='http://$(hostname):8080'
ANSIBLE_CONTENT_HOSTNAME='http://$(hostname):8080/pulp/content'
" >> settings/settings.py
```
#### Run

```sh
cd ~/pulp-backend-oci/
podman run --publish 8080:80 \
           --replace --name pulp \
           --volume "$(pwd)/settings":/etc/pulp \
           --volume "$(pwd)/pulp_storage":/var/lib/pulp \
           --volume "$(pwd)/pgsql":/var/lib/pgsql \
           --volume "$(pwd)/containers":/var/lib/containers \
           docker.io/pulp/pulp
```
#### Check
```sh
curl localhost:8080/pulp/api/v3/status/ | jq
```
#### Change the admin password
```sh
podman exec -it pulp pulpcore-manager reset-admin-password --password admin
```
#### Configure `pulp-cli` (optional)
```sh
pip install pulp-cli[pygments]
pulp config create --username admin --base-url http://localhost:8080 --password admin

pulp --help
pulp user list
```

---

### 2. Run the frontend

#### Clone and install
```sh
git clone https://github.com/pulp/pulp-ui
cd pulp-ui
npm install
```

#### Start
```sh
npm run start
```

Open http://localhost:8002/.

If your API listens elsewhere, you can use `API_PROXY=http://elsewhere:12345 npm run start`. The server at `elsewhere` must allow CORS requests from `localhost`; using `changeOrigin` is out of scope for pulp-ui, and breaks pulp API URLs. **Do NOT use the webpack proxy in production.**

## Configuration
A production build (`npm run build`) can be further configured by serving a `/pulp-ui-config.json` alongside the built UI, mapped at `/`. 

| Key                     | Default         | Purpose                                                                                 |
|-------------------------|-----------------|-----------------------------------------------------------------------------------------|
| `API_BASE_PATH`         | `/pulp/api/v3/` | Change when using domains or a different path                                           |
| `UI_BASE_PATH`          | `/ui/`          | Change when only serving index in a subdirectory, or want different browser path prefix |
| `UI_EXTERNAL_LOGIN_URI` | `null`          | Set to something like `/login/` when using SSO                                          |
| `EXTRA_VERSION`         | `""`            | An extra version string to display in about modal                                       |

## Contributing & Help
See the [Pulp developer guide](https://pulpproject.org/dev/) to contribute, or reach the community on [Discourse](https://discourse.pulpproject.org) / Matrix ([#pulp](https://matrix.to/#/#pulp:matrix.org), [#pulp-dev](https://matrix.to/#/#pulp-dev:matrix.org))

## License
[Apache-2.0](LICENSE)
