import { body } from "express-validator";

const onboardingValidations = {
  updateBasic: [
    body("birthDate")
      .isISO8601()
      .withMessage("Birth date must be a valid ISO date (YYYY-MM-DD)."),
    body("gender")
      .isIn(["MALE", "FEMALE"])
      .withMessage("Gender must be MALE , or FEMALE"),
  ],
  updatePreferences: [
    body("preferences")
      .isArray()
      .withMessage("Preferences must be an array of strings")
      .bail()
      .custom((arr) => arr.length > 0)
      .withMessage("Preferences array must not be empty")
      .bail()
      .custom((arr) => arr.every((p) => typeof p === "string"))
      .withMessage("Each preference must be a string"),
  ],
  updateLocation: [
    body("governorate")
      .trim()
      .isIn([
        "CAIRO",
        "GIZA",
        "ALEXANDRIA",
        "ASWAN",
        "LUXOR",
        "QALYUBIA",
        "SHARQIA",
        "GHARBIA",
        "FAIYUM",
        "BENI_SUEF",
        "MINYA",
        "ASSIUT",
        "SOHAG",
        "QENA",
        "RED_SEA",
        "SOUTH_SINAI",
        "NORTH_SINAI",
        "NEW_VALLEY",
        "DAMIETTA",
        "DAKAHLIA",
        "PORT_SAID",
        "SUEZ",
        "ISMAILIA",
        "MENOUFIA",
        "KAFR_EL_SHEIKH",
        "BEHEIRA",
        "MATROUH",
      ])
      .withMessage("Invalid governorate value"),
  ],
};

export default onboardingValidations;
