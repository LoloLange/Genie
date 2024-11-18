/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useState } from "react";
import { SettingsType } from "../types";

export const Settings = ({
  setShowSettings,
  selectedColor,
  setSelectedColor,
  appearance,
  setAppearance,
  model,
  setModel,
  mode,
}: {
  setShowSettings: React.Dispatch<SetStateAction<boolean>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<SetStateAction<string>>;
  appearance: string;
  setAppearance: React.Dispatch<SetStateAction<string>>;
  model: string;
  setModel: React.Dispatch<SetStateAction<string>>;
  mode: string;
}) => {
  const colors = ["#5645ee", "#dc2626", "#ca8a04", "#2563eb", "#16a34a"];
  const models = [
    "llama3-8b-8192",
    "llama3-70b-8192",
    "llama-3.2-1b-preview",
    "llama-3.2-3b-preview",
    "mixtral-8x7b-32768",
  ];
  const appearanceOptions = ["System", "Dark", "Light"];

  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAppearanceDropdown, setShowAppearanceDropdown] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(() => {
    const storedSettings = localStorage.getItem("settings");
    return storedSettings ? JSON.parse(storedSettings) : null;
  });

  useEffect(() => {
    if (settings) {
      setSelectedColor(settings.selectedColor);
      setAppearance(settings.appearance);
      setModel(settings.model);
    }
  }, []);

  useEffect(() => {
    const newSettings = {
      selectedColor: selectedColor,
      appearance: appearance,
      model: model,
    };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }, [selectedColor, appearance, model]);

  const handleAppearanceClick = (option: string) => {
    setAppearance(option.toLowerCase());
    setShowAppearanceDropdown(false);
  };

  const handleModelClick = (model: string) => {
    setModel(model);
    setShowModelDropdown(false);
  };

  const handleRestoreSettings = () => {
    setSelectedColor("#5645ee");
    setAppearance("system");
    setModel("llama3-8b-8192");
  };

  return (
    <div
      className={`w-[500px] ${
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
        }  pb-2`}
      >
        <p className="font-semibold text-lg">Settings</p>
        <svg
          onClick={() => (
            setShowSettings(false),
            setShowAppearanceDropdown(false),
            setShowModelDropdown(false)
          )}
          className="size-6 fill-[#aaa] cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </div>

      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <p>Page color</p>
          <div className="flex items-center gap-x-2 w-[175px]">
            {colors.map((c) => (
              <span
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{
                  backgroundColor: c,
                }}
                className={`border-2 ${
                  selectedColor === c
                    ? "border-[#aaa]"
                    : mode === "dark"
                    ? "border-gray-selected"
                    : "border-light-mode-selected"
                } size-7 flex rounded-full cursor-pointer duration-300`}
              ></span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-y-3">
          <div className="relative flex justify-between items-center w-full">
            <p className="flex items-center gap-x-1">
              Model <span className="text-xs">(applied to new chats)</span>
            </p>
            <div>
              <button
                className={`${
                  mode === "dark"
                    ? "bg-gray-selected text-white-answer"
                    : "bg-[#CFCFCF] text-gray"
                } py-2 px-4 rounded-lg shadow-md hover:brightness-90 transition-all duration-300 w-[175px] truncate`}
                onClick={() => (
                  setShowModelDropdown((prev) => !prev),
                  setShowAppearanceDropdown(false)
                )}
              >
                {model}
              </button>
              {showModelDropdown && (
                <div
                  className={`absolute mt-2 ${
                    mode === "dark"
                      ? "bg-gray-selected text-white-answer"
                      : "bg-[#CFCFCF] text-gray"
                  } py-2 rounded-lg shadow-lg w-[175px] z-50`}
                >
                  <ul>
                    {models.map((m) => (
                      <li
                        key={m}
                        className="px-5 py-2 cursor-pointer"
                        onClick={() => handleModelClick(m)}
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="relative flex justify-between items-center w-full">
            <p>Appearance</p>
            <div>
              <button
                className={`${
                  mode === "dark"
                    ? "bg-gray-selected text-white-answer"
                    : "bg-[#CFCFCF] text-gray"
                } py-2 px-4 rounded-lg shadow-md hover:brightness-90 transition-all duration-300 w-[175px]`}
                onClick={() => (
                  setShowAppearanceDropdown((prev) => !prev),
                  setShowModelDropdown(false)
                )}
              >
                {appearance.charAt(0).toUpperCase() + appearance.slice(1)}
              </button>
              {showAppearanceDropdown && (
                <div
                  className={`absolute mt-2 ${
                    mode === "dark"
                      ? "bg-gray-selected text-white-answer"
                      : "bg-[#CFCFCF] text-gray"
                  } py-2 rounded-lg shadow-lg w-[175px] z-50`}
                >
                  <ul>
                    {appearanceOptions.map((o) => (
                      <li
                        key={o}
                        className="px-5 py-2 cursor-pointer"
                        onClick={() => handleAppearanceClick(o)}
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleRestoreSettings}
            style={{ backgroundColor: selectedColor }}
            className="p-2 rounded-lg px-4 flex justify-center items-center w-full duration-300 text-white-answer"
          >
            Restore Settings
          </button>
        </div>
      </div>
    </div>
  );
};
