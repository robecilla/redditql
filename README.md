# redditql

This is a full-stack reddit like application that constists of:
- Next.js frontend deployed on Vercel.
- Backend deployed on a prebuilt Dokku droplet on Digital Ocean VPS. 

Nginx is sitting in front which proxies requests to Node.js GraphQL server that uses Prisma 2 to talk to a Postgresql database running in a container.

A Redis image is also there to manage sessions.

Dokku manages all the images as well as deployments.


### Tech stack

- React
- Chakra UI
- Next.js
- TypeScript
- URQL
- Node.js
- GraphQL
- TypeGraphQL
- Prisma 2
- PostgreSQL
- Redis
- Docker
- Dokku
