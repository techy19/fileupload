FROM postgres:9.6-alpine
ENV POSTGRES_USER postgres
COPY data.sql /docker-entrypoint-initdb.d
EXPOSE 5432