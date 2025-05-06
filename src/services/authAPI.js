import { toast } from "react-toastify";
import axoisBase from "./axiosBase";

const endpoint = "/dash-board";

async function login(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/login`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in login:", error);
    throw error;
  }
}

async function loginWithGoogle(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/login/google`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in login:", error);
    throw error;
  }
}

async function generateCaptcha() {
  try {
    const res = await axoisBase.post(`/auth/captcha`);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in generateCaptcha:", error);
    throw error;
  }
}

export { login, loginWithGoogle, generateCaptcha };
