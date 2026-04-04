import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"


interface dialogBoxProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    description?: string
    children?: React.ReactNode
}


const DialogBox: React.FC<dialogBoxProps> = ({ open, setOpen, title, description, children }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-4xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {children}

            </DialogContent>
        </Dialog>
    )
}

export default DialogBox
