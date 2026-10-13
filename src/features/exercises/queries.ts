import { desc, isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import type { TrackingType } from "@/constants/enums";
import { db } from "@/db/client";
import { newId } from "@/db/id";
import { exercises } from "@/db/schema";

// Ejercicio del usuario: sin key, con el nombre tal cual (no se traduce).
// Se devuelve la consulta para que quien llame haga await: Drizzle no la
// ejecuta hasta entonces.
export function createExercise(input: {
  name: string;
  description: string;
  trackingType: TrackingType;
}) {
  return db.insert(exercises).values({
    id: newId(),
    name: input.name.trim(),
    description: input.description.trim() || null,
    trackingType: input.trackingType,
  });
}

// Se vuelve a ejecutar sola cuando cambia la tabla (client.ts abre la base de
// datos con enableChangeListener).
export function useExercises() {
  return useLiveQuery(
    db
      .select()
      .from(exercises)
      .where(isNull(exercises.archivedAt))
      .orderBy(desc(exercises.createdAt)),
  );
}
