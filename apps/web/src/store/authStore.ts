const authStore = {
  getToken: (): string | null => localStorage.getItem("access_token"),
  setToken: (token: string): void => localStorage.setItem("access_token", token),
  removeToken: (): void => localStorage.removeItem("access_token"),
  isLoggedIn: (): boolean => !!localStorage.getItem("access_token"),
}

export default authStore