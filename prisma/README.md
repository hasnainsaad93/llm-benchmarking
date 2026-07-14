# Prisma schema

This directory contains the Prisma schema and is used to generate the
TypeScript Prisma Client.

Update `schema.prisma` and then run:

```bash
npx prisma migrate dev --name <migration-name>
```

or, after changing only types without persisting data yet:

```bash
npx prisma db push
```
