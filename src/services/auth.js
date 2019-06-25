export const TOKEN_KEY = "token";
export const USER_FIELD = "user";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const saveUserData = (data) => localStorage.setItem(USER_FIELD, JSON.stringify(data));
export const getUserData = () => localStorage.getItem(USER_FIELD);
export const removeUserData = () => localStorage.removeItem(USER_FIELD);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const logout = () => localStorage.removeItem(TOKEN_KEY);
export const login = (token) => localStorage.setItem(TOKEN_KEY, token);