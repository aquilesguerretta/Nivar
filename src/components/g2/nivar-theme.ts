import { createContext, useContext } from "react";

export const NivarThemeContext = createContext(false);
export const useNivarTheme = () => useContext(NivarThemeContext);
