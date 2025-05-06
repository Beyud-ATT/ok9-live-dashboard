import { Form, Input, Typography } from "antd";

export default function GameConfig() {
  return (
    <div className="w-1/3 mx-auto">
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)] text-center mt-6"
      >
        Cài đặt game
      </Typography.Title>
      <Form>
        <Form.Item name="name">
          <Input placeholder="Tên game" />
        </Form.Item>
      </Form>
    </div>
  );
}
