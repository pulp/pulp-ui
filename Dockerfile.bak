# WARNING
# This Dockerfile is intended for development purposes only. Do not use it for production deployments
# Copied from https://github.com/ansible/ansible-hub-ui/blob/master/Dockerfile

FROM node:20-alpine
WORKDIR /pulp/

RUN mkdir -p /pulp/app/ && \
    apk add --no-cache git && \
    git config --global --add safe.directory /pulp/app

# install npm in /pulp and mount the app in /pulp/app so that the installed node_modules
# doesn't trample node_modules on your computer. see https://www.docker.com/blog/keep-nodejs-rockin-in-docker/ for details
COPY package.json package-lock.json /pulp/
RUN npm install

# make webpack-dev-sever and other node packages executable
ENV PATH /pulp/node_modules/.bin:$PATH

WORKDIR /pulp/app
EXPOSE 8002
CMD ["npm", "run", "start"]
