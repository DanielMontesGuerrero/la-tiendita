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

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start-prod"]
