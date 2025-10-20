import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  language: "vi" as "vi" | "en",
};


const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"vi" | "en">) => {
      state.language = action.payload;
      localStorage.setItem("language", state.language);
      document.cookie = `NEXT_LOCALE=${state.language}; path=/;`;
      
    },
    toggleLanguage: (state) => {
      state.language = state.language === "vi" ? "en" : "vi";
      localStorage.setItem("language", state.language);
      document.cookie = `NEXT_LOCALE=${state.language}; path=/;`;

    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
