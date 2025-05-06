import { useEffect, useState, useRef, useCallback } from "react";
import { FaCrown } from "react-icons/fa6";
import parse from "html-react-parser";
import { RiPushpinFill, RiUnpinLine } from "react-icons/ri";
import { useSignalR } from "../../../../contexts/SIgnalRContext";
import ChatBar from "./ChatBar";
import SectionHeader from "../../components/SectionHeader";

function ChatFrame({ ...rest }) {
  const [stopAutoScroll, setStopAutoScroll] = useState(false);
  const commentsContainerRef = useRef(null);
  const commentsEndRef = useRef(null);

  const { liveMessages: comments, resetLiveMessages } = useSignalR();

  const scrollToBottom = useCallback(() => {
    const container = commentsContainerRef.current;
    const bottomElement = commentsEndRef.current;

    if (container && bottomElement) {
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      console.log(scrollHeight, containerHeight);

      if (scrollHeight > containerHeight && !stopAutoScroll) {
        bottomElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [stopAutoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [comments, scrollToBottom]);

  useEffect(() => {
    return () => {
      resetLiveMessages();
    };
  }, [resetLiveMessages]);

  return (
    <div className={`text-white h-full flex flex-col`}>
      <div className={`text-sm flex bg-[var(--background-shader-2)] z-20`}>
        <div className="relative flex flex-col w-full">
          <button
            className={`flex-1 my-2 mx-2 py-2 text-center rounded-t-lg bg-[var(--background-shader-3)]`}
          >
            <span className={`$text-[var(--color-brand-primary)] font-bold`}>
              BÌNH LUẬN
            </span>
            <button
              className="absolute right-6 top-4"
              onClick={() => setStopAutoScroll((state) => !state)}
            >
              <span className="text-white">
                {stopAutoScroll ? (
                  <RiUnpinLine className="!text-2xl" />
                ) : (
                  <RiPushpinFill className="!text-2xl" />
                )}
              </span>
            </button>
          </button>
        </div>
      </div>

      <div ref={commentsContainerRef} className="h-full overflow-auto">
        <div className="p-2 space-y-3">
          {comments.map((comment, index) => {
            const isSpecial = comment.isSpecial;
            return (
              <div
                key={`${comment.id}_${index}`}
                className="flex justify-between"
              >
                <div className="flex gap-1">
                  <div
                    className={`flex gap-0.5 text-[var(--color-brand-primary)] text-sm font-medium mb-1 ${
                      isSpecial ? "text-[var(--special-user-color)]" : ""
                    }`}
                  >
                    <span>{comment.displayName}</span>
                    {isSpecial && <FaCrown className="rotate-45 text-[10px]" />}
                    <span>:</span>
                  </div>
                  <div
                    className={`text-gray-300 text-xs leading-relaxed ${
                      isSpecial
                        ? "!text-[var(--special-user-color)] font-semibold"
                        : ""
                    }`}
                  >
                    {parse(comment.message)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
}

function ChatInterface({ ...rest }) {
  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Chat Feed" />
      <div
        className="flex flex-col flex-1 min-h-0 w-full justify-between bg-[var(--background-shader-2)]"
        {...rest}
      >
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatFrame />
        </div>
        <div className="pb-3 px-2">
          <ChatBar />
        </div>
      </div>
    </div>
  );
}

export { ChatInterface };
