import { useState, useEffect, useRef } from "react";
import { SidebarType } from "../types";
import { Link, useParams } from "react-router-dom";

export const Sidebar = ({
  chats,
  setChats,
  showNavbar,
  setShowSettings,
  mode,
  setChatTitle,
}: SidebarType) => {
  /* --------- STATES AND REFS ------ */

  const [dotsClicked, setDotsClicked] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const menuRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  /* --------- REACT ROUTER ------ */

  const { chatId } = useParams();

  /* --------- EFFECTS ------ */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let clickedOutside = true;

      menuRefs.current.forEach((menu) => {
        if (menu && menu.contains(event.target as Node)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setDotsClicked(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* --------- FUNCTIONS ------ */

  const deleteChat = (chatId: string) => {
    const newChats = chats.filter((c) => c.id !== chatId);
    setChats(newChats);
    location.assign("/");
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };

  const handleRename = (id: string) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === id) {
        return { ...chat, title: newTitle };
      }
      return chat;
    });

    setChats(updatedChats);
    setChatTitle(newTitle);
    setEditingId(null);
  };

  return (
    <aside
      className={`flex flex-col h-full overflow-hidden w-[250px] ${
        showNavbar ? "opacity-100 duration-700" : "opacity-0 duration-700"
      }`}
    >
      <section className="flex flex-col gap-y-1 overflow-y-auto w-[250px]">
        <div className="flex items-center justify-center gap-x-4">
          <svg
            className="size-14"
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
          <p className="text-3xl font-extrabold select-none tracking-wider">
            GENIE
          </p>
        </div>
        <hr
          className={`${
            mode === "dark" ? "text-gray-selected" : "text-light-mode-selected"
          } mt-4 mb-2`}
        />
        <div className="overflow-auto gap-y-2 flex flex-col h-screen">
          {chats &&
            chats.length > 0 &&
            [...chats].reverse().map((c) => (
              <Link to={"/" + c.id} key={c.id}>
                <div
                  className={`flex justify-between items-center px-4 py-2.5 rounded-xl cursor-pointer relative ${
                    chatId === c.id
                      ? mode === "dark"
                        ? "bg-gray-selected shadow-lg"
                        : "bg-[#CFCFCF] shadow-lg"
                      : mode === "dark"
                      ? "hover:bg-gray-selected hover:duration-300 transition-all"
                      : "hover:bg-[#CFCFCF] transition-all hover:duration-300"
                  }`}
                >
                  <div className="flex items-center gap-x-2 w-[215px] justify-between">
                    {editingId === c.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleRename(c.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(c.id);
                        }}
                        className="outline outline-slate-400 outline-offset-2 mr-2 bg-transparent"
                        autoFocus
                      />
                    ) : (
                      <p className="truncate">{c.title}</p>
                    )}
                    <p
                      onClick={() =>
                        setDotsClicked((prev) => (prev === c.id ? null : c.id))
                      }
                      className="text-xl mb-2 brightness-75 hover:brightness-100 transition-all hover:duration-300"
                    >
                      ...
                    </p>
                  </div>
                  <div
                    ref={(ref) => menuRefs.current.set(c.id, ref)}
                    className={`${dotsClicked === c.id ? "block" : "hidden"} ${
                      mode === "dark" ? "bg-[#2F2F2F]" : "bg-[#BFBFBF]"
                    } p-5 absolute right-0 top-11 rounded-xl flex flex-col gap-y-5 z-50`}
                    id={c.id}
                  >
                    <p
                      onClick={() => startEditing(c.id, c.title)}
                      className="hover:brightness-75 transition-all  hover:duration-300"
                    >
                      Rename
                    </p>
                    <p
                      className="text-red-600 hover:brightness-75 transition-all hover:duration-300"
                      onClick={() => deleteChat(c.id)}
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <div className="flex flex-col gap-y-1 mt-2">
        <p
          className="flex items-center gap-x-2 px-2 py-3 rounded-xl cursor-pointer hover:brightness-90 transition-all hover:duration-300"
          onClick={() => setShowSettings(true)}
        >
          <svg
            className="size-6 stroke-yellow-700 fill-transparent"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          </svg>
          Settings
        </p>
        <p className="flex items-center gap-x-2 px-2 py-3 rounded-xl cursor-pointer hover:brightness-90 transition-all hover:duration-300">
          <svg
            className="size-6 stroke-red-600 fill-transparent"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
            <path d="M15 12h-12l3 -3" />
            <path d="M6 15l-3 -3" />
          </svg>
          Log out
        </p>
      </div>
    </aside>
  );
};
