import { toast } from "react-toastify";
import axoisBase from "./axiosBase";

const endpoint = "/dash-board";

async function filterChats(data) {
  try {
    const res = await axoisBase.get(`${endpoint}/chats/list`, { params: data });
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in filterChats:", error);
    throw error;
  }
}

async function getPinMsg() {
  try {
    const res = await axoisBase.get(`${endpoint}/pins/list`);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in pinMsg:", error);
    throw error;
  }
}

async function addPinMsg(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/pins/add`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in pinMsg:", error);
    throw error;
  }
}

async function deletePinMsg(data) {
  try {
    const res = await axoisBase.delete(`${endpoint}/pins/delete`, {
      params: data,
    });
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in deletePinMsg:", error);
    throw error;
  }
}

export { filterChats, getPinMsg, addPinMsg, deletePinMsg };
