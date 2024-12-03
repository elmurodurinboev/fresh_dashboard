import { Card } from "@/components/ui/card"
import { UserAuthForm } from "./components/user-auth-form"
import {useAuth} from "@/hooks/utils/useAuth.js";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const session = useAuth()
  useEffect(() => {
    if (session && Object.keys(session).length !== 0 && session.user_id) {
      if (searchParams.has(`callbackUrl`)){
        navigate(searchParams.get(`callbackUrl`))
        return
      }
      navigate("/")
    }
  }, [navigate, session])
  return (
    <>
      <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-4xl font-medium">WeDrive Fresh</h1>
          </div>
          <Card className="p-6 space-y-4">
            <div className="">
              <h1 className="text-2xl font-semibold tracking-tight text-center">Login</h1>
            </div>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  )
}
