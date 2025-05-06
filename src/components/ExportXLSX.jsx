import { Button, Form, Input } from "antd";
import { downloadExcel } from "../utils/helper";
import { CompoundModal, useModal } from "./CompoundModal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

const PasswordModal = ({ exportExcel }) => {
  const { closeModal } = useModal();
  const handleSubmit = (values) => {
    if (values?.secretKey !== import.meta.env.VITE_SECRET_KEY) {
      toast.error("Mật khẩu sai !!! Chà chà bạn đang định làm gì ????");
      return;
    }

    if (exportExcel && typeof exportExcel === "function") exportExcel();

    closeModal();
  };

  return (
    <Form className="w-full !mt-7" onFinish={handleSubmit}>
      <Form.Item name="secretKey">
        <Input placeholder="Mật khẩu bí mật!!!" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          className="!bg-[var(--color-brand-primary)]"
          htmlType="submit"
        >
          Xuất file
        </Button>
      </Form.Item>
    </Form>
  );
};

const ExportExcel = ({ data, label, fileName, hidden = true }) => {
  const downloadExcelFunc = () => {
    downloadExcel({
      header: ["Tên hiển thị", "Tin nhắn", "Nhắn lúc"],
      data,
      fileName,
      hidden,
    });
  };

  return (
    <>
      {hidden && (
        <Button
          type="primary"
          className="!bg-[var(--color-brand-primary)]"
          htmlType="button"
          onClick={downloadExcelFunc}
        >
          {label}
        </Button>
      )}

      {!hidden && (
        <CompoundModal>
          <CompoundModal.Trigger
            render={(openModal) => (
              <Button
                type="primary"
                className="!bg-[var(--color-brand-primary)]"
                htmlType="button"
                onClick={openModal}
              >
                {label}
              </Button>
            )}
          />
          <CompoundModal.Content
            className="w-full !p-0 rounded-4xl border-2 border-[var(--color-brand-primary)] bg-black/80"
            footer={null}
            closeIcon={
              <MdClose className="text-2xl text-[var(--color-brand-primary)]" />
            }
          >
            <PasswordModal exportExcel={downloadExcelFunc} />
          </CompoundModal.Content>
        </CompoundModal>
      )}
    </>
  );
};

export default ExportExcel;
