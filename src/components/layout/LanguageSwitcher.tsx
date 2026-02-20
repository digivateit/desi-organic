import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="gap-2 w-auto px-2">
                    <Languages className="h-5 w-5" />
                    <span className="hidden sm:inline text-xs font-semibold uppercase">
                        {i18n.language.split("-")[0]}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")} className="gap-2">
                    <span className={i18n.language.startsWith("en") ? "font-bold text-primary" : ""}>
                        {t("common.english")}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("bn")} className="gap-2">
                    <span className={i18n.language.startsWith("bn") ? "font-bold text-primary" : ""}>
                        {t("common.bengali")}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
