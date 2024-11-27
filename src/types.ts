import { SetStateAction } from "react";

export interface MessageType {
  role: "user" | "system";
  content: string;
}

export interface ChatsType {
  id: string;
  title: string;
  messages: MessageType[];
}

export interface SettingsType {
  appearance: string;
  model: string;
  selectedColor: string;
}

export interface ChatType {
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
  chatTitle: string;
  setChatTitle: React.Dispatch<React.SetStateAction<string>>;
  userWidthMobile: boolean;
}

export interface SidebarType {
  chats: { id: string; title: string; messages: MessageType[] }[];
  setChats: React.Dispatch<
    React.SetStateAction<
      { id: string; title: string; messages: MessageType[] }[]
    >
  >;
  showNavbar: boolean;
  setShowSettings: React.Dispatch<SetStateAction<boolean>>;
  mode: string;
  setChatTitle: React.Dispatch<SetStateAction<string>>;
  setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  userWidthMobile: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>
}

export interface SettingsComponentType {
  setShowSettings: React.Dispatch<SetStateAction<boolean>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<SetStateAction<string>>;
  appearance: string;
  setAppearance: React.Dispatch<SetStateAction<string>>;
  model: string;
  setModel: React.Dispatch<SetStateAction<string>>;
  mode: string;
}

export interface MessageComponentType {
  role: "user" | "system";
  content: string;
  setFinishedTyping: React.Dispatch<SetStateAction<boolean>>;
  isNewMessage: boolean | false;
  scrollToBottom: () => void;
  isStopped: boolean;
  finishedTyping: boolean;
  selectedColor: string;
  mode: string;
}
