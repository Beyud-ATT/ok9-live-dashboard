import { Typography } from "antd";

export default function SectionHeader({ title }) {
  return (
    <div className="quick-access-header">
      <Typography.Title
        level={5}
        className="!text-[var(--color-brand-primary)] bg-[var(--background-shader-3)] h-[48px] px-4 flex justify-start items-center"
      >
        {title}
      </Typography.Title>
    </div>
  );
}
