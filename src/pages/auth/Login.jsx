import LoginForm from "../../components/LoginForm";
import BgBottom from "../../assets/bg-bottom-org.png";

export default function Login() {
  return (
    <div
      className="w-full  h-[100dvh]"
      style={{
        backgroundImage: `url(${BgBottom})`,
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1920px 562px",
        boxSizing: "border-box",
        height: "100%",
        overflow: "auto",
        padding: "0 5px 20px",
      }}
    >
      <div className="flex justify-center items-center  h-[100dvh] w-[20%] mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
