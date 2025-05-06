import { Button, DatePicker, Form, Input, Select } from "antd";
import useDashboardFilterChats from "../../hooks/useDashboardFilterChats";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import ExportExcel from "../../components/ExportXLSX";
import ChatTable from "./ChatTable";
dayjs.extend(utc);

const selectOptions = [
  { label: "Nội dung tin nhắn", value: "Message" },
  { label: "Tên hiển thị", value: "DisplayName" },
];

export default function Chat() {
  const group = localStorage.getItem("userCode");
  const [tableData, setTableData] = useState([]);
  const [chatFilter, setChatFilter] = useState(selectOptions[0].value);
  const [form] = Form.useForm();
  const { mutate: filterChats, isLoading } = useDashboardFilterChats();

  const onFinish = (values) => {
    const data = {
      ...values,
      startAt: values?.startAt && dayjs(values?.startAt).toISOString(),
      endAt: values?.endAt && dayjs(values?.endAt).toISOString(),
      group,
      chatFilter,
    };
    filterChats(data, {
      onSuccess: (data) => {
        setTableData(data?.data?.data || []);
      },
    });
  };

  return (
    <div
      id="chat-page"
      className="text-white w-[50%] overflow-hidden mx-auto my-12"
    >
      <div>
        <Form
          form={form}
          layout="vertical"
          className="w-full grid grid-cols-4 gap-3"
          onFinish={onFinish}
        >
          <Form.Item
            name="startAt"
            label={<span className="text-white">Thời gian bắt đầu</span>}
          >
            <DatePicker
              showTime
              placeholder="Thời gian bắt đầu livestream"
              format="DD/MM/YYYY HH:mm"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="endAt"
            label={<span className="text-white">Thời gian kết thúc</span>}
          >
            <DatePicker
              showTime
              placeholder="Thời gian kết thúc livestream"
              format="DD/MM/YYYY HH:mm"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="pattern"
            label={<span className="text-white">Tìm kiếm</span>}
          >
            <Input type="text" placeholder="Từ khóa tìm kiếm" />
          </Form.Item>

          <Form.Item
            name="chatFilter"
            label={<span className="text-white">Trường lọc chat</span>}
          >
            <Select
              defaultValue={chatFilter}
              value={chatFilter}
              placeholder="Trường lọc chat"
              options={selectOptions}
              onChange={(value) => setChatFilter(value)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                className="!bg-[var(--color-brand-primary)]"
                loading={isLoading}
                htmlType="submit"
              >
                Tìm kiếm
              </Button>

              {tableData.length > 0 && (
                <>
                  <ExportExcel
                    data={tableData}
                    label="Xuất Che"
                    fileName="chats"
                    hidden
                  />
                  <ExportExcel
                    data={tableData}
                    label="Xuất Full HD"
                    fileName="chats"
                    hidden={false}
                  />
                </>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>

      <ChatTable tableData={tableData} loading={isLoading} />
    </div>
  );
}
