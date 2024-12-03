import {AuthService} from "@/services/auth.service.js";

export const useAuth = () => {
  const session = AuthService.getAuthSession()

  const setSession = (data) => {
    console.log("Session Changed")
    return AuthService.setAuthSession(data)
  }

  return {session, setSession}
}