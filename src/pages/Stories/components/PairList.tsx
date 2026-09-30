import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Select, Typography } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { Pair } from "../steps";
import { searchKey } from "../../components/intentSelect";

export interface NameOption {
  name: string;
  hint?: string;
  /** Slot type; decides which input the value gets. */
  type?: string;
}

interface PairListProps {
  pairs: Pair[];
  onChange: (pairs: Pair[]) => void;
  names: NameOption[];
  namePlaceholder: string;
  addLabel: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  /** Mark rows without a name, once a save was tried. */
  showErrors?: boolean;
}

const isPrimitive = (value: unknown) =>
  value === undefined || ["string", "number", "boolean"].includes(typeof value);

const ValueInput = ({
  value,
  type,
  disabled,
  onChange,
}: {
  value: unknown;
  type?: string;
  disabled?: boolean;
  onChange: (value: unknown) => void;
}) => {
  // Lists, objects and null cannot be typed here; show them and keep them.
  if (!isPrimitive(value)) {
    return (
      <Typography.Text code className="story-pair__fixed">
        {JSON.stringify(value)}
      </Typography.Text>
    );
  }
  if (type === "bool") {
    return (
      <Select
        className="story-pair__value"
        placeholder="Giá trị"
        allowClear
        disabled={disabled}
        value={value as boolean | undefined}
        onChange={(next) => onChange(next)}
        options={[
          { value: true, label: "true" },
          { value: false, label: "false" },
        ]}
      />
    );
  }
  if (type === "float") {
    return (
      <InputNumber
        className="story-pair__value"
        placeholder="Giá trị"
        disabled={disabled}
        value={typeof value === "number" ? value : undefined}
        onChange={(next) => onChange(next ?? undefined)}
      />
    );
  }
  return (
    <Input
      className="story-pair__value"
      placeholder="Giá trị (không bắt buộc)"
      disabled={disabled}
      value={value === undefined ? "" : String(value)}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

/** Rows of `name: value` for a step's entities or slots. */
const PairList = ({
  pairs,
  onChange,
  names,
  namePlaceholder,
  addLabel,
  readOnly,
  autoFocus,
  showErrors,
}: PairListProps) => {
  const update = (index: number, change: Partial<Pair>) =>
    onChange(pairs.map((pair, i) => (i === index ? { ...pair, ...change } : pair)));

  const options = names.map(({ name, hint }) => ({
    value: name,
    search: searchKey(`${name} ${hint ?? ""}`),
    label: (
      <div className="story-option">
        <span>{name}</span>
        {hint && <Typography.Text type="secondary">{hint}</Typography.Text>}
      </div>
    ),
  }));

  return (
    <div className="story-pairs">
      {pairs.map((pair, index) => (
        <div className="story-pair" key={index}>
          <Select
            className="story-pair__name"
            showSearch
            placeholder={namePlaceholder}
            aria-label={`${namePlaceholder} ${index + 1}`}
            status={showErrors && !pair.name.trim() ? "error" : undefined}
            disabled={readOnly}
            autoFocus={autoFocus && index === 0}
            value={pair.name || undefined}
            onChange={(name) => update(index, { name })}
            options={options}
            optionLabelProp="value"
            filterOption={(input, option?: DefaultOptionType) =>
              String(option?.search ?? "").includes(searchKey(input.trim()))
            }
          />
          <ValueInput
            value={pair.value}
            type={names.find((option) => option.name === pair.name)?.type}
            disabled={readOnly}
            onChange={(value) => update(index, { value })}
          />
          {!readOnly && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              aria-label="Bỏ dòng này"
              onClick={() => onChange(pairs.filter((_, i) => i !== index))}
            />
          )}
        </div>
      ))}
      {!readOnly && (
        <Button
          type="link"
          size="small"
          icon={<PlusOutlined />}
          className="story-pairs__add"
          onClick={() => onChange([...pairs, { name: "" }])}
        >
          {addLabel}
        </Button>
      )}
    </div>
  );
};

export default PairList;
