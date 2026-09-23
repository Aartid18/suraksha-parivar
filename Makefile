.PHONY: dev test lint eval seed help setup

help:
	@echo "Suraksha Parivar Commands:"
	@echo "  make setup   - Install dependencies for backend and frontend"
	@echo "  make dev     - Start API backend and Web frontend locally"
	@echo "  make test    - Run pytest for api engine and vitest for web"
	@echo "  make lint    - Run ruff for python and eslint for frontend"
	@echo "  make eval    - Run offline evaluation harness on synthetic dataset"
	@echo "  make seed    - Seed local database with demo families and scam KB"

setup:
	@cd apps/api && pip install -r requirements.txt
	@cd apps/web && npm install

dev-api:
	@cd apps/api && uvicorn main:app --reload --port 8000

dev-web:
	@cd apps/web && npm run dev

test:
	@cd apps/api && pytest
	@cd apps/web && npm test

eval:
	@python -m eval.run_eval

lint:
	@cd apps/api && ruff check .
	@cd apps/web && npm run lint
