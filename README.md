# pulp-ui

A community driven UI for [Pulp](https://pulpproject.org/).

## How to run

### backend

You can follow the [pulp-oci-images quickstart](https://pulpproject.org/pulp-oci-images/docs/admin/tutorials/quickstart/),
TLDR:

#### setup:

```sh
mkdir -p ~/pulp-backend-oci/{settings/certs,pulp_storage,pgsql,containers}
cd ~/pulp-backend-oci/
echo "
CONTENT_ORIGIN='http://$(hostname):8080'
ANSIBLE_API_HOSTNAME='http://$(hostname):8080'
ANSIBLE_CONTENT_HOSTNAME='http://$(hostname):8080/pulp/content'
" >> settings/settings.py
```

#### run:

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

#### check:

```sh
curl localhost:8080/pulp/api/v3/status/ | jq
```

or open http://localhost:8080/pulp/api/v3/status/

#### change password:

```sh
podman exec -it pulp pulpcore-manager reset-admin-password --password admin
```
```sh
docker exec -it compose-pulp_api-1 pulpcore-manager reset-admin-password --password admin
```

#### configure `pulp-cli`:

```sh
pip install pulp-cli[pygments]
pulp config create --username admin --base-url http://localhost:8080 --password admin

pulp --help
pulp user list
```

### frontend

You can clone the frontend from https://github.com/pulp/pulp-ui .

```sh
npm install
npm run start
```

and open http://localhost:8002/ :tada: :)

If your API listens elsewhere, you can use `API_PROXY=http://elsewhere:12345 npm run start` instead. Do note that the server at `elsewhere` has to be configured to allow CORS requests for `localhost` (where UI actually listens); using something like `changeOrigin` is out of scope for pulp-ui, and breaks pulp API URLs (because the domains are based on the Origin header). Do NOT use webpack proxy in production.


## Misc

### post-build configuration

The UI builds produced by `npm run build` can be further configured by serving a `/pulp-ui-config.json` alongside the built UI.
(Note it has to be mapped at `/`, not just wherever `index.html` is served from.)

* `API_BASE_PATH` - defaults to `/pulp/api/v3/` - change when using domains or a different path
* `UI_BASE_PATH` - defaults to `/ui/` - change when only serving index in a subdirectory, or want different browser path prefix
* `UI_EXTERNAL_LOGIN_URI` - defaults to nothing - set to something like `/login/` when using an SSO
* `EXTRA_VERSION` - an extra version string to display in about modal
