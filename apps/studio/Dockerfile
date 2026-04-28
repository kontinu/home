FROM node:20-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/studio/package.json apps/studio/package.json

RUN pnpm install

COPY . .

EXPOSE 3333

CMD ["pnpm", "--filter", "@kontinu/studio", "dev"]
