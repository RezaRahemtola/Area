FROM python:3.11-buster AS builder

RUN pip install poetry==1.4.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install

RUN git clone https://github.com/RezaRahemtola/area-proto.git proto

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

RUN python -m grpc_tools.protoc -I./proto --python_out=. --pyi_out=. --grpc_python_out=. proto/area_back.proto proto/area_types.proto

FROM python:3.11-slim-buster AS runtime

WORKDIR /app

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --from=builder /app/area_*.py* ./

COPY . .

ENTRYPOINT ["python", "-m", "main"]
