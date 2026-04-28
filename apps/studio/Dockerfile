FROM node:20-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace

EXPOSE 3333

CMD ["./scripts/dev/bootstrap-workspace.sh", "pnpm", "--filter", "@kontinu/studio", "dev"]
