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

# Non-root user
RUN addgroup -S user \
    && adduser -S user -G user
RUN chown -R user:user /app
USER user

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_TOKEN_URI
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_TOKEN_URI=$GOOGLE_TOKEN_URI

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --from=builder /app/area_*.py* ./

COPY . .

ENTRYPOINT ["python", "-m", "main"]
