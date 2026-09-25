import { Button, Checkbox, Col, Row, Space, Tag, Tooltip, Typography, theme } from "antd";
import { CSSProperties } from "react";
import { PermissionModule } from "../../../services/groupService";

type Props = {
  catalog: PermissionModule[];
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
};

/**
 * Chọn quyền theo từng module: mỗi module là một thẻ, tick tiêu đề thẻ để
 * chọn/bỏ cả module. Quyền đầu tiên (Xem) bị khoá khi đã chọn quyền khác của
 * module, vì các quyền khác đều cần nó.
 */
const PermissionPicker = ({ catalog, value = [], onChange, disabled }: Props) => {
  const { token } = theme.useToken();
  const selected = new Set(value);
  const allKeys = catalog.flatMap((group) => group.permissions.map((p) => p.key));
  const selectedCount = allKeys.filter((key) => selected.has(key)).length;

  const update = (add: string[], remove: string[]) => {
    const next = new Set(value);
    remove.forEach((key) => next.delete(key));
    add.forEach((key) => next.add(key));
    onChange?.([...next]);
  };

  const cardStyle = (active: boolean): CSSProperties => ({
    height: "100%",
    padding: "12px 14px",
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${active ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
    background: active ? token.colorPrimaryBg : token.colorBgContainer,
    transition: "background 0.2s, border-color 0.2s",
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Typography.Text type="secondary">
          Đã chọn{" "}
          <Typography.Text strong>
            {selectedCount}/{allKeys.length}
          </Typography.Text>{" "}
          quyền
        </Typography.Text>
        {!disabled && (
          <Space size={4}>
            <Button
              size="small"
              type="link"
              disabled={selectedCount === allKeys.length}
              onClick={() => update(allKeys, [])}
            >
              Chọn tất cả
            </Button>
            <Button
              size="small"
              type="link"
              disabled={selectedCount === 0}
              onClick={() => update([], allKeys)}
            >
              Bỏ chọn tất cả
            </Button>
          </Space>
        )}
      </div>

      <Row gutter={[12, 12]}>
        {catalog.map((group) => {
          const keys = group.permissions.map((p) => p.key);
          const count = keys.filter((key) => selected.has(key)).length;
          const all = count === keys.length;
          const baseLocked = keys.slice(1).some((key) => selected.has(key));

          return (
            <Col xs={24} md={12} key={group.module}>
              <div style={cardStyle(count > 0)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <Checkbox
                    checked={all}
                    indeterminate={count > 0 && !all}
                    disabled={disabled}
                    onChange={(e) =>
                      e.target.checked ? update(keys, []) : update([], keys)
                    }
                  >
                    <Typography.Text strong>{group.label}</Typography.Text>
                  </Checkbox>
                  <Tag
                    bordered={false}
                    color={count > 0 ? "processing" : "default"}
                    style={{ marginInlineStart: "auto", marginInlineEnd: 0 }}
                  >
                    {count}/{keys.length}
                  </Tag>
                </div>
                {group.description && (
                  <Typography.Paragraph
                    type="secondary"
                    style={{ fontSize: token.fontSizeSM, margin: "4px 0 10px 24px" }}
                  >
                    {group.description}
                  </Typography.Paragraph>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 16px",
                    paddingTop: 10,
                    marginInlineStart: 24,
                    borderTop: `1px dashed ${token.colorBorderSecondary}`,
                  }}
                >
                  {group.permissions.map((permission, index) => {
                    const locked = index === 0 && baseLocked;
                    const box = (
                      <Checkbox
                        key={permission.key}
                        checked={selected.has(permission.key)}
                        disabled={disabled || locked}
                        onChange={(e) =>
                          e.target.checked
                            ? update([permission.key], [])
                            : update([], [permission.key])
                        }
                      >
                        {permission.label}
                      </Checkbox>
                    );
                    return locked ? (
                      <Tooltip
                        key={permission.key}
                        title="Bắt buộc khi đã chọn quyền khác của module này"
                      >
                        <span>{box}</span>
                      </Tooltip>
                    ) : (
                      box
                    );
                  })}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default PermissionPicker;
