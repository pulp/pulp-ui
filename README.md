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
           --volume "$(pwd)/settings":/etc/pulp \
           --volume "$(pwd)/pulp_storage":/var/lib/pulp \
           --volume "$(pwd)/pgsql":/var/lib/pgsql \
           --volume "$(pwd)/containers":/var/lib/containers \
           --device /dev/fuse \
           docker.io/pulp/pulp
```

### frontend

```
npm install
npm run start
```

and open http://localhost:8002/ :tada: :)
