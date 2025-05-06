import Logo from "../components/Logo";
import UserActionDropdown from "../components/UserActionDropdown";

export default function BaseHeader({ Layout, ...rest }) {
  return (
    <Layout.Header {...rest}>
      <Logo />
      <UserActionDropdown />
    </Layout.Header>
  );
}
