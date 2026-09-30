import { Button, Result } from "antd";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCan } from "../../lib/auth";

type Props = { permission: string; children: ReactNode };

/**
 * Trang ẩn khỏi menu vẫn vào được bằng URL: không có quyền thì hiện 403 thay
 * vì mở trang rồi để các API trả lỗi. Backend vẫn là nơi chặn thật.
 */
const RequirePermission = ({ permission, children }: Props) => {
  const can = useCan();
  const navigate = useNavigate();
  if (can(permission)) return <>{children}</>;
  return (
    <Result
      status="403"
      title="Không có quyền truy cập"
      subTitle="Tài khoản của bạn không có quyền xem trang này. Liên hệ quản trị viên nếu cần."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      }
    />
  );
};

export default RequirePermission;
