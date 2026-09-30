import axios from "axios";
import { API_URL } from "./trainService";

export type ActionSource = "response" | "custom" | "default";

export interface ActionOption {
  name: string;
  source: ActionSource;
  /** First text of a response, so people see what the bot will say. */
  preview?: string;
}

export interface SlotOption {
  name: string;
  /** Rasa slot type: text, bool, categorical, float, list or any. */
  type?: string;
}

export interface EntityOption {
  name: string;
  description?: string;
}

/** Actions Rasa ships with; the training validator accepts them too. */
const DEFAULT_ACTIONS = [
  "action_listen",
  "action_restart",
  "action_session_start",
  "action_default_fallback",
  "action_deactivate_loop",
  "action_revert_fallback_events",
  "action_default_ask_affirmation",
  "action_default_ask_rephrase",
  "action_two_stage_fallback",
  "action_unlikely_intent",
  "action_back",
  "action_extract_slots",
];

async function list<T>(path: string, what: string): Promise<T[]> {
  try {
    const { data } = await axios.get<T[]>(`${API_URL}${path}`);
    return Array.isArray(data) ? data : [];
  } catch {
    throw new Error(`Không tải được danh sách ${what}`);
  }
}

function firstText(data: unknown): string | undefined {
  if (!Array.isArray(data)) return undefined;
  const text = data.find((item) => typeof item?.text === "string")?.text;
  return text?.trim() || undefined;
}

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

/** Responses, then custom actions, then Rasa's defaults. Throws on failure. */
const getActionOptions = async (): Promise<ActionOption[]> => {
  const [responses, actions] = await Promise.all([
    list<{ title?: string; data?: unknown }>("/responses/getList", "phản hồi"),
    list<{ action?: string }>("/actions/getList", "action"),
  ]);
  const options: ActionOption[] = [
    ...responses
      .filter((response) => response.title)
      .map((response) => ({
        name: response.title!,
        source: "response" as const,
        preview: firstText(response.data),
      }))
      .sort(byName),
    ...actions
      .filter((action) => action.action)
      .map((action) => ({ name: action.action!, source: "custom" as const }))
      .sort(byName),
    ...DEFAULT_ACTIONS.map((name) => ({ name, source: "default" as const })),
  ];
  // A name listed twice would be two options with the same value.
  return options.filter(
    (option, index) => options.findIndex((o) => o.name === option.name) === index
  );
};

const getSlotOptions = async (): Promise<SlotOption[]> =>
  (await list<{ nameSlot?: string; type?: string }>("/slots/getList", "slot"))
    .filter((slot) => slot.nameSlot)
    .map((slot) => ({ name: slot.nameSlot!, type: slot.type }))
    .sort(byName);

const getEntityOptions = async (): Promise<EntityOption[]> =>
  (
    await list<{ nameEntities?: string; description?: string }>(
      "/entities/getList",
      "thực thể"
    )
  )
    .filter((entity) => entity.nameEntities)
    .map((entity) => ({
      name: entity.nameEntities!,
      description: entity.description?.trim() || undefined,
    }))
    .sort(byName);

export { getActionOptions, getSlotOptions, getEntityOptions };
