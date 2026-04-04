import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import DialogBox from "@/components/dialog-box"
import CreateUserForm from "../components/create-user-form"
import UpdateUserForm from "../components/update-user-form"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { FormInput } from "@/components/form-input"
import { setCurrentPage, setTotalItems, setTotalPages } from "@/redux/slices/paginationSlice"
import EmployeeTable from "../components/employee-table"
import Loader from "@/components/loader"
import Paggination from "@/components/pagination-component"
import { useGetAllEmployee } from "../apis/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const UserListPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const { currentPage, itemPerPage, totalPages } = useAppSelector((state) => state.pagination)

    const [openCreateDialog, setCreateOpenDialog] = useState(false)
    const [openUpdateDialog, setUpdateOpenDialog] = useState(false)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)

    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        dispatch(setCurrentPage(1))
    }, [debouncedSearch, dispatch])

    const onOpenUpdate = (employeeId: string) => {
        setSelectedEmployeeId(employeeId)
        setUpdateOpenDialog(true)
    }

    const { data, isLoading } = useGetAllEmployee(
        currentPage,
        itemPerPage,
        debouncedSearch
    )

    useEffect(() => {
        if (data?.count == null) return
        const pages = Math.max(1, Math.ceil(data.count / itemPerPage))
        dispatch(setTotalPages(pages))
    }, [dispatch, data?.count, itemPerPage, itemPerPage])

    const list = data?.data ?? []

    const getContent = () => {
        if (isLoading) return <Loader />

        return (
            <>
                <EmployeeTable
                    data={list}
                    onOpenUpdate={(id: string) => onOpenUpdate(id)}
                    emptyText={debouncedSearch ? "No matching users found" : "No records found"}
                />

                <div className="flex">
                    <h1 className="text-sm font-bold text-secondary">Total : {data?.count}</h1>
                    <Paggination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        setCurrentPage={(page: number) => dispatch(setCurrentPage(page))}
                    />
                    <div>
                        <Select defaultValue={itemPerPage.toString()} onValueChange={(value: string) => dispatch(setTotalItems(Number(value)))}>
                            <SelectTrigger className="min-w-15">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 items-center">
                <h1 className="text-xl font-bold text-secondary">All Users</h1>
                <div className="flex justify-end items-center gap-2">
                    <Button onClick={() => setCreateOpenDialog(true)}>Create User</Button>
                    <FormInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Name, Email, Role..."
                        className="max-w-sm"
                    />
                </div>
            </div>

            {getContent()}

            <DialogBox
                open={openCreateDialog}
                setOpen={setCreateOpenDialog}
                title="Create User"
                children={<CreateUserForm setOpen={setCreateOpenDialog} />}
            />

            <DialogBox
                open={openUpdateDialog}
                setOpen={setUpdateOpenDialog}
                title="Update User"
                children={
                    <UpdateUserForm
                        setOpen={setUpdateOpenDialog}
                        employeeId={selectedEmployeeId as string}
                    />
                }
            />
        </div>
    )
}

export default UserListPage