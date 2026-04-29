// simple vanilla store - no Redux needed for this scale
const authStore = {
    getToken: () => localStorage.getItem("access_token"),
    setToken: (token: string) => localStorage.setItem("access_token", token),
    removeToken: () => localStorage.removeItem("access_token"),
    isLoggedIn: (): boolean => !!localStorage.getItem("access_token"),
}

export default authStore