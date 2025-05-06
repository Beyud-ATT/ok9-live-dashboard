import { Col, Row } from "antd";
import QuickAccess from "./quick-access/Index";
import Live from "./live/Index";
import ChatFeed from "./chat/Index";

export default function LiveStream() {
  return (
    <div className="w-full h-full">
      <Row gutter={[8, 8]} className="h-full">
        <Col span={4}>
          <QuickAccess />
        </Col>
        <Col span={14}>
          <Live />
        </Col>
        <Col span={6} className="h-full overflow-auto">
          <ChatFeed />
        </Col>
      </Row>
    </div>
  );
}
