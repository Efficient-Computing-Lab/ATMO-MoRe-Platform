FROM node:22.14 AS development
WORKDIR /atmo_platform
COPY ./atmo_platform/package.json /atmo_platform/package.json
RUN npm i
ENTRYPOINT [ "npm", "run", "start" ]