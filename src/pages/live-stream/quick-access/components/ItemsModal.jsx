import { MdClose } from "react-icons/md";
import { CompoundModal } from "../../../../components/CompoundModal";
import { Typography } from "antd";

export default function ItemsModal({ icon, label, render, enable }) {
  return (
    <>
      <CompoundModal>
        <CompoundModal.Trigger
          render={(openModal) => (
            <div
              className={`quick-access-item flex flex-col justify-between rounded-2xl m-4 p-4
            h-[110px] ${
              enable
                ? "bg-[var(--color-brand-primary)] text-white cursor-pointer"
                : "bg-[var(--background-shader-2)] text-[#505050] cursor-not-allowed"
            } `}
              onClick={openModal}
            >
              <div className="quick-access-item-icon">{icon}</div>
              <div className="quick-access-item-label text-lg font-[700]">
                {label}
              </div>
            </div>
          )}
        />
        <CompoundModal.Content
          classNames={{
            content: " !bg-[var(--background-shader-2)]",
          }}
          centered
          closeIcon={<MdClose className="text-2xl text-white" />}
          title={
            <Typography.Title
              level={3}
              className="!text-[var(--color-brand-primary)] bg-[var(--background-shader-2)] h-[50px] px-4 flex justify-start items-center"
            >
              {label}
            </Typography.Title>
          }
          render={(closeModal, openModal, isOpen) => (
            <div className="mt-4">{render(closeModal, openModal, isOpen)}</div>
          )}
        />
      </CompoundModal>
    </>
  );
}
