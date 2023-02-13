#! /bin/bash

docker pull postgres
docker run --name postgres-development-container -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
docker exec -it postgres-development-container bash

# Once inside bash terminal in container, sequentially run:

    # psql -U postgres

    # CREATE DATABASE journal;

    # \c journal;

    # CREATE TABLE journal_entry(journal_entry_id SERIAL PRIMARY KEY,full_name CHAR(100),title CHAR(100),journal_entry VARCHAR(1000));

# Once finished with development mode, stop the container with:

    # docker stop postgres-development-container