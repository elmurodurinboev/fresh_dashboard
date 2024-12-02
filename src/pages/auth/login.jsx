import { Card } from "@/components/ui/card"
import { UserAuthForm } from "./components/user-auth-form"

export default function Login() {
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
