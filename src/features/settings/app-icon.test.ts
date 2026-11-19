import { describe, expect, it, jest } from "@jest/globals";
import { setIcon } from "react-native-app-icon-changer";

import { changeAppIcon, loadAppIcon, nativeIconName } from "./app-icon";

// The native module and the kv-store only exist in the app.
jest.mock("react-native-app-icon-changer", () => ({ setIcon: jest.fn() }));
jest.mock("expo-sqlite/kv-store", () => {
  const values = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (key: string) => values.get(key) ?? null,
      setItemSync: (key: string, value: string) => {
        values.set(key, value);
      },
    },
  };
});

const setIconMock = jest.mocked(setIcon);

describe("nativeIconName", () => {
  it("names orange as the default icon and the rest by their alias", () => {
    expect(nativeIconName("orange")).toBe("Default");
    expect(nativeIconName("blue")).toBe("Blue");
    expect(nativeIconName("amber")).toBe("Amber");
  });
});

describe("changeAppIcon", () => {
  it("starts from the default icon", () => {
    expect(loadAppIcon()).toBe("orange");
  });

  it("switches to the icon's alias and keeps the choice", async () => {
    setIconMock.mockResolvedValueOnce(undefined);
    await changeAppIcon("pink");
    expect(setIconMock).toHaveBeenLastCalledWith("Pink");
    expect(loadAppIcon()).toBe("pink");
  });

  it("keeps the choice when the icon is already the active one", async () => {
    setIconMock.mockRejectedValueOnce(new Error("ICON_ALREADY_USED"));
    await changeAppIcon("green");
    expect(loadAppIcon()).toBe("green");
  });
});
