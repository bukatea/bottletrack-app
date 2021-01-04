import { useContext, Context, createContext } from "react";

export interface AppContextType {
  isAuthenticated: boolean,
  userHasAuthenticated: (value: boolean) => void,
  email: string,
  setEmail: (value: string) => void,
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  userHasAuthenticated: () => void 0,
  email: "",
  setEmail: () => void 0,
});

export function useAppContext() {
  return useContext(AppContext);
}