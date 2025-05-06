import { Menu, Typography } from "antd";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { GrHomeRounded } from "react-icons/gr";
import { IoChatbubbleOutline } from "react-icons/io5";
// import { CiStreamOn } from "react-icons/ci";
import { Link, useLocation } from "react-router";
import { CiStreamOn } from "react-icons/ci";
// import { FaGamepad } from "react-icons/fa6";

const itemStyle = "font-bold text-[14px]";

const items = [
  {
    key: "home",
    icon: <GrHomeRounded className="!text-lg" strokeWidth={3} />,
    label: (
      <Link to="/" className={itemStyle}>
        Trang chủ
      </Link>
    ),
  },
  {
    key: "chat",
    icon: <IoChatbubbleOutline className="!text-lg" strokeWidth={3} />,
    label: (
      <Link to="/chat" className={itemStyle}>
        Lọc tin nhắn
      </Link>
    ),
  },
  {
    key: "live-stream",
    icon: <CiStreamOn className="!text-lg" strokeWidth={3} />,
    label: (
      <Link to="/live-stream" className={itemStyle}>
        Cấu hình live stream
      </Link>
    ),
  },
  // {
  //   key: "game-config",
  //   icon: <FaGamepad className="!text-lg" strokeWidth={3} />,
  //   label: (
  //     <Link to="/game-config" className={itemStyle}>
  //       Cấu hình game
  //     </Link>
  //   ),
  // },
];

export default function BaseSider({ Layout, ...rest }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useLocation().pathname;
  const [current, setCurrent] = useState(
    pathname === "/" ? "home" : pathname.replace("/", "")
  );

  const toggleCollapse = () => {
    setCollapsed((state) => !state);
  };

  return (
    <Layout.Sider
      id="main-layout-sider"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={300}
      className={`pt-5`}
      {...rest}
    >
      <Typography.Title
        level={4}
        className="font-bold !text-white w-full flex justify-around items-center py-2"
      >
        {!collapsed && (
          <span className="font-bold text-[14px]">
            Bảng điền khiển Streamer
          </span>
        )}
        <div className="flex flex-col justify-center items-center">
          {collapsed ? (
            <MenuUnfoldOutlined
              onClick={toggleCollapse}
              className="cursor-pointer !text-xl"
            />
          ) : (
            <MenuFoldOutlined
              onClick={toggleCollapse}
              className="m-0 p-0 cursor-pointer !text-xl"
            />
          )}
        </div>
      </Typography.Title>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[pathname]}
        selectedKeys={[current]}
        onClick={({ key }) => setCurrent(key)}
        items={items}
      />
    </Layout.Sider>
  );
}
