import { Button } from "@/components/ui/button";
import CreateTaskActivityForm from "../components/create-taskActivity-form";
import { useState } from "react";
import DialogBox from "@/components/dialog-box";
import WorkLogTable from "../components/work-log-table";

const CreateTaskActivityPage = () => {

    const [openCreateDialog, setCreateOpenDialog] = useState(false)

    return (
        <div className="w-full flex flex-col gap-2 px-4 ">
            <h1 className="text-xl font-bold"> Submit Work Logs </h1>
            <div className="flex justify-end items-center mb-2">
                <Button onClick={() => setCreateOpenDialog(true)}>+</Button>
            </div>

            <WorkLogTable />

            <DialogBox
                open={openCreateDialog}
                setOpen={setCreateOpenDialog}
                title="Create Log"
                children={<CreateTaskActivityForm setOpen={setCreateOpenDialog} />}
            />
        </div>
    )
}

export default CreateTaskActivityPage;
