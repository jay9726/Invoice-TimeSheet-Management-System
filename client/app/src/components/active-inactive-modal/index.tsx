import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'


interface activeinactivemodalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    confirmAction: () => void
}

const ActiveInactiveModal: React.FC<activeinactivemodalProps> = ({ open, setOpen, confirmAction }) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to Change <br /> Status (Active/Inactive) ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={confirmAction}
                    >
                        Change Status
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ActiveInactiveModal