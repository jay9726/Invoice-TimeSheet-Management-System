import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia} from '../ui/alert-dialog'
import { Trash2Icon } from 'lucide-react'


interface confirmModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    confirmAction: () => void
}

const ConfirmModal: React.FC<confirmModalProps> = ({ open, setOpen, confirmAction }) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogDescription>
                        Are you sure you want to delete?
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
                        variant="destructive"
                        onClick={confirmAction}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal