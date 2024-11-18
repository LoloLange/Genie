import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { Sidebar } from "./components/Sidebar";
import { MessageType } from "./types";
import { Settings } from "./components/Settings";

function App() {
  const [chats, setChats] = useState<
    { id: string; title: string; messages: MessageType[] }[]
  >(JSON.parse(localStorage.getItem("chats")));
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#5645ee");
  const [appearance, setAppearance] = useState<string>("system");
  const [model, setModel] = useState<string>("llama3-8b-8192");
  const [mode, setMode] = useState<string>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (appearance === "system") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setMode("dark");
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
      } else {
        setMode("light");
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
      }
    } else if (appearance === "dark") {
      setMode("dark");
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else if (appearance === "light") {
      setMode("light");
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }, [appearance]);

  return (
    <div className="flex w-full h-screen">
      <aside
        className={`${
          showNavbar ? "w-[350px] p-5 duration-700" : "w-0 duration-700"
        } flex flex-col justify-between mt-5 text-sm font-medium z-10 ${
          showSettings && "opacity-50"
        }`}
      >
        <Sidebar
          chats={chats}
          setChats={setChats}
          showNavbar={showNavbar}
          setShowSettings={setShowSettings}
          mode={mode}
        />
      </aside>
      <main
        className={`${mode === "dark" ? "bg-gray duration-700" : "bg-light-mode duration-700"} ${
          !showNavbar && "m-5 duration-700"
        } my-5 mr-5 rounded-xl h-fit w-full z-50 ${
          showSettings && "opacity-50"
        }`}
      >
        <Chat
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          chats={chats}
          setChats={setChats}
          setShowNavbar={setShowNavbar}
          mode={mode}
          selectedColor={selectedColor}
          model={model}
        />
      </main>
      <section
        className={`absolute z-50 flex justify-center items-center w-full h-full blur-0 ${
          showSettings ? "opacity-100 block" : "opacity-0 hidden"
        } duration-300`}
      >
        <Settings
          setShowSettings={setShowSettings}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          appearance={appearance}
          setAppearance={setAppearance}
          model={model}
          setModel={setModel}
          mode={mode}
        />
      </section>
    </div>
  );
}

export default App;