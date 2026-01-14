const TOKEN_KEY = "auth_token";
const TEMP_TOKEN_KEY = "temp_auth_token";

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getTempToken: (): string | null => localStorage.getItem(TEMP_TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  setTempToken: (token: string): void =>
    localStorage.setItem(TEMP_TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  removeTempToken: (): void => localStorage.removeItem(TEMP_TOKEN_KEY),
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TEMP_TOKEN_KEY);
  },
};