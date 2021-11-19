# to build container: docker build -t mi_tiendita_servidor:1 .
# to run container: docker run -it -p 8080:8080 mi_tiendita_servidor:1 
# to connect to container:
#     docker ps
#     copy container_id
#     docker exec -it $CONTAINER_ID sh
# to stop container:
#     docker stop $CONTAINER_ID

FROM node

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start-prod"]
