# pulp-ui
a community driven UI for Pulp

## How to run

### backend

You can follow the [pulp-oci-images quickstart](https://pulpproject.org/pulp-oci-images/docs/admin/tutorials/quickstart/),
TLDR:

setup:

```
mkdir -p ~/pulp-backend-oci/{settings/certs,pulp_storage,pgsql,containers}
cd ~/pulp-backend-oci/
echo "
CONTENT_ORIGIN='http://$(hostname):8080'
ANSIBLE_API_HOSTNAME='http://$(hostname):8080'
ANSIBLE_CONTENT_HOSTNAME='http://$(hostname):8080/pulp/content'
" >> settings/settings.py
```

run:

```
cd ~/pulp-backend-oci/
podman run --publish 8080:80 \
           --replace --name pulp \
           --volume "$(pwd)/settings":/etc/pulp \
           --volume "$(pwd)/pulp_storage":/var/lib/pulp \
           --volume "$(pwd)/pgsql":/var/lib/pgsql \
           --volume "$(pwd)/containers":/var/lib/containers \
           docker.io/pulp/pulp
```

check:

```
curl localhost:8080/pulp/api/v3/status/ | jq
```

change password:

```
podman exec -it pulp pulpcore-manager reset-admin-password --password admin
```

configure pulp-cli:

```
pip install pulp-cli[pygments]
pulp config create --username admin --base-url http://localhost:8080 --password admin

pulp --help
pulp user list
```

### frontend

```
npm install
npm run start
```

and open http://localhost:8002/ :tada: :)
