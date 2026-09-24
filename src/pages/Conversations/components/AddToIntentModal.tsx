import { Alert, Modal, Select, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import {
  ConversationMessage,
  addMessageToIntent,
} from "../../../services/conversationsService";
import { FALLBACK_INTENT } from "../../components/IntentConfidence";

interface Props {
  message: ConversationMessage | null;
  intents: string[];
  onClose: () => void;
  onAdded: (message: ConversationMessage, intent: string) => void;
}

/** Adds a user message to the examples of the intent it should have matched. */
const AddToIntentModal = ({ message, intents, onClose, onAdded }: Props) => {
  const [intent, setIntent] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

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
      notification.success({
        message: result.alreadyExisted
          ? `"${result.text}" đã có sẵn trong ý định ${result.intent}`
          : `Đã thêm "${result.text}" vào ý định ${result.intent}`,
        description: "Train lại model để bot học câu này.",
      });
      onAdded(message, intent);
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

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
      {message?.intent && (
        <Typography.Paragraph type="secondary">
          Bot đã hiểu là {message.intent.name}. Chọn ý định đúng của câu này:
        </Typography.Paragraph>
      )}
      <Select
        showSearch
        autoFocus
        style={{ width: "100%" }}
        placeholder="Chọn ý định"
        value={intent}
        onChange={setIntent}
        options={intents.map((name) => ({ label: name, value: name }))}
      />
      {error && (
        <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />
      )}
    </Modal>
  );
};

export default AddToIntentModal;
