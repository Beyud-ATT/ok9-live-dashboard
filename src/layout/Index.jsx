import { Layout } from "antd";
import BaseHeader from "./BaseHeader";
import BaseSider from "./BaseSider";
import BaseContent from "./BaseContent";
import BgBottom from "../assets/bg-bottom-org.png";

const MainLayout = () => {
  return (
    <Layout className="h-[100dvh] w-full" style={{ minHeight: "100dvh" }}>
      <BaseHeader
        Layout={Layout}
        className="mb-2 !py-2 flex items-center justify-between !h-auto"
      />
      <Layout>
        <BaseSider Layout={Layout} />
        <BaseContent
          Layout={Layout}
          style={{
            backgroundImage: `url(${BgBottom})`,
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1920px 562px",
            boxSizing: "border-box",
            height: "100%",
            overflow: "auto",
            padding: "0 20px",
          }}
        />
      </Layout>
    </Layout>
  );
};
export default MainLayout;
