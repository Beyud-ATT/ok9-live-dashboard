import { Button, Modal, Table } from "antd";
import SectionHeader from "../../components/SectionHeader";
import { useMemo } from "react";
import useDeletePinMsg from "../../../../hooks/useDeletePinMsg";
import useGetPinMsg from "../../../../hooks/useGetPinMsg";

function DeletePinMsg({ record }) {
  const id = localStorage.getItem("userCode");
  const { mutate: deletePinMsg } = useDeletePinMsg();

  function handleDelete() {
    Modal.warning({
      content: "Bạn có muốn xóa tin nhắn ghim này?",
      onOk: () => {
        deletePinMsg({ group: id, pinId: record.id });
      },
    });
  }

  return (
    <Button type="primary" danger onClick={handleDelete}>
      Xóa
    </Button>
  );
}

function TableMessage() {
  const { data: response } = useGetPinMsg();
  const pinnedMessages = response?.data?.data || [];

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        hidden: true,
      },
      {
        title: "Tin nhắn",
        dataIndex: "code",
      },
      {
        title: "Hành động",
        dataIndex: "action",
        render: (_, record) => {
          return <DeletePinMsg record={record} />;
        },
      },
    ],
    []
  );

  return (
    <Table
      id="pinned-messages"
      columns={columns}
      dataSource={pinnedMessages}
      pagination={false}
      scroll={{ y: 130 }}
      rootClassName="!rounded-none"
      rowClassName="!rounded-none"
      style={{ borderRadius: "none !important" }}
      bordered
    />
  );
}

export default function PinMsg() {
  return (
    <div className="flex flex-col">
      <SectionHeader title="Tin nhắn ghim" />
      <div className="flex-1">
        <TableMessage />
      </div>
    </div>
  );
}
