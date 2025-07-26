# pulp-ui

A community driven UI for [Pulp](https://pulpproject.org/).

## How to run

### Backend

You can follow the [pulp-oci-images quickstart](https://pulpproject.org/pulp-oci-images/docs/admin/tutorials/quickstart/),
TLDR:

#### Setup:

```sh
mkdir -p ~/pulp-backend-oci/{settings/certs,pulp_storage,pgsql,containers}
cd ~/pulp-backend-oci/
echo "
CONTENT_ORIGIN='http://$(hostname):8080'
ANSIBLE_API_HOSTNAME='http://$(hostname):8080'
ANSIBLE_CONTENT_HOSTNAME='http://$(hostname):8080/pulp/content'
" >> settings/settings.py
```

#### Run:

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

#### Check:

```sh
curl localhost:8080/pulp/api/v3/status/ | jq
```

or open http://localhost:8080/pulp/api/v3/status/

#### Configure `pulp-cli`:

```sh
pip install pulp-cli[pygments]
pulp config create --username admin --base-url http://localhost:8080 --password password

pulp --help
pulp user list
```

### Setup (run_container.sh script)

The `tests/run_container.sh` script is provided and allows you to run a command with a [Pulp OCI-image](https://pulpproject.org/pulp-oci-images/docs/admin/tutorials/quickstart/) container running.

It requires Docker or Podman to be installed.

The default credentials are:
 * Username: admin
 * Password: password

```
./tests/run_container sleep inf
```

The following optional environment variable is availble to be set:

* `IMAGE_TAG`: Change the Pulp OCI image tage to use, defaults to `latest`

### Frontend

You can clone the frontend from https://github.com/pulp/pulp-ui .

```sh
npm install
npm run start
```

and open http://localhost:8002/ :tada: :)

If your PULP API listens elsewhere, you can use `API_PROXY=http://elsewhere:12345 npm run start` instead. Do note that the server at `elsewhere` has to be configured to allow CORS requests for `localhost` (where UI actually listens); using something like `changeOrigin` is out of scope for pulp-ui, and breaks pulp API URLs (because the domains are based on the Origin header). Do NOT use webpack proxy in production.


## Misc

### Post-build configuration

The UI builds produced by `npm run build` can be further configured by serving a `/pulp-ui-config.json` alongside the built UI.
(Note it has to be mapped at `/`, not just wherever `index.html` is served from.)

* `API_BASE_PATH` - defaults to `/pulp/api/v3/` - change when using domains or a different path
* `UI_BASE_PATH` - defaults to `/ui/` - change when only serving index in a subdirectory, or want different browser path prefix
* `UI_EXTERNAL_LOGIN_URI` - defaults to nothing - set to something like `/login/` when using an SSO
* `EXTRA_VERSION` - an extra version string to display in about modal
