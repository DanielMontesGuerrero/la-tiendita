# to build container: docker build -t la_tiendita_cliente:1 .
# to run container: docker run -it -p 3000:3000 la_tiendita_cliente:1
# to connect to container:
#     docker ps
#     copy container_id
#     docker exec -it $CONTAINER_ID sh
# to stop container:
#     docker stop $CONTAINER_ID

FROM node

WORKDIR '/usr/app'

ARG REACT_APP_HOST_SERVER
ENV REACT_APP_HOST_SERVER $REACT_APP_HOST_SERVER

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./create-env-file.sh ./create-env-file.sh

RUN npm i -g serve
RUN npm install

ARG REACT_APP_MODE

RUN sh create-env-file.sh REACT_APP_MODE=${REACT_APP_MODE}

COPY ./ ./

CMD ["npm", "run", "start-prod"]

# RUN npm run build

# COPY ./serve.json ./build/serve.json

# CMD ["serve", "-s", "build"]
