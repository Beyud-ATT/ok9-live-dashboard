import { Outlet } from "react-router";

export default function BaseContent({ Layout, ...rest }) {
  return (
    <Layout.Content {...rest}>
      <Outlet />
    </Layout.Content>
  );
}
