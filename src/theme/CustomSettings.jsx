import { ConfigProvider, Empty } from "antd";

const renderEmpty = (componentName) => {
  if (componentName === "Table" /** 👈 5.20.0+ */) {
    return (
      <Empty
        className="bg-[var(--background-shader-3)] hover:!bg-[var(--background-shader-3)] !m-0 p-8"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span className="text-white">Chưa có dữ liệu</span>}
      />
    );
  }
};

export default function ThemeCustomSettings({ children }) {
  return (
    <ConfigProvider
      renderEmpty={renderEmpty}
      theme={{
        token: {},
        components: {
          Layout: {
            siderBg: "var(--background-shader-2)",
            headerBg: "var(--background-shader-2)",
            bodyBg: "var(--background-shader-1)",
          },
          Menu: {
            darkItemBg: "var(--background-shader-2)",
            darkItemActiveBg: "var(--active-menu-dark-background)",
            darkItemSelectedBg: "var(--active-menu-dark-background)",
          },
          Table: {
            borderColor: "white",
            headerColor: "white",
            headerBg: "var(--color-brand-primary)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
