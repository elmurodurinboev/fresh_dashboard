import {useNavigate} from "react-router-dom"
import {Button} from "@/components/custom/button"
import {cn} from "@/lib/utils"
import {useTranslations} from "use-intl"

export default function GeneralError({className, minimal = false}) {
    const navigate = useNavigate()
    const t = useTranslations("error")
    return (
        <div className={cn("h-svh w-full", className)}>
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                {!minimal && (
                    <h1 className="text-[5rem] font-bold leading-tight">Oops</h1>
                )}
                <span className="font-medium">{t("something_went_wrong")}</span>
                <p className="text-center text-muted-foreground">
                    {t.rich("wrong_desc", {br: () => <br/>})}
                </p>
                {!minimal && (
                    <div className="mt-6 flex gap-4">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            {t("go_back")}
                        </Button>
                        <Button onClick={() => navigate("/")}>{t("back_to_home")}</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
