/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageComponentType } from "../types";

export const Message = ({
  role,
  content,
  setFinishedTyping,
  isNewMessage,
  scrollToBottom,
  isStopped,
  finishedTyping,
  selectedColor,
  mode,
}: MessageComponentType) => {
  /* --------- STATES ------ */

  // text typing animation states
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // copy option
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  /* --------- EFFECTS ------ */

  // text typing animation
  useEffect(() => {
    if (
      isNewMessage &&
      role === "system" &&
      currentIndex < content.length &&
      !isStopped
    ) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < content.length) {
            setFinishedTyping(false);
            setDisplayedText(content.slice(0, prevIndex + 1));
            scrollToBottom();
            return prevIndex + 1;
          }
          setFinishedTyping(true);
          clearInterval(timer);
          return prevIndex;
        });
      }, 8);
      return () => {
        clearInterval(timer);
      };
    } else {
      if (role === "system") {
        setFinishedTyping(true);
      }
    }
  }, [isNewMessage, content, currentIndex, setFinishedTyping, isStopped]);

  /* --------- FUNCTIONS ------ */

  const handleCopyClick = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return role === "system" ? (
    <section
      className="flex flex-col relative pb-7 min-[2000px]:pb-11"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="flex gap-x-3 min-[2000px]:gap-x-5">
        <svg
          className={`size-9 min-w-9 min-[2000px]:size-12 min-[2000px]:min-w-12 p-2 ${
            mode === "dark" ? "bg-gray-selected" : "bg-[#CFCFCF]"
          } rounded-lg shadow-xl`}
          viewBox="0 0 109 113"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
            fill="url(#paint0_linear)"
          />
          <path
            d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
            fill="url(#paint1_linear)"
            fillOpacity="0.2"
          />
          <path
            d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
            fill="#5645EE"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="53.9738"
              y1="54.974"
              x2="94.1635"
              y2="71.8295"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#342991" />
              <stop offset="1" stopColor="#5645EE" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="36.1558"
              y1="30.578"
              x2="54.4844"
              y2="65.0806"
              gradientUnits="userSpaceOnUse"
            >
              <stop />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {isNewMessage ? (
          <ReactMarkdown
            className={
              "flex flex-col gap-y-5 prose-invert overflow-auto w-full pr-12 min-[1100px]:pr-28 min-[2000px]:text-xl min-[2500px]:text-2xl"
            }
          >
            {displayedText}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown
            className={
              "flex flex-col gap-y-5 prose-invert overflow-auto w-full pr-12 min-[1100px]:pr-28 min-[2000px]:text-xl min-[2500px]:text-2xl"
            }
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
      <svg
        className={`size-[18px] min-[2000px]:size-[24px] absolute bottom-0 left-12 min-[2000px]:left-16 cursor-pointer z-20 ${
          showOptions && !copied && finishedTyping ? "opacity-100" : "opacity-0"
        } transition-all duration-150 `}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#aaa"
        onClick={handleCopyClick}
      >
        <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
      </svg>
      <svg
        className={`size-[18px] min-[2000px]:size-[24px] absolute bottom-0 left-12 min-[2000px]:left-16 ${
          copied ? "opacity-100" : "opacity-0"
        } z-10`}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#ddd"
      >
        <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
      </svg>
    </section>
  ) : (
    <div className="flex justify-end text-end gap-x-3 min-[2000px]:gap-x-5">
      <p className="mt-1 prose-invert min-[2000px]:text-xl min-[2500px]:text-2xl pl-12 min-[1100px]:pl-28">{content}</p>
      <svg
        style={{ backgroundColor: selectedColor }}
        className="size-9 min-w-9 min-[2000px]:size-12 min-[2000px]:min-w-12 fill-white-answer p-2 rounded-lg shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        data-darkreader-inline-fill=""
      >
        <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
      </svg>
    </div>
  );
};
