# to build container: docker build -t la_tiendita_db:1 .
# to run container: docker run -it -p 3306:3306 la_tiendita_db:1
# to connect to container:
#     docker ps
#     copy container_id
#     docker exec -it $CONTAINER_ID sh
# to stop container:
#     docker stop $CONTAINER_ID

FROM mysql

ENV MYSQL_ROOT_PASSWORD admin
ENV MYSQL_DATABASE la_tiendita


WORKDIR /docker-entrypoint-initdb.d

COPY ./crear_db.sql ./

EXPOSE 3306
