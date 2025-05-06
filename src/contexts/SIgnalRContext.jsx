import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { UserType } from "../utils/constant";
import { useQueryClient } from "@tanstack/react-query";
// import * as MsgPack from "@microsoft/signalr-protocol-msgpack";

const SIGNALR_URL =
  import.meta.env.VITE_SIGNALR_URL + "?timestamp=" + Date.now();

const signalRStatus = {
  Disconnected: false,
  Connected: true,
};

const SignalRContext = createContext();

const SignalRProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, fpHash, logout, refeshToken } = useAuth();
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    signalRStatus.Disconnected
  );
  const [liveMessages, setLiveMessages] = useState([]);

  const createConnection = useCallback(() => {
    try {
      return (
        new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_URL, {
            withCredentials: false,
            transport: signalR.HttpTransportType.WebSockets,
            skipNegotiation: true,
          })
          .configureLogging(signalR.LogLevel.Debug)
          // .withHubProtocol(new MsgPack.MessagePackHubProtocol())
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              if (retryContext.elapsedMilliseconds > 180000) {
                setConnectionStatus(signalRStatus.Disconnected);
                return null;
              }

              // Retry delay in milliseconds, and create a backoff sequence not to exceed the array length
              const delayArray = [0, 2000, 5000, 10000, 30000];
              const nextDelay =
                delayArray[
                  Math.min(
                    retryContext.previousRetryCount,
                    delayArray.length - 1
                  )
                ];
              return nextDelay;
            },
          })
          .build()
      );
    } catch (err) {
      console.log("createConnection", err);
    }
  }, []);

  const startConnection = useCallback(
    async (connection) => {
      try {
        await connection.start();
        connection.on("RecvChat", (data) => {
          // console.log("RecvChat: ", data);
          setLiveMessages((state) => [...state, data]);
        });
        connection.on("RecvCode", () => {
          queryClient.invalidateQueries({ queryKey: ["pinMsg"] });
        });

        setConnectionStatus(signalRStatus.Connected);
        setConnection(connection);
      } catch (err) {
        if (connection) {
          await connection.stop();
        }
        console.error("SignalR Connection Error: ", err);
        setConnectionStatus(signalRStatus.Disconnected);
        setConnection(null);
      }
    },
    [logout, refeshToken]
  );

  const manualReconnect = useCallback(async () => {
    try {
      if (connection) {
        await connection.stop();
      }
      const newConnection = createConnection();
      await startConnection(newConnection);
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setConnectionStatus(signalRStatus.Disconnected);
    }
  }, [createConnection, startConnection, connection]);

  /**
   * hub is streamId or userCode
   * => both can be get in getDetailLivestream
   */
  const joinGroup = useCallback(
    ({ hub }) => {
      if (connection) {
        connection.invoke(
          "JoinGroup",
          hub,
          localStorage.getItem("token"),
          fpHash
        );
      }
    },
    [connection, fpHash]
  );

  /**
   * hub is streamId or userCode
   * => both can be get in getDetailLivestream
   */
  const leaveGroup = useCallback(
    ({ hub }) => {
      if (connection) {
        connection.invoke("LeaveGroup", hub);
      }
    },
    [connection]
  );

  const sendChatMessage = useCallback(
    ({ hub, message }) => {
      if (connection) {
        connection.invoke(
          "SendChat",
          hub,
          {
            displayName: localStorage.getItem("displayName"),
            message,
            userType:
              localStorage.getItem("userType") === UserType.IDOL
                ? "special_user"
                : "user",
          },
          localStorage.getItem("token")
        );
      }
    },
    [connection]
  );

  const sendPin = useCallback(
    ({ hub, message }) => {
      if (connection) {
        connection.invoke(
          "SendPin",
          hub,
          {
            code: message,
            userType:
              localStorage.getItem("userType") === UserType.IDOL
                ? "special_user"
                : "user",
          },
          localStorage.getItem("token")
        );
      }
    },
    [connection]
  );

  const resetLiveMessages = useCallback(() => {
    setLiveMessages([]);
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        manualReconnect();
      } else {
        if (connection) {
          connection.stop();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [manualReconnect, connection]);

  useEffect(() => {
    let newConnection = createConnection();
    startConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [createConnection, startConnection]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLiveMessages([]);
    }
  }, [isAuthenticated]);

  return (
    <SignalRContext.Provider
      value={{
        connectionStatus,
        signalRStatus,
        manualReconnect,
        sendChatMessage,
        joinGroup,
        leaveGroup,
        resetLiveMessages,
        liveMessages,
        sendPin,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};

export { SignalRProvider, useSignalR };
