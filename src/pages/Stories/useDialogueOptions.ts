import { useEffect, useMemo, useState } from "react";
import { getIntentOptions } from "../../services/intentServices";
import {
  getActionOptions,
  getEntityOptions,
  getSlotOptions,
} from "../../services/dialogueOptionsService";
import type { EditorOptions } from "./components/StepsEditor";
import type { KnownNames } from "./steps";

export const NO_OPTIONS: EditorOptions = {
  intents: [],
  actions: [],
  slots: [],
  entities: [],
};

/**
 * Intents, actions, slots and entities to pick from and to describe steps
 * with. A list that fails to load stays empty and its message is in `errors`.
 */
export function useDialogueOptions() {
  const [options, setOptions] = useState<EditorOptions>(NO_OPTIONS);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getIntentOptions(),
      getActionOptions(),
      getSlotOptions(),
      getEntityOptions(),
    ]).then((results) => {
      if (cancelled) return;
      const [intents, actions, slots, entities] = results;
      const value = <T,>(result: PromiseSettledResult<T[]>) =>
        result.status === "fulfilled" ? result.value : [];
      setOptions({
        intents: value(intents),
        actions: value(actions),
        slots: value(slots),
        entities: value(entities),
      });
      setErrors(
        results.flatMap((result) =>
          result.status === "rejected" ? [String(result.reason?.message)] : []
        )
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const known = useMemo<KnownNames>(
    () => ({
      intents: new Set(options.intents.map((intent) => intent.name)),
      actions: new Set(options.actions.map((action) => action.name)),
      slots: new Set(options.slots.map((slot) => slot.name)),
      entities: new Set(options.entities.map((entity) => entity.name)),
    }),
    [options]
  );

  return { options, known, errors };
}
