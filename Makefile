# Makefile

.PHONY: run stop

POSTGRES_CONTAINER_NAME := postgres-dev
POSTGRES_DB := journal
POSTGRES_PASSWORD := password
PORT := 5432

run:
	docker run -d \
		--name $(POSTGRES_CONTAINER_NAME) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-p $(PORT):$(PORT) \
		postgres
	sleep 5 # Wait for the PostgreSQL server to start
	docker exec $(POSTGRES_CONTAINER_NAME) psql -U postgres $(POSTGRES_DB) \
		-c "CREATE TABLE journal_entry(journal_entry_id SERIAL PRIMARY KEY,full_name CHAR(100),title CHAR(100),journal_entry VARCHAR(1000));"
	npm run dev

stop:
	docker stop $(POSTGRES_CONTAINER_NAME)
	docker rm $(POSTGRES_CONTAINER_NAME)
	pkill node

