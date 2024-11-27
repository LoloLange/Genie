import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { Sidebar } from "./components/Sidebar";
import { ChatsType } from "./types";
import { Settings } from "./components/Settings";

function App() {
  /* --------- STATES ------ */

  // get saved chats
  const [chats, setChats] = useState<ChatsType[]>(() => {
    const storedChats = localStorage.getItem("chats");
    return storedChats ? JSON.parse(storedChats) : [];
  });

  // chat info
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");

  // navbar state
  const [showNavbar, setShowNavbar] = useState<boolean>(
    window.innerWidth >= 800 ? true : false
  );

  // Settings
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#5645ee");
  const [appearance, setAppearance] = useState<string>("system");
  const [model, setModel] = useState<string>("llama3-8b-8192");
  const [mode, setMode] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  // Log out
  const [showLogout, setShowLogout] = useState<boolean>(false);

  // check if the user's window is 800px wide or less
  const userWidthMobile = window.innerWidth >= 800 ? false : true;

  /* --------- EFFECTS ------ */

  // every time chats change, the local storage is updated automatically
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // change between appearances/modes
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

  const handleLogOut = () => {
    setChats([]);
    setShowLogout(false);
    location.assign('/');
  }

  return (
    <div className="flex w-full h-screen max-[801px]:overflow-hidden">
      <aside
        className={`${
          showNavbar
            ? "w-[300px] min-[500px]:w-[350px] min-[2000px]:w-[450px] p-5 duration-700"
            : "w-0 duration-700"
        } flex flex-col justify-between mt-5 text-sm font-medium z-10 ${
          showSettings && "opacity-50"
        } ${showLogout && "opacity-50"}`}
      >
        <Sidebar
          chats={chats}
          setChats={setChats}
          showNavbar={showNavbar}
          setShowSettings={setShowSettings}
          mode={mode}
          setChatTitle={setChatTitle}
          setShowNavbar={setShowNavbar}
          userWidthMobile={userWidthMobile}
          setShowLogout={setShowLogout}
        />
      </aside>
      <main
        className={`${
          mode === "dark"
            ? "bg-gray duration-700"
            : "bg-light-mode duration-700"
        } ${
          !showNavbar && "min-[650px]:m-5 duration-700"
        } min-[650px]:my-5 min-[650px]:mr-5 min-[650px]:rounded-xl h-screen min-[650px]:h-fit w-full z-50 ${
          showSettings && "opacity-50"
        } ${showLogout && "opacity-50"}`}
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
          chatTitle={chatTitle}
          setChatTitle={setChatTitle}
          userWidthMobile={userWidthMobile}
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
      <section
        className={`absolute z-50 flex justify-center items-center w-full h-full blur-0 ${
          showLogout ? "opacity-100 block" : "opacity-0 hidden"
        } duration-300`}
      >
        {showLogout && (
          <div
            className={`w-[300px] min-[450px]:w-[375px] min-[650px]:w-[500px] min-[2000px]:w-[700px] min-[2000px]:text-2xl max-[651px]:text-sm relative ${
              mode === "dark"
                ? "bg-gray border-gray-selected"
                : "bg-light-mode border-light-mode-selected"
            } border-2 rounded-xl shadow-xl p-6`}
          >
            <div
              className={`flex justify-between border-b-2 ${
                mode === "dark"
                  ? "border-gray-selected"
                  : "border-light-mode-selected"
              }  pb-2 min-[2000px]:pb-3`}
            >
              <p className="font-semibold text-lg min-[2000px]:text-2xl">
                Log out
              </p>
              <svg
                onClick={() => setShowLogout(false)}
                className="size-6 min-[2000px]:size-8 fill-[#aaa] cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
            <div className="flex flex-col w-full items-center mt-5 text-center">
              <p>Are you sure you want to log out?</p>
              <p>All chats will be deleted</p>
            </div>
            <div className="px-5 min-[450px]:px-10 min-[650px]:px-20 mt-3 flex flex-col gap-y-3">
              <button className="bg-red-700 p-1.5 w-full rounded-lg" onClick={handleLogOut}>
                Log out
              </button>
              <button
                className="border-2 border-gray-selected p-1.5 w-full rounded-lg"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
