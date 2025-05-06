import { Typography } from "antd";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex justify-center items-center">
        <Typography.Title
          level={1}
          className="!text-[var(--color-brand-primary)]"
        >
          Các chức năng khác đăng được phát triển
        </Typography.Title>
      </div>
    </div>
  );
}
