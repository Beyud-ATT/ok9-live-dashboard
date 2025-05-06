import { Table } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const utcOffSet = 7;
const formattedDate = "YYYY-MM-DD HH:mm";

function convertToUTC(date) {
  return dayjs(date).utcOffset(utcOffSet).format(formattedDate);
}

const columns = [
  {
    title: "Tên hiển thị",
    dataIndex: "displayName",
  },
  {
    title: "Nội dung tin nhắn",
    dataIndex: "hiddenMessage",
  },
  {
    title: "Nhắn lúc",
    dataIndex: "createdAt",
    render: (createdAt) => convertToUTC(createdAt),
  },
];

export default function ChatTable({ tableData, loading }) {
  return (
    <div
      id="chat-page"
      className="text-white h-full w-full overflow-hidden mx-auto"
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        scroll={{
          y: 500,
        }}
        rootClassName="bg-[var(--background-shader-3)]"
      />
    </div>
  );
}
