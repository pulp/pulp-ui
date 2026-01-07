#!/bin/bash

# This script was originally taken from the https://github.com/pulp/squeezer repository and adapted for pulp-ui

set -eu

BASEPATH="$(dirname "$(readlink -f "$0")")"
export BASEPATH

if [ -z "${CONTAINER_RUNTIME:+x}" ]
then
  if command -v podman > /dev/null 2>&1
  then
    CONTAINER_RUNTIME=podman
  else
    CONTAINER_RUNTIME=docker
  fi
fi
export CONTAINER_RUNTIME

if [ -z "${KEEP_CONTAINER:+x}" ]
then
  RM="yes"
else
  RM=""
fi

IMAGE_TAG="${IMAGE_TAG:-latest}"

# Check if getenforce is available and set SELINUX accordingly
if command -v getenforce > /dev/null 2>&1
then
  if [ "$(getenforce)" = "Enforcing" ]
  then
    SELINUX="yes"
  else
    SELINUX=""
  fi
else
  SELINUX=""
fi

"${CONTAINER_RUNTIME}" \
  run ${RM:+--rm} \
  --env S6_KEEP_ENV=1 \
  --detach \
  --name "pulp-ephemeral" \
  --volume "${BASEPATH}/settings:/etc/pulp${SELINUX:+:Z}" \
  --publish "8080:80" \
  --network "bridge" \
  "docker.io/pulp/pulp:${IMAGE_TAG}"

# shellcheck disable=SC2064
trap "${CONTAINER_RUNTIME} stop pulp-ephemeral" EXIT
# shellcheck disable=SC2064
trap "${CONTAINER_RUNTIME} stop pulp-ephemeral" INT

echo "Wait for pulp to start."
for counter in $(seq 40 -1 0)
do
  if [ "$counter" = "0" ]
  then
    echo "FAIL."
    "${CONTAINER_RUNTIME}" images
    "${CONTAINER_RUNTIME}" ps -a
    "${CONTAINER_RUNTIME}" logs "pulp-ephemeral"
    exit 1
  fi

  sleep 3
  if curl --fail "http://localhost:8080/pulp/api/v3/status/" > /dev/null 2>&1
  then
    echo "SUCCESS."
    break
  fi
  echo "."
done

# Show pulpcore/plugin versions we're using
curl -s "http://localhost:8080/pulp/api/v3/status/" | jq '.versions|map({key: .component, value: .version})|from_entries'

# Set admin password
"${CONTAINER_RUNTIME}" exec "pulp-ephemeral" pulpcore-manager reset-admin-password --password admin

PULP_LOGGING="${CONTAINER_RUNTIME}" "$@"
