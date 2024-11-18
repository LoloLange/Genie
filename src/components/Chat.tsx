/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { Message } from "./Message";
import { MessageType } from "../types";
import { useNavigate, useParams } from "react-router-dom";

export const Chat = ({
  currentChatId,
  setCurrentChatId,
  chats,
  setChats,
  setShowNavbar,
  mode,
  selectedColor,
  model,
}: {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: { id: string; title: string; messages: MessageType[] }[];
  setChats: React.Dispatch<
    React.SetStateAction<
      { id: string; title: string; messages: MessageType[] }[]
    >
  >;
  setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string;
  selectedColor: string;
  model: string;
}) => {
  const apiKey = import.meta.env.VITE_SECRET_GROQ_API_KEY;
  const client = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [finishedTyping, setFinishedTyping] = useState<boolean>(true);
  const [textAnimation, setTextAnimation] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [isInEnd, setIsInEnd] = useState(true);

  const { chatId } = useParams();
  const navigate = useNavigate();

  const chatTitle = chats.find((c) => chatId === c.id)?.title;

  useEffect(() => {
    if (currentChatId || chatId) {
      if (chats && chats.length > 0) {
        const chat = chats.find(
          (chat) => chat.id === chatId || chat.id === currentChatId
        );
        if (chat) setMessages(chat.messages);
      }
    }
  }, [currentChatId, chats, chatId]);

  useEffect(() => {
    if (finishedTyping) {
      inputRef.current?.focus();
    }
  }, [finishedTyping]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsNewMessage(true);
      setTextAnimation(true);
      chatCompletion();
    }
  };

  const scrollToBottom = () => {
    setIsInEnd(true);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!finishedTyping || textAnimation) {
      setIsInEnd(true);
      scrollToBottom();
    }
  }, [messages, finishedTyping, textAnimation]);

  useEffect(() => {
    setTimeout(() => {
      setIsInEnd(true);
      scrollToBottom();
    }, 100);
  }, [chatId]);

  useEffect(() => {
    const scrollInterval = setInterval(scrollToBottom, 300);
    const handleScroll = clearInterval(scrollInterval);
    chatContainerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(scrollInterval);
      chatContainerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function generateTitle(inputValue: string, systemContent: string) {
    const prompt =
      "Based on the following chat, suggest an accurate title with no more than 5 words of the language of the chat without saying anything else (p.e: '' or / ), just answer with the title and no other words than those:" +
      inputValue +
      "this is the answer:" +
      systemContent;

    const titleCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    const newTitle =
      titleCompletion.choices[0]?.message.content
        ?.trim()
        .replace('"', "")
        .replace('"', "") ?? "Chat";
    return newTitle;
  }

  async function chatCompletion(): Promise<void> {
    if (inputValue.length > 0) {
      setIsStopped(false);
      setIsInEnd(true);
      const userMessage: MessageType = { role: "user", content: inputValue };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      try {
        const completion = await client.chat.completions.create({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role === "system" ? "assistant" : msg.role,
            content: msg.content,
          })),
          model: model,
        });

        const systemContent = completion.choices[0]?.message?.content ?? "";
        const systemMessage: MessageType = {
          role: "system",
          content: systemContent,
        };

        if (!chatId) {
          const newChatId = crypto.randomUUID();

          const newTitle = await generateTitle(inputValue, systemContent);

          const newChat = {
            id: newChatId,
            title: newTitle,
            messages: [userMessage, systemMessage],
          };

          if (!chats?.length) {
            navigate("/" + newChat.id);
            setIsNewMessage(true);
            setFinishedTyping(false);
            setCurrentChatId(newChatId);
            setChats([newChat]);
          } else {
            navigate("/" + newChat.id);
            setIsNewMessage(true);
            setFinishedTyping(false);
            setCurrentChatId(newChatId);
            setChats((prevChats) => [...prevChats, newChat]);
          }
        } else {
          setChats(
            (prevChats) =>
              prevChats &&
              prevChats.map((chat) =>
                chat.id === chatId
                  ? {
                      ...chat,
                      messages: [...chat.messages, userMessage, systemMessage],
                    }
                  : chat
              )
          );
        }
        setIsInEnd(true);
        setMessages((prev) => [...prev, systemMessage]);
      } catch (error) {
        console.error("Error in chat completion:", error);
      }
    }
  }

  const setNewChat = () => {
    navigate("/");
    setCurrentChatId("");
    setMessages([]);
  };

  useEffect(() => {}, []);

  const [displayedTitle, setDisplayedTitle] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (chatTitle) {
      let timer: NodeJS.Timeout = setTimeout(() => {});

      if (currentIndex < chatTitle.length) {
        timer = setInterval(() => {
          setDisplayedTitle(chatTitle.slice(0, currentIndex + 1));
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 40);
      } else {
        clearInterval(timer);
      }

      return () => clearInterval(timer);
    }
  }, [chatTitle, currentIndex]);

  useEffect(() => {
    setDisplayedTitle("");
    setCurrentIndex(0);
  }, [chatId]);

  useEffect(() => {
    if (finishedTyping) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInEnd(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0.1,
        }
      );

      if (messagesEndRef.current) {
        observer.observe(messagesEndRef.current);
      }
      return () => {
        if (messagesEndRef.current) {
          observer.unobserve(messagesEndRef.current);
        }
      };
    } else {
      setIsInEnd(true);
    }
  }, []);

  const handleStopTyping = () => {
    setIsStopped(true);
    setFinishedTyping(true);
  };

  return (
    <>
      <nav
        className={`${
          mode === "dark" ? "bg-gray" : "bg-light-mode"
        } rounded-xl w-full`}
      >
        <header
          className={`border-b-2 ${
            mode === "dark"
              ? "border-b-gray-selected"
              : "border-b-light-mode-selected"
          } p-5 flex justify-between items-center h-[60px]`}
        >
          <div className="flex gap-x-3 items-center">
            <svg
              onClick={() => setShowNavbar((prev) => !prev)}
              className="size-7 cursor-pointer hover:brightness-[0.85] transition-all duration-300"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={mode === "dark" ? "#ddd" : "#444"}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1" />
            </svg>
            {chatTitle ? <p>{displayedTitle}</p> : "New Chat"}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 cursor-pointer hover:brightness-[0.85] transition-all duration-300"
            onClick={setNewChat}
            fill={mode === "dark" ? "#ddd" : "#444"}
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
          </svg>
        </header>
        <main
          ref={chatContainerRef}
          className={`px-10 relative ${
            !finishedTyping && "pointer-events-none"
          }`}
        >
          <section
            id="chatContainer"
            className="p-5 h-full flex flex-col gap-y-2 overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <Message
                role={msg.role}
                content={msg.content}
                key={index}
                setFinishedTyping={setFinishedTyping}
                isNewMessage={
                  index === messages.length - 1 ? isNewMessage : false
                }
                scrollToBottom={scrollToBottom}
                isStopped={isStopped}
                finishedTyping={finishedTyping}
                selectedColor={selectedColor}
                mode={mode}
              />
            ))}
            <div id="scrollDiv" ref={messagesEndRef} />
            <svg
              className={`absolute ${
                !isInEnd ? "bottom-[120px]" : "bottom-[65px]"
              } z-20 duration-300 left-[50%] rounded-full border-2 ${
                mode === "dark"
                  ? "border-gray-selected fill-[#ECECEC] bg-gray"
                  : "fill-gray-selected border-[#cfcfcf] bg-white-answer"
              }  p-1.5  cursor-pointer`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 384 512"
              onClick={scrollToBottom}
            >
              <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </section>
          <footer className="flex flex-col gap-y-2 items-center h-[60px]">
            <div className="flex w-full gap-x-3 h-[50px]">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className={`${
                  mode === "dark"
                    ? "bg-gray-selected text-white-answer"
                    : "bg-[#cfcfcf] text-gray-selected"
                }  rounded-lg shadow-lg p-3 outline-none w-full h-[50px] z-30`}
                placeholder="Start typing..."
                disabled={!finishedTyping}
                onFocus={() => setTextAnimation(false)}
                ref={inputRef}
              />
              <button
                className={` ${
                  inputValue.length === 0 &&
                  finishedTyping &&
                  "brightness-75 cursor-auto"
                } transition-all duration-300 shadow-lg cursor-pointer`}
                onClick={
                  finishedTyping === true ? chatCompletion : handleStopTyping
                }
                disabled={inputValue.length === 0 && finishedTyping}
              >
                {finishedTyping ? (
                  <svg
                    style={{ backgroundColor: selectedColor }}
                    className="fill-white-answer p-3 rounded-lg size-[50px] hover:brightness-90 transition-all duration-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"></path>
                  </svg>
                ) : (
                  <svg
                    style={{ backgroundColor: selectedColor }}
                    className="fill-white-answer p-2.5 rounded-lg size-[50px] hover:brightness-90 transition-all duration-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 7h10v10H7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </footer>
          <p className="text-[11px] text-center mt-2.5 text-zinc-400 pb-5">
            Genie may produce innacurate information about people, places or
            facts. Please check important information. Developed by{" "}
            <a
              style={{ color: selectedColor }}
              target="_blank"
              href="https://github.com/LoloLange"
              className=" font-semibold cursor-pointer duration-300"
            >
              {" "}
              LoloLange
            </a>
          </p>
        </main>
      </nav>
    </>
  );
};
