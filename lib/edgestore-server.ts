import { initEdgeStore } from "@edgestore/server";
import { initEdgeStoreClient } from "@edgestore/server/core";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  eventImages: es.imageBucket({
    maxSize: 1024 * 1024 * 5, // 5MB
    accept: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
