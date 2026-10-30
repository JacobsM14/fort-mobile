import { describe, expect, it } from "@jest/globals";

import { profileBlanksFilledFrom } from "./profile";

const EMPTY = { heightCm: null, birthDate: null, gender: null } as const;
const FILLED = {
  heightCm: 180,
  birthDate: "1990-04-12",
  gender: "female",
} as const;

describe("profileBlanksFilledFrom", () => {
  it("takes every field of the file into an empty profile", () => {
    expect(profileBlanksFilledFrom(EMPTY, FILLED)).toEqual(FILLED);
  });

  it("never replaces what the profile already has", () => {
    const current = {
      heightCm: 175,
      birthDate: "1991-01-01",
      gender: "male",
    } as const;

    expect(profileBlanksFilledFrom(current, FILLED)).toEqual({});
  });

  it("fills only the fields that are empty", () => {
    const current = { ...EMPTY, heightCm: 175 };

    expect(profileBlanksFilledFrom(current, FILLED)).toEqual({
      birthDate: "1990-04-12",
      gender: "female",
    });
  });

  it("changes nothing when the file has no profile", () => {
    expect(profileBlanksFilledFrom(EMPTY, EMPTY)).toEqual({});
  });
});
