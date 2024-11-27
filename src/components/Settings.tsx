/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { SettingsComponentType, SettingsType } from "../types";

export const Settings = ({
  setShowSettings,
  selectedColor,
  setSelectedColor,
  appearance,
  setAppearance,
  model,
  setModel,
  mode,
}: SettingsComponentType) => {
  /* --------- OPTIONS ------ */

  const colors = ["#5645ee", "#dc2626", "#ca8a04", "#2563eb", "#16a34a"];
  const models = [
    "llama3-8b-8192",
    "llama3-70b-8192",
    "llama-3.2-1b-preview",
    "llama-3.2-3b-preview",
    "mixtral-8x7b-32768",
  ];
  const appearanceOptions = ["System", "Dark", "Light"];

  /* --------- STATES ------ */

  // dropdown states
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);
  const [showAppearanceDropdown, setShowAppearanceDropdown] = useState<boolean>(false);

  // get saved settings
  const [settings, setSettings] = useState<SettingsType | null>(() => {
    const storedSettings = localStorage.getItem("settings");
    return storedSettings ? JSON.parse(storedSettings) : null;
  });

  /* --------- EFFECTS ------ */

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

  /* --------- FUNCTIONS ------ */

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
      className={`w-[300px] min-[450px]:w-[375px] min-[650px]:w-[500px] min-[2000px]:w-[700px] min-[2000px]:text-2xl max-[651px]:text-sm ${
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
        <p className="font-semibold text-lg min-[2000px]:text-2xl">Settings</p>
        <svg
          onClick={() => (
            setShowSettings(false),
            setShowAppearanceDropdown(false),
            setShowModelDropdown(false)
          )}
          className="size-6 min-[2000px]:size-8 fill-[#aaa] cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </div>

      <div className="mt-4 min-[2000px]:mt-5 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <p>Page color</p>
          <div className="flex items-center gap-x-2 w-[150px] min-[650px]:w-[175px] min-[2000px]:w-[230px]">
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
                } size-6 min-[650px]:size-7 min-[2000px]:size-10 flex rounded-full cursor-pointer duration-300`}
              ></span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-y-3">
          <div className="relative flex justify-between items-center w-full">
            <p className="flex items-center gap-x-1">
              Model {window.innerWidth >= 450 && "*"} <span className="max-[450px]:hidden text-[10px] max-[651px]:pr-1 leading-3 min-[650px]:text-xs min-[2000px]:text-sm min-[2500px]:text-base">(applied to new chats)</span>
            </p>
            <div>
              <button
                className={`${
                  mode === "dark"
                    ? "bg-gray-selected text-white-answer"
                    : "bg-[#CFCFCF] text-gray"
                } py-2 px-4 min-[2000px]:py-4 rounded-lg shadow-md hover:brightness-90 transition-all duration-300 w-[150px] min-[650px]:w-[175px] min-[2000px]:w-[230px] min-[2000px]:text-2xl truncate`}
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
                  } py-2 rounded-lg shadow-lg w-[150px] min-[650px]:w-[175px] min-[2000px]:w-[230px] min-[2000px]:text-2xl z-50`}
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
                } py-2 px-4 min-[2000px]:py-4 rounded-lg shadow-md hover:brightness-90 transition-all duration-300 w-[150px] min-[650px]:w-[175px] min-[2000px]:w-[230px] min-[2000px]:text-2xl`}
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
                  } py-2 rounded-lg shadow-lg w-[150px] min-[650px]:w-[175px] min-[2000px]:w-[230px] min-[2000px]:text-2xl z-50`}
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
          <p className="text-xs">{window.innerWidth >= 450 && "* applied to new chats"}</p>
          <button
            onClick={handleRestoreSettings}
            style={{ backgroundColor: selectedColor }}
            className="p-2 min-[2000px]:p-3 rounded-lg px-4 flex justify-center items-center w-full duration-300 text-white-answer min-[2000px]:mt-2"
          >
            Restore Settings
          </button>
        </div>
      </div>
    </div>
  );
};
