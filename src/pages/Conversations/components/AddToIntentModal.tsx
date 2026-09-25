import { Alert, Modal, Select, Typography, notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  ConversationMessage,
  IntentOption,
  addMessageToIntent,
} from "../../../services/conversationsService";
import { FALLBACK_INTENT } from "../../components/IntentConfidence";

interface Props {
  message: ConversationMessage | null;
  intents: IntentOption[];
  onClose: () => void;
  onAdded: (message: ConversationMessage, intent: string) => void;
}

/** Lowercase without Vietnamese diacritics, so "hoi ten" finds "Hỏi tên". */
function searchKey(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

/** "Hỏi tên của bot (ask_bot_name)", or just the code when it has no name. */
function describe(name: string, label?: string): string {
  return label ? `${label} (${name})` : name;
}

/** Adds a user message to the examples of the intent it should have matched. */
const AddToIntentModal = ({ message, intents, onClose, onAdded }: Props) => {
  const [intent, setIntent] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const labels = useMemo(
    () => new Map(intents.map((option) => [option.name, option.label])),
    [intents]
  );

  const options = useMemo(
    () =>
      intents.map(({ name, label }) => ({
        value: name,
        selected: describe(name, label),
        search: searchKey(`${label ?? ""} ${name}`),
        label: (
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ flex: 1, whiteSpace: "normal" }}>
              {label ?? name}
            </span>
            {label && <Typography.Text type="secondary">{name}</Typography.Text>}
          </div>
        ),
      })),
    [intents]
  );

  useEffect(() => {
    // Suggest what the bot guessed, unless it did not understand at all.
    const guess = message?.intent?.name;
    setIntent(guess && guess !== FALLBACK_INTENT ? guess : undefined);
    setError(undefined);
  }, [message]);

  const save = async () => {
    if (!message || !intent) return;
    setSaving(true);
    setError(undefined);
    try {
      const result = await addMessageToIntent(message._id, intent);
      const target = describe(result.intent, labels.get(result.intent));
      notification.success({
        message: result.alreadyExisted
          ? `"${result.text}" đã có sẵn trong ý định ${target}`
          : `Đã thêm "${result.text}" vào ý định ${target}`,
        description: "Train lại model để bot học câu này.",
      });
      onAdded(message, intent);
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const guess = message?.intent?.name;

  return (
    <Modal
      open={!!message}
      title="Thêm vào câu mẫu của ý định"
      okText="Thêm"
      cancelText="Hủy"
      okButtonProps={{ disabled: !intent }}
      confirmLoading={saving}
      onOk={save}
      onCancel={onClose}
      destroyOnClose
    >
      <Typography.Paragraph>
        Câu người dùng: <Typography.Text strong>{message?.text}</Typography.Text>
      </Typography.Paragraph>
      {guess && (
        <Typography.Paragraph type="secondary">
          Bot đã hiểu là{" "}
          <Typography.Text strong>{labels.get(guess) ?? guess}</Typography.Text>
          {labels.get(guess) && ` (${guess})`}. Chọn ý định đúng của câu này:
        </Typography.Paragraph>
      )}
      <Select
        showSearch
        autoFocus
        style={{ width: "100%" }}
        placeholder="Tìm theo tên tiếng Việt hoặc mã ý định"
        value={intent}
        onChange={setIntent}
        options={options}
        optionLabelProp="selected"
        filterOption={(input, option) =>
          !!option?.search.includes(searchKey(input.trim()))
        }
      />
      {error && (
        <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />
      )}
    </Modal>
  );
};

export default AddToIntentModal;
