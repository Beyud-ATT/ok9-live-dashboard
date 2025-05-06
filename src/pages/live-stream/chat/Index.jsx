import { ChatInterface } from "./components/Chat";
import PinMsg from "./components/PinMsg";

export default function ChatFeed() {
  return (
    <div className="flex flex-col h-full gap-5">
      <div>
        <PinMsg />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
