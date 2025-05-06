import { Steps, Input, Button, Image } from "antd";
import { useState } from "react";
import { useModal } from "../../../../components/CompoundModal";
import Step3 from "../../../../assets/step-3.png";
import Step4 from "../../../../assets/step-4.png";
import { toast } from "react-toastify";

const ChatBoxContent = () => {
  const [current, setCurrent] = useState(0);
  const { closeModal } = useModal();
  const urlValue = `https://f8bet-live.pages.dev/chat-box/${localStorage.getItem(
    "userCode"
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(urlValue);
    toast.success("Sao chép thành công!");
  };

  const steps = [
    {
      title: <span className="text-white">Copy URL</span>,
      description: (
        <div className="flex items-center gap-2 p-4">
          <Input
            value={urlValue}
            className="!bg-[var(--background-shader-2)] !text-white !border-[var(--color-brand-primary)] focus:!!border-[var(--color-brand-primary)] hover:!!border-[var(--color-brand-primary)]"
            readOnly
          />
          <Button
            className="!bg-[var(--color-brand-primary)] !border-none"
            onClick={handleCopy}
          >
            <span className="text-white">Sao chép</span>
          </Button>
        </div>
      ),
    },
    {
      title: (
        <span className="text-white">Mở công cụ phát Nimo PC hoặc OBS</span>
      ),
    },
    {
      title: (
        <span className="text-white">
          Nguồn thêm ở <span className="font-bold italic">Tìm kiếm</span>
        </span>
      ),
      description: (
        <div className="p-6">
          <Image src={Step3} alt="step-3" preview={false} loading="lazy" />
        </div>
      ),
    },
    {
      title: (
        <span className="text-white">
          Copy URL vào tìm kiếm của trình duyệt
        </span>
      ),
      description: (
        <div className="p-6">
          <Image src={Step4} alt="step-4" preview={false} loading="lazy" />
        </div>
      ),
    },
  ];

  return (
    <div className="text-white p-6 rounded-lg">
      <Steps
        direction="vertical"
        current={current}
        items={steps}
        className="custom-steps"
        onChange={setCurrent}
      />
      <div className="mt-6 flex justify-center">
        <Button
          className="!bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] !border-none"
          onClick={() => {
            setCurrent(steps.length - 1);
            setTimeout(() => {
              closeModal();
              setCurrent(0);
            }, 1000);
          }}
        >
          <span className="text-white">Hoàn thành và bắt đầu live stream</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatBoxContent;
