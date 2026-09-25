import { Typography } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { IntentOption } from "../../services/intentServices";

/** Lowercase without Vietnamese diacritics, so "hoi ten" finds "Hỏi tên". */
function searchKey(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

/** "Hỏi tên của bot (ask_bot_name)", or just the code when it has no name. */
export function describeIntent(name: string, label?: string): string {
  return label ? `${label} (${name})` : name;
}

/**
 * Props for an antd Select of intents: each option shows the Vietnamese name
 * with the code beside it, and search matches either, accent-insensitively.
 */
export function intentSelectProps(intents: IntentOption[]) {
  return {
    showSearch: true,
    optionLabelProp: "selected",
    options: intents.map(({ name, label }) => ({
      value: name,
      selected: describeIntent(name, label),
      search: searchKey(`${label ?? ""} ${name}`),
      label: (
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ flex: 1, whiteSpace: "normal" }}>{label ?? name}</span>
          {label && <Typography.Text type="secondary">{name}</Typography.Text>}
        </div>
      ),
    })),
    filterOption: (input: string, option?: DefaultOptionType) =>
      String(option?.search ?? "").includes(searchKey(input.trim())),
  };
}
