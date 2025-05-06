import { FaRegBell } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import SectionHeader from "../components/SectionHeader";
import ItemsModal from "./components/ItemsModal";
import ChatBoxContent from "./components/ChatBoxContent";

const items = [
  {
    icon: <LuSettings2 className="rotate-90 text-2xl" strokeWidth={3} />,
    label: "Mở bình chọn",
    enable: false,
    render: () => <span className="text-white">Đang được phát triển</span>,
  },
  {
    icon: <FaRegBell className="text-2xl" strokeWidth={3} />,
    label: "AlertBox",
    enable: false,
    render: () => <span className="text-white">Đang được phát triển</span>,
  },
  {
    icon: <IoChatboxEllipsesOutline className="text-2xl" strokeWidth={3} />,
    label: "ChatBox",
    enable: true,
    render: () => <ChatBoxContent />,
  },
];

export default function QuickAccess() {
  return (
    <div>
      <SectionHeader title="Thao tác nhanh" />
      <div className="quick-access-container">
        {items.map((item, index) => (
          <ItemsModal key={index} {...item} render={item.render} />
        ))}
      </div>
    </div>
  );
}
