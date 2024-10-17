# pulp-ui
a community driven UI for [Pulp](https://pulpproject.org/)

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

```sh
npm install
npm run start
```

and open http://localhost:8002/ :tada: :)
