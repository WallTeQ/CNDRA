// const TOKEN_KEY = "auth_token";
// const TEMP_TOKEN_KEY = "temp_auth_token";
// let forceLogout = false;

// // In-memory token storage
// let authToken: string | null = null;
// let tempAuthToken: string | null = null;

// export const tokenManager = {
//   getToken: (): string | null => authToken,
//   getTempToken: (): string | null => tempAuthToken,
//   setToken: (token: string): void => {
//     authToken = token;
//   },
//   setTempToken: (token: string): void => {
//     tempAuthToken = token;
//   },
//   removeToken: (): void => {
//     authToken = null;
//   },
//   removeTempToken: (): void => {
//     tempAuthToken = null;
//   },
//   clearAll: (): void => {
//     authToken = null;
//     tempAuthToken = null;
//   },
// };

// export const setForceLogout = (value: boolean) => {
//   forceLogout = value;
// };

// export const getForceLogout = () => forceLogout;

// export const forceUserLogout = () => {
//   if (!forceLogout) {
//     setForceLogout(true);
//     tokenManager.clearAll();
//     window.location.href = "/login";
//   }
// };



// Token management
const TOKEN_KEY = "auth_token";
const TEMP_TOKEN_KEY = "temp_auth_token";
let forceLogout = false;

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

export const setForceLogout = (value: boolean) => {
  forceLogout = value;
};

export const forceUserLogout = () => {
  if (!forceLogout) {
    setForceLogout(true);
    tokenManager.clearAll();
    window.location.href = "/login";
  }
};