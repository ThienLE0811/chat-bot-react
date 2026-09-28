/**
 * A story is a list of Rasa steps. The editor understands three kinds of step
 * and shows every other kind (checkpoint, or, active_loop...) read-only.
 * Edits only touch the keys the editor owns, so saving never drops data it
 * cannot show.
 */

export type Step = Record<string, unknown>;

export type StepKind = "user" | "bot" | "slot" | "other";

/** One `name` or `name: value` item of an `entities` or `slot_was_set` list. */
export interface Pair {
  name: string;
  value?: unknown;
}

/** A step with a key that stays the same while the list is reordered. */
export interface StepItem {
  key: string;
  step: Step;
}

export const STEP_LABELS: Record<StepKind, string> = {
  user: "Người dùng nói",
  bot: "Bot phản hồi",
  slot: "Ghi nhớ thông tin",
  other: "Bước nâng cao",
};

const EDITABLE_KEYS: Record<Exclude<StepKind, "other">, string[]> = {
  user: ["intent", "entities"],
  bot: ["action"],
  slot: ["slot_was_set"],
};

export function stepKind(step: Step): StepKind {
  const keys = Object.keys(step);
  const only = (allowed: string[]) => keys.every((key) => allowed.includes(key));
  if ("intent" in step && only(EDITABLE_KEYS.user)) return "user";
  if ("action" in step && only(EDITABLE_KEYS.bot)) return "bot";
  if ("slot_was_set" in step && only(EDITABLE_KEYS.slot)) return "slot";
  return "other";
}

/**
 * `{}`: the old editor saved slot_was_set steps like this, dropping their
 * content. The backend refuses to train on it.
 */
export const isEmptyStep = (step: Step) => Object.keys(step).length === 0;

export function newStep(kind: Exclude<StepKind, "other">): Step {
  if (kind === "user") return { intent: "" };
  if (kind === "bot") return { action: "" };
  return { slot_was_set: [""] };
}

let nextKey = 0;
export const toItems = (steps: Step[]): StepItem[] =>
  steps.map((step) => ({ key: `step-${nextKey++}`, step }));

export const makeItem = (step: Step): StepItem => toItems([step])[0];

/** Reads `[a, {b: 1}]` as pairs; an object item may hold several names. */
export function toPairs(value: unknown): Pair[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): Pair[] => {
    if (typeof item === "string") return [{ name: item }];
    if (item && typeof item === "object") {
      return Object.entries(item).map(([name, value]) => ({ name, value }));
    }
    return [];
  });
}

/** A pair without a value is written as the bare name, as Rasa allows. */
function fromPair({ name, value }: Pair): string | Record<string, unknown> {
  return value === undefined || value === "" ? name : { [name]: value };
}

export const fromPairs = (pairs: Pair[]) => pairs.map(fromPair);

/** The user step with its entities replaced, other keys kept. */
export function withEntities(step: Step, pairs: Pair[]): Step {
  const { entities, ...rest } = step;
  return pairs.length ? { ...rest, entities: fromPairs(pairs) } : rest;
}

export interface StepProblem {
  /** Blocks saving: the step is incomplete. */
  error?: string;
  /** Saving works, but training will complain about it. */
  warnings: string[];
}

export interface KnownNames {
  intents: Set<string>;
  actions: Set<string>;
  slots: Set<string>;
  entities: Set<string>;
}

const hasEmptyName = (pairs: Pair[]) => pairs.some((pair) => !pair.name.trim());

/**
 * Mirrors the backend's training validator so problems show up here, next to
 * the step, instead of only when training. A list that failed to load is
 * empty, and then its names are not checked.
 */
export function checkStep(step: Step, known: KnownNames): StepProblem {
  const warnings: string[] = [];
  const unknown = (set: Set<string>, name: string, message: string) => {
    if (set.size && name && !set.has(name)) warnings.push(message);
  };

  switch (stepKind(step)) {
    case "user": {
      const intent = String(step.intent ?? "").trim();
      const entities = toPairs(step.entities);
      unknown(known.intents, intent, `Ý định "${intent}" chưa được khai báo`);
      entities.forEach(({ name }) =>
        unknown(known.entities, name, `Thực thể "${name}" chưa được khai báo`)
      );
      if (!intent) return { error: "Chưa chọn ý định", warnings };
      if (hasEmptyName(entities)) {
        return { error: "Có thực thể chưa chọn tên", warnings };
      }
      return { warnings };
    }
    case "bot": {
      const action = String(step.action ?? "").trim();
      unknown(
        known.actions,
        action,
        `Phản hồi "${action}" không tồn tại (chưa có phản hồi hoặc action tương ứng)`
      );
      return action ? { warnings } : { error: "Chưa chọn phản hồi", warnings };
    }
    case "slot": {
      const slots = toPairs(step.slot_was_set);
      slots.forEach(({ name }) =>
        unknown(known.slots, name, `Slot "${name}" chưa được khai báo`)
      );
      if (!slots.length) return { error: "Chưa có slot nào", warnings };
      if (hasEmptyName(slots)) {
        return { error: "Có slot chưa chọn tên", warnings };
      }
      return { warnings };
    }
    default:
      return isEmptyStep(step)
        ? { error: "Bước rỗng, nên xoá: Rasa sẽ báo lỗi khi train", warnings }
        : { warnings };
  }
}
