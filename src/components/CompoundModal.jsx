import { Modal } from "antd";
import { createContext, useContext, useState } from "react";
import { MdClose } from "react-icons/md";

const ModalContext = createContext();

function CompoundModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function ModalTrigger({ render }) {
  const { openModal } = useModal();
  return render(openModal);
}

function ModalContent({ children, render, ...rest }) {
  const { isOpen, closeModal, openModal } = useModal();
  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      closeIcon={<MdClose className="text-2xl" />}
      classNames={{ content: "!bg-[var(--background-color)]" }}
      {...rest}
    >
      {typeof render === "function"
        ? render(closeModal, openModal, isOpen)
        : children}
    </Modal>
  );
}

function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a CompoundModal");
  }
  return context;
}

CompoundModal.Trigger = ModalTrigger;
CompoundModal.Content = ModalContent;

export { CompoundModal, useModal };
