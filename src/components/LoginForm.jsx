import { Button, Flex, Form, Image, Input, Typography } from "antd";
import Logo from "./Logo";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import useRecaptcha from "../hooks/useRecaptcha";
import { GoogleAuthProvider } from "../contexts/GoogleAuthContext";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { mutate: generateCaptcha, isLoading } = useRecaptcha();

  const [recaptcha, setRecaptcha] = useState("");

  const onFinish = async (values) => {
    try {
      await login(values);
      form.resetFields();
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  useEffect(() => {
    generateCaptcha("", {
      onSuccess: (data) => {
        setRecaptcha(data?.data?.data);
      },
    });
  }, [generateCaptcha]);

  return (
    <div className="py-3 px-1 w-full">
      <div className="flex flex-col justify-center items-center mb-8">
        <Logo width={211} height={82} />
      </div>
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Hãy nhập tên tài khoản!" }]}
        >
          <Input
            autoComplete="new-username"
            placeholder="Nhập tài khoản"
            className="h-12 bg-white/10 border border-gray-600 rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
        >
          <Input.Password
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            className="h-12 bg-white/10 border border-gray-600 rounded-lg login-form-password"
            iconRender={(visible) =>
              visible ? <FaRegEye /> : <FaRegEyeSlash />
            }
          />
        </Form.Item>

        <Form.Item
          name="captcha"
          rules={[
            {
              required: true,
              message: "Nhập mã captcha!",
            },
          ]}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập mã captcha"
              className="h-12 bg-white/10 border border-gray-600 rounded-lg"
              suffix={<Image src={recaptcha} preview={false} />}
              disabled={isLoading}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 !bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] border-none rounded-lg text-lg font-medium"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      {/* <Flex gap={8} justify="center" items="center" className="w-full my-10">
        <div className="w-full h-[0.5px] my-2 bg-gray-600"></div>
        <p className="px-2 text-center text-gray-300">hoặc</p>
        <div className="w-full h-[0.5px] my-2 bg-gray-600"></div>
      </Flex>
      <Flex className="w-full !mt-5" justify="center">
        <GoogleAuthProvider.GoogleLoginButton />
      </Flex> */}
    </div>
  );
}
