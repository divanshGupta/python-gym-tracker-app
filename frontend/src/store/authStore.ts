// simple vanilla store - no Redux needed for this scale
const authStore = {
    getToken: () => localStorage.getItem("access_token"),
    setToken: (token: any) => localStorage.setItem("access_token", token),
    removeToken: () => localStorage.removeItem("access_token"),
    isLoggedIn: () => localStorage.getItem("access_token"),
}

export default authStore