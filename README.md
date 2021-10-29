# pulp-ui

THIS IS  ATEST

A Pulp plugin to provide a Web UI for Pulp 3.

For more information, please see the [documentation](docs/index.rst) or the [Pulp project page](https://pulpproject.org/).


The Web UI project assumes that Pulp's REST API is available at http://localhost:8080/. The simplest way to deploy pulp is
using the [single container](https://pulpproject.org/pulp-in-one-container/).

Once you have Pulp installed, you need to install [npm](https://www.npmjs.com/get-npm). It gets installed together with
[node.js](https://nodejs.org/en/download/)

Once you have `npm`, you can run the following commands to install, build, and launch the Web UI project.

    cd pulp_ui/app/
    npm install
    npm run start:dev

The Web UI project uses [webpack](https://webpack.js.org/concepts/) to bundle all the TypeScript assets and serve them
using a development web server. The config for the development server is [here](pulp_ui/app/webpack.dev.js).

The Web UI project was seeded using [Patternly React Seed](https://github.com/patternfly/patternfly-react-seed) project.

The pulpcore-client and pulp_file client are generated using the ``generate.sh`` script from
[pulp-openapi-generator](https://github.com/pulp/pulp-openapi-generator) repository.

    ./generate.sh pulpcore typescript
    ./generate.sh pulp_file typescript

The above two commands produce a ``pulpcore-client`` and ``pulp_file-client`` directories with the clients.
