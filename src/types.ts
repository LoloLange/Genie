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
