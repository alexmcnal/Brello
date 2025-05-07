.PHONY: build up down bash server build_development_container  build_ci_container push_development_container push_ci_container prune prune_postgres prune_rubygems ci_rubocop ci_rspec ci_test

include .env

build: build_development_container

up:
	docker compose up -d
	docker compose exec web ./build.sh

down:
	docker compose down

bash:
	docker compose exec web bash

server:
	docker compose exec web foreman start --procfile Procfile.dev

web_server:
	docker compose exec web bundle exec rails s -b 0.0.0.0

background_jobs:
	docker compose exec web rails solid_queue:start

bundle:
	docker compose exec web bundle

console:
	docker compose exec web rails c

rspec:
	docker compose exec web rspec

guard:
	docker compose exec web bundle exec guard

rubocop:
	docker compose exec web rubocop

test: rubocop rspec

rebuild_index:
	docker compose exec web rails maintenance:rebuild_index

prune: down prune_postgres prune_rubygems prune_elastic_search

prune_postgres: down
	@volume_name="$(shell basename $(shell pwd))_db-data"; \
	echo "Removing $$volume_name"; \
	if [ "$$(docker volume ls -q --filter name=$$volume_name)" ]; then \
		docker volume rm $$volume_name; \
	else \
		echo "No postgres volume to remove"; \
	fi

prune_rubygems: down
	@volume_name="$(shell basename $(shell pwd))_rubygems"; \
	echo "Removing volume: $$volume_name"; \
	if [ "$$(docker volume ls -q --filter name=$$volume_name)" ]; then \
		docker volume rm $$volume_name; \
	else \
		echo "No rubygems volume to remove"; \
	fi

prune_elastic_search: down
	@volume_name="$(shell basename $(shell pwd))_es-data"; \
	echo "Removing volume: $$volume_name"; \
	if [ "$$(docker volume ls -q --filter name=$$volume_name)" ]; then \
		docker volume rm $$volume_name; \
	else \
		echo "No rubygems volume to remove"; \
	fi


ci_rubocop:
	bundle exec rubocop

ci_rspec:
	bundle exec rake assets:precompile
	bundle exec rspec --format progress --format RspecJunitFormatter --out rspec.xml

ci_test: ci_rubocop ci_rspec

load_backup:
	docker compose up -d
	docker compose exec web ./restore_latest_backup.sh

restore_latest_db: download_backup up

CONTAINER_ID := $(shell docker compose ps -q web)

speed_snail:
	docker update --cpus=0.3 $(CONTAINER_ID)

speed_flying_saucer:
	docker update --cpus=32 $(CONTAINER_ID)