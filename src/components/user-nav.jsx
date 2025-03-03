import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/custom/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "use-intl"
import {useAuth} from "@/hooks/utils/useAuth.js";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "@/services/auth.service.js";
import {useNavigate} from "react-router-dom";
import {toast} from "@/hooks/use-toast.js";

export function UserNav() {
  const t = useTranslations("userNav")
  const {session} = useAuth()

  const navigate = useNavigate()
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: AuthService.logoutAuth,
    onSuccess: () => {
      navigate("/auth/login")
      toast({
        description: "Logged Out"
      })
    }
  })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={"uppercase"}>{session && session.full_name ? session.full_name[0] : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session && session.full_name ? session.full_name : 'Unknown'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {
                session && session.phone_number && session.phone_number
              }
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {t("profile")}
          </DropdownMenuItem>

          <DropdownMenuItem>
            {t("settings")}
          </DropdownMenuItem>
          {/*<DropdownMenuItem>{t("new_team")}</DropdownMenuItem>*/}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutation.mutate()}>
          {t("log_out")}
          {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
