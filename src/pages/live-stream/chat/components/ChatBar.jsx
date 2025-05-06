import { useCallback, useEffect, useMemo, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { Flex, Input, Typography } from "antd";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { useSignalR } from "../../../../contexts/SIgnalRContext";
import { useAuth } from "../../../../contexts/AuthContext";
import useAddPinMsg from "../../../../hooks/useAddPinMsg";

export default function ChatBar() {
  const id = localStorage.getItem("userCode");
  const [showForceLogin, setShowForceLogin] = useState(false);
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [isSendCode, setIsSendCode] = useState(false);
  const {
    connectionStatus,
    sendChatMessage,
    joinGroup,
    leaveGroup,
    manualReconnect,
    sendPin,
  } = useSignalR();

  const { mutate: addPinMsg } = useAddPinMsg();

  const toggleSendCode = useCallback(() => {
    setIsSendCode(!isSendCode);
  }, [isSendCode]);

  const handleSendMessage = useCallback(() => {
    if (message !== "") {
      const newMsg = message.replace(/\n/g, "<br/>").trim();
      if (!isSendCode) {
        sendChatMessage({ hub: id, message: newMsg });
        setMessage("");
      } else {
        addPinMsg(
          { group: id, message: newMsg },
          {
            onSuccess: () => {
              sendPin({ hub: id, message: newMsg });
            },
          }
        );
        setMessage("");
        toggleSendCode();
      }
    }
  }, [
    message,
    sendChatMessage,
    addPinMsg,
    id,
    toggleSendCode,
    isSendCode,
    sendPin,
  ]);

  useEffect(() => {
    if (connectionStatus) {
      joinGroup({ hub: id });
    }

    return () => {
      leaveGroup({ hub: id });
    };
  }, [id, joinGroup, leaveGroup, connectionStatus, manualReconnect]);

  const ChatBarMemmoized = useMemo(() => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        onMouseEnter={() => !isAuthenticated && setShowForceLogin(true)}
        onMouseLeave={() => setShowForceLogin(false)}
      >
        {!showForceLogin ? (
          <div className="flex gap-2 items-center">
            <Input.TextArea
              autoSize
              maxLength={9999}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nói chuyện với streamer"
              className={`flex-1 
                bg-[#3A3B3C] 
                hover:bg-[#3A3B3C]
                focus:bg-[#3A3B3C] 
                focus-within:bg-[#3A3B3C] 
                focus:border-[var(--color-brand-primary)] 
                focus-within:border-[var(--color-brand-primary)] 
                hover:border-[var(--color-brand-primary)] 
                px-3 py-1.5 
                text-white
                placeholder-gray-200
                `}
              classNames={{
                textarea: "placeholder-gray-200 ",
                count: "!text-[var(--color-brand-primary)]",
              }}
              onPressEnter={(e) => {
                e.preventDefault();
                if (e.shiftKey) {
                  let newMessage = `${message}\n`;
                  setMessage(newMessage);
                } else {
                  handleSendMessage();
                }
              }}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[var(--color-brand-primary)]"
                onClick={toggleSendCode}
              >
                {isSendCode ? (
                  <BsPinAngleFill size={20} />
                ) : (
                  <BsPinAngle size={20} />
                )}
              </button>
              <button
                type="submit"
                className="text-[var(--color-brand-primary)]"
              >
                <IoSendSharp size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-2">
            <Flex vertical justify="center" align="center" gap={4}>
              <Typography.Title level={5} className="!text-white">
                Nhớ 8 với những người xem chung nhé!
              </Typography.Title>
              <Typography.Text>
                Đăng nhập để tham gia trò chuyện!
              </Typography.Text>
              <button
                type="button"
                className="text-white bg-[var(--color-brand-primary)] w-full p-2 rounded-lg mt-3"
                onClick={() => document.getElementById("login-button")?.click()}
              >
                Đăng nhập
              </button>
            </Flex>
          </div>
        )}
      </form>
    );
  }, [
    handleSendMessage,
    isAuthenticated,
    message,
    showForceLogin,
    toggleSendCode,
    isSendCode,
  ]);

  return ChatBarMemmoized;
}
