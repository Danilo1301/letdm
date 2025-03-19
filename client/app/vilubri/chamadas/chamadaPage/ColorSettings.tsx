import { createContext } from "react";
import { ThemeJSON } from "../../../../../src/vilubri/Theme";

export interface ColorSettingsContextType {
  theme: ThemeJSON;
  setTheme: (colorSettings: Partial<ThemeJSON>) => void;
}

export const defaultTheme: ThemeJSON = {
  navColor: '#F1B201',
  dateColor: '#E5C703',
  backgroundColor: '#EEEEEE',
  itemColor: '#DADADA'
}

export const ThemeContext = createContext<ColorSettingsContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});