const TOKEN_KEY = "auth_token";
const TEMP_TOKEN_KEY = "temp_auth_token";
let forceLogout = false;

// In-memory token storage
let authToken: string | null = null;
let tempAuthToken: string | null = null;

export const tokenManager = {
  getToken: (): string | null => authToken,
  getTempToken: (): string | null => tempAuthToken,
  setToken: (token: string): void => {
    authToken = token;
  },
  setTempToken: (token: string): void => {
    tempAuthToken = token;
  },
  removeToken: (): void => {
    authToken = null;
  },
  removeTempToken: (): void => {
    tempAuthToken = null;
  },
  clearAll: (): void => {
    authToken = null;
    tempAuthToken = null;
  },
};

export const setForceLogout = (value: boolean) => {
  forceLogout = value;
};

export const getForceLogout = () => forceLogout;

export const forceUserLogout = () => {
  if (!forceLogout) {
    setForceLogout(true);
    tokenManager.clearAll();
    window.location.href = "/login";
  }
};
