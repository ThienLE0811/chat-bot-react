import { useCan } from "../../../lib/auth";
import { ProCard } from "@ant-design/pro-components";
import {
  ApartmentOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Result,
  Segmented,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { getOneStories } from "../../../services/stories";
import { updateStoriesData } from "../../../redux/slices/stories/action";
import { KnownNames, Step, StepItem, checkStep, toItems } from "../steps";
import { useDialogueOptions } from "../useDialogueOptions";
import StoryFlow from "../flow/StoryFlow";
import StepsEditor, { stepElementId } from "./StepsEditor";

interface DetailStoriesProps {
  initData: { _id: string; story?: string };
  /** Asks to close; the page confirms first when there are unsaved changes. */
  onClose: () => void;
  onDirtyChange: (dirty: boolean) => void;
}

type View = "edit" | "flow";

// Incomplete steps are errors whatever names exist.
const NO_NAMES: KnownNames = {
  intents: new Set(),
  actions: new Set(),
  slots: new Set(),
  entities: new Set(),
};

const sameSteps = (a: Step[], b: Step[]) =>
  JSON.stringify(a) === JSON.stringify(b);

const DetailStories = ({ initData, onClose, onDirtyChange }: DetailStoriesProps) => {
  const canWrite = useCan()("dialogue.write");
  const dispatch = useAppDispatch();
  const { options, known, errors: optionErrors } = useDialogueOptions();
  const [saved, setSaved] = useState<Step[]>();
  const [items, setItems] = useState<StepItem[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [view, setView] = useState<View>("edit");
  // Step picked on the diagram, to show in the editor once it is rendered.
  const [jumpTo, setJumpTo] = useState<string>();

  const load = useCallback(async () => {
    setLoadFailed(false);
    setSaved(undefined);
    try {
      const res = await getOneStories(initData._id);
      const steps: Step[] = Array.isArray(res?.data?.steps) ? res.data.steps : [];
      setSaved(steps);
      setItems(toItems(steps));
      setShowErrors(false);
    } catch {
      // getOneStories already told the user.
      setLoadFailed(true);
    }
  }, [initData._id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (view !== "edit" || !jumpTo) return;
    const element = document.getElementById(stepElementId(jumpTo));
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus({ preventScroll: true });
    element?.classList.add("story-step--flash");
    const timer = window.setTimeout(() => setJumpTo(undefined), 1500);
    return () => {
      window.clearTimeout(timer);
      element?.classList.remove("story-step--flash");
    };
  }, [view, jumpTo]);

  const steps = useMemo(() => items.map((item) => item.step), [items]);
  const dirty = saved !== undefined && !sameSteps(steps, saved);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async () => {
    const incomplete = steps.findIndex((step) => checkStep(step, NO_NAMES).error);
    if (incomplete >= 0) {
      setShowErrors(true);
      setView("edit");
      setJumpTo(items[incomplete].key);
      message.error(`Bước ${incomplete + 1} chưa điền đủ, xem các ô đánh dấu đỏ`);
      return;
    }
    setSaving(true);
    const res = await dispatch(
      updateStoriesData({ id: initData._id, data: { steps } })
    );
    setSaving(false);
    // updateStoriesData shows the success or failure notification.
    if (res.meta.requestStatus === "fulfilled") {
      setSaved(steps);
      setShowErrors(false);
    }
  };

  const discard = () => {
    if (!saved) return;
    setItems(toItems(saved));
    setShowErrors(false);
  };

  return (
    <ProCard
      title={`Story: ${initData.story ?? ""}`}
      className="story-detail"
      headerBordered
      extra={
        <Space>
          {dirty && <Tag color="orange">Chưa lưu</Tag>}
          {canWrite && (
            <>
              <Button
                size="small"
                icon={<UndoOutlined />}
                disabled={!dirty || saving}
                onClick={discard}
              >
                Huỷ thay đổi
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                disabled={!dirty}
                loading={saving}
                onClick={save}
              >
                Lưu
              </Button>
            </>
          )}
          <Button size="small" icon={<CloseOutlined />} onClick={onClose}>
            Đóng
          </Button>
        </Space>
      }
    >
      {optionErrors.length > 0 && (
        <Alert
          type="warning"
          showIcon
          className="story-detail__alert"
          message={`${optionErrors.join(", ")}. Các ô chọn tương ứng sẽ thiếu gợi ý.`}
        />
      )}
      {loadFailed ? (
        <Result
          status="error"
          title="Không tải được story"
          extra={<Button onClick={load}>Thử lại</Button>}
        />
      ) : saved === undefined ? (
        <div className="story-detail__loading">
          <Spin />
        </div>
      ) : (
        <>
          <Segmented<View>
            className="story-detail__view"
            value={view}
            onChange={setView}
            options={[
              { value: "edit", label: "Soạn thảo", icon: <EditOutlined /> },
              { value: "flow", label: "Sơ đồ", icon: <ApartmentOutlined /> },
            ]}
          />
          {view === "edit" ? (
            <StepsEditor
              items={items}
              onChange={setItems}
              options={options}
              known={known}
              readOnly={!canWrite}
              showErrors={showErrors}
            />
          ) : (
            <StoryFlow
              items={items}
              options={options}
              known={known}
              onSelectStep={(key) => {
                setJumpTo(key);
                setView("edit");
              }}
            />
          )}
        </>
      )}
    </ProCard>
  );
};

export default DetailStories;
