import {
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  HolderOutlined,
  MoreOutlined,
  PlusOutlined,
  RobotOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Empty, Select, Space, Typography } from "antd";
import { MenuProps } from "antd/es/menu";
import { DefaultOptionType } from "antd/es/select";
import { ReactNode, useMemo, useState } from "react";
import ReactDragListView from "react-drag-listview";
import {
  ActionOption,
  ActionSource,
  EntityOption,
  SlotOption,
} from "../../../services/dialogueOptionsService";
import { IntentOption } from "../../../services/intentServices";
import { intentSelectProps, searchKey } from "../../components/intentSelect";
import {
  KnownNames,
  STEP_LABELS,
  Step,
  StepItem,
  StepKind,
  checkStep,
  isEmptyStep,
  makeItem,
  newStep,
  stepKind,
  toPairs,
  fromPairs,
  withEntities,
} from "../steps";
import PairList from "./PairList";

export interface EditorOptions {
  intents: IntentOption[];
  actions: ActionOption[];
  slots: SlotOption[];
  entities: EntityOption[];
}

type AddableKind = Exclude<StepKind, "other">;

const KIND_ICONS: Record<StepKind, ReactNode> = {
  user: <UserOutlined />,
  bot: <RobotOutlined />,
  slot: <DatabaseOutlined />,
  other: <CodeOutlined />,
};

const ADDABLE: AddableKind[] = ["user", "bot", "slot"];

const SOURCE_LABELS: Record<ActionSource, string> = {
  response: "Phản hồi",
  custom: "Action tuỳ chỉnh",
  default: "Mặc định của Rasa",
};

/** A user turn is usually answered by the bot, and the other way round. */
function suggestedKind(items: StepItem[]): AddableKind {
  const last = items[items.length - 1];
  return last && stepKind(last.step) === "user" ? "bot" : "user";
}

function actionSelectProps(actions: ActionOption[]) {
  const groups = (Object.keys(SOURCE_LABELS) as ActionSource[])
    .map((source) => ({
      label: SOURCE_LABELS[source],
      options: actions
        .filter((action) => action.source === source)
        .map(({ name, preview }) => ({
          value: name,
          search: searchKey(`${name} ${preview ?? ""}`),
          label: (
            <div className="story-option">
              <span>{name}</span>
              {preview && (
                <Typography.Text type="secondary" ellipsis>
                  {preview}
                </Typography.Text>
              )}
            </div>
          ),
        })),
    }))
    .filter((group) => group.options.length);

  return {
    showSearch: true,
    optionLabelProp: "value",
    options: groups,
    filterOption: (input: string, option?: DefaultOptionType) =>
      String(option?.search ?? "").includes(searchKey(input.trim())),
  };
}

interface StepCardProps {
  item: StepItem;
  index: number;
  count: number;
  options: EditorOptions;
  known: KnownNames;
  readOnly: boolean;
  showErrors: boolean;
  autoFocus: boolean;
  onChange: (step: Step) => void;
  onInsert: (kind: AddableKind) => void;
  onMove: (to: number) => void;
  onRemove: () => void;
}

const StepCard = ({
  item,
  index,
  count,
  options,
  known,
  readOnly,
  showErrors,
  autoFocus,
  onChange,
  onInsert,
  onMove,
  onRemove,
}: StepCardProps) => {
  const { step } = item;
  const kind = stepKind(step);
  const problem = checkStep(step, known);
  const intentProps = useMemo(
    () => intentSelectProps(options.intents),
    [options.intents]
  );
  const actionProps = useMemo(
    () => actionSelectProps(options.actions),
    [options.actions]
  );

  const menu: MenuProps = {
    items: [
      {
        key: "insert",
        label: "Chèn bước bên dưới",
        icon: <PlusOutlined />,
        children: ADDABLE.map((addable) => ({
          key: `insert-${addable}`,
          label: STEP_LABELS[addable],
          icon: KIND_ICONS[addable],
        })),
      },
      { key: "up", label: "Chuyển lên", disabled: index === 0 },
      { key: "down", label: "Chuyển xuống", disabled: index === count - 1 },
      { type: "divider" },
      { key: "remove", label: "Xoá bước", icon: <DeleteOutlined />, danger: true },
    ],
    onClick: ({ key }) => {
      if (key.startsWith("insert-")) onInsert(key.slice(7) as AddableKind);
      if (key === "up") onMove(index - 1);
      if (key === "down") onMove(index + 1);
      if (key === "remove") onRemove();
    },
  };

  const action = kind === "bot" ? String(step.action ?? "") : "";
  const preview = options.actions.find((option) => option.name === action)
    ?.preview;
  const extraKeys = Object.keys(step).join(", ");
  const empty = isEmptyStep(step);

  return (
    <li
      id={stepElementId(item.key)}
      tabIndex={-1}
      className={`story-step story-step--${kind}`}
    >
      <div className="story-step__header">
        {!readOnly && (
          <span className="story-step__handle" title="Kéo để đổi thứ tự">
            <HolderOutlined />
          </span>
        )}
        <span className="story-step__icon">{KIND_ICONS[kind]}</span>
        <span className="story-step__title">
          {empty ? "Bước rỗng" : STEP_LABELS[kind]}
          {kind === "other" && !empty && (
            <Typography.Text type="secondary"> · {extraKeys}</Typography.Text>
          )}
        </span>
        <Typography.Text type="secondary" className="story-step__number">
          Bước {index + 1}
        </Typography.Text>
        {!readOnly && (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              aria-label={`Thao tác với bước ${index + 1}`}
            />
          </Dropdown>
        )}
      </div>

      <div className="story-step__body">
        {kind === "user" && (
          <>
            <Select
              {...intentProps}
              className="story-step__select"
              placeholder="Chọn ý định người dùng"
              aria-label={`Ý định ở bước ${index + 1}`}
              status={showErrors && !step.intent ? "error" : undefined}
              disabled={readOnly}
              autoFocus={autoFocus}
              defaultOpen={autoFocus}
              value={(step.intent as string) || undefined}
              onChange={(intent) => onChange({ ...step, intent })}
            />
            <PairList
              pairs={toPairs(step.entities)}
              onChange={(pairs) => onChange(withEntities(step, pairs))}
              names={options.entities.map(({ name, description }) => ({
                name,
                hint: description,
              }))}
              namePlaceholder="Thực thể"
              addLabel="Kèm thực thể"
              readOnly={readOnly}
              showErrors={showErrors}
            />
          </>
        )}

        {kind === "bot" && (
          <>
            <Select
              {...actionProps}
              className="story-step__select"
              placeholder="Chọn phản hồi của bot"
              aria-label={`Phản hồi ở bước ${index + 1}`}
              status={showErrors && !action ? "error" : undefined}
              disabled={readOnly}
              autoFocus={autoFocus}
              defaultOpen={autoFocus}
              value={action || undefined}
              onChange={(next) => onChange({ ...step, action: next })}
            />
            {preview && <div className="story-step__preview">{preview}</div>}
          </>
        )}

        {kind === "slot" && (
          <PairList
            pairs={toPairs(step.slot_was_set)}
            onChange={(pairs) =>
              onChange({ ...step, slot_was_set: fromPairs(pairs) })
            }
            names={options.slots.map(({ name, type }) => ({
              name,
              hint: type,
              type,
            }))}
            namePlaceholder="Slot"
            addLabel="Thêm slot"
            readOnly={readOnly}
            showErrors={showErrors}
            autoFocus={autoFocus}
          />
        )}

        {kind === "other" && (
          empty ? (
            <Typography.Text type="secondary">
              Bước này không có nội dung, thường do trình soạn cũ làm mất dữ
              liệu. Hãy xoá nó (menu ⋮) và thêm lại bước đúng nếu cần.
            </Typography.Text>
          ) : (
            <>
              <pre className="story-step__raw">{JSON.stringify(step, null, 2)}</pre>
              <Typography.Text type="secondary">
                Loại bước này chưa sửa được ở đây. Khi lưu, bước được giữ nguyên.
              </Typography.Text>
            </>
          )
        )}

        {(showErrors || empty) && problem.error && (
          <Typography.Text type="danger" className="story-step__message">
            {problem.error}
          </Typography.Text>
        )}
        {problem.warnings.map((warning) => (
          <Typography.Text
            type="warning"
            className="story-step__message"
            key={warning}
          >
            <WarningOutlined /> {warning}
          </Typography.Text>
        ))}
      </div>
    </li>
  );
};

interface StepsEditorProps {
  items: StepItem[];
  onChange: (items: StepItem[]) => void;
  options: EditorOptions;
  known: KnownNames;
  readOnly: boolean;
  /** Show what blocks saving; off until the first save attempt. */
  showErrors: boolean;
}

export const stepElementId = (key: string) => `story-step-${key}`;

/** A story's steps as a conversation: who speaks, in order. */
const StepsEditor = ({
  items,
  onChange,
  options,
  known,
  readOnly,
  showErrors,
}: StepsEditorProps) => {
  // The step just added gets focus so it can be filled in straight away.
  const [focusKey, setFocusKey] = useState<string>();

  const insert = (at: number, kind: AddableKind) => {
    const item = makeItem(newStep(kind));
    setFocusKey(item.key);
    onChange([...items.slice(0, at), item, ...items.slice(at)]);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange(next);
  };

  const suggested = suggestedKind(items);

  return (
    <div className="story-steps">
      {items.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Story chưa có bước nào. Thường bắt đầu bằng câu người dùng nói."
        />
      ) : (
        <ReactDragListView
          onDragEnd={move}
          nodeSelector="li.story-step"
          handleSelector=".story-step__handle"
          lineClassName="story-step__drop-line"
        >
          <ol className="story-steps__list">
            {items.map((item, index) => (
              <StepCard
                key={item.key}
                item={item}
                index={index}
                count={items.length}
                options={options}
                known={known}
                readOnly={readOnly}
                showErrors={showErrors}
                autoFocus={item.key === focusKey}
                onChange={(step) =>
                  onChange(
                    items.map((other) =>
                      other.key === item.key ? { ...other, step } : other
                    )
                  )
                }
                onInsert={(kind) => insert(index + 1, kind)}
                onMove={(to) => move(index, to)}
                onRemove={() =>
                  onChange(items.filter((other) => other.key !== item.key))
                }
              />
            ))}
          </ol>
        </ReactDragListView>
      )}

      {!readOnly && (
        <Space wrap className="story-steps__add">
          <Typography.Text type="secondary">Thêm bước:</Typography.Text>
          {ADDABLE.map((kind) => (
            <Button
              key={kind}
              icon={KIND_ICONS[kind]}
              type={kind === suggested ? "primary" : "default"}
              ghost={kind === suggested}
              onClick={() => insert(items.length, kind)}
            >
              {STEP_LABELS[kind]}
            </Button>
          ))}
        </Space>
      )}
    </div>
  );
};

export default StepsEditor;
