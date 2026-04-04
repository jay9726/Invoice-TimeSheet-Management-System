import type React from "react";
import { CUSTOME_ICONS, LUCIDE_ICONS } from "./utils";


type CustomeIcom = keyof typeof CUSTOME_ICONS
type lucideIcon = keyof typeof LUCIDE_ICONS

type allIcon = CustomeIcom | lucideIcon


export interface mergeIcon extends React.SVGProps<SVGSVGElement> {
    name: allIcon
}


const Icon = ({ name, ...props }: mergeIcon) => {

    const IconComponent = CUSTOME_ICONS[name as keyof typeof CUSTOME_ICONS]

    const LucideIconComponent = LUCIDE_ICONS[name as keyof typeof LUCIDE_ICONS]

    if (IconComponent) return <IconComponent {...props} />
    if (LucideIconComponent) return <LucideIconComponent {...props} />

    return null;
}

export default Icon;