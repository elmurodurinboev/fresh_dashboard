import Api from "@/utils/api.js";

export const AuthService = {
  async login(payload) {
    const {data: {data}} = await Api.post('/login', payload)
    return data
  },

  getAuthSession() {
    try {
      const data = JSON.parse(localStorage.getItem("auth-session"))
      return data
    } catch (e) {
      console.log(e)
    }
  },

  setAuthSession(data) {
    localStorage.setItem("auth-session", JSON.stringify(data))
  },

  logoutAuth() {
    localStorage.removeItem("auth-session")
  }
}