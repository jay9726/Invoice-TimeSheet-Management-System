import { ArrowLeft, Building, Building2, CheckCircle2, CircleUser, ClipboardList, Clock3, Download, Eye, File, IndianRupee, LockKeyhole, MailIcon, Pencil, ReceiptText, ScrollText, Send, SquareCheck, SquareX, Trash2, Users, X, XCircle } from "lucide-react";
import ApprovedIcon from "./approved-icon";
import DraftIcon from "./draft-icon";
import RejectedIcon from "./rejected-icon";
import SubmittedIcon from "./submitted-icon";

export const CUSTOME_ICONS = {
    approvalIcon: ApprovedIcon,
    rejectedIcon: RejectedIcon,
    draftIcon: DraftIcon,
    submitIcon: SubmittedIcon
}

export const LUCIDE_ICONS = {
    mail: MailIcon,
    password: LockKeyhole,
    delete: Trash2,
    update: Pencil,
    leftArrow: ArrowLeft,
    download: Download,
    openEye: Eye,
    X: X,
    profile: CircleUser,
    timeSheet: ClipboardList,
    send: Send,
    approved: CheckCircle2,
    rejected: XCircle,
    clock : Clock3,
    users : Users,
    building : Building,
    timsheet : ScrollText,
    buildings : Building2,
    generated : File,
    finalized : ReceiptText,
    paid : IndianRupee,
    squarecheck : SquareCheck,
    squareUnCheck:  SquareX
}