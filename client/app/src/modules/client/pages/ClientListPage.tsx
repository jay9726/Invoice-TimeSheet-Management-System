import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import DialogBox from "@/components/dialog-box"
import CreateClientForm from "../components/create-client-form"
import UpdateClientForm from "../components/update-client-form"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { FormInput } from "@/components/form-input"
import { setCurrentPage, setTotalItems, setTotalPages } from "@/redux/slices/paginationSlice"
import Loader from "@/components/loader"
import ClientTable from "../components/client-table"
import Paggination from "@/components/pagination-component"
import { useGetClient } from "../apis/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ClientListPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentPage, itemPerPage, totalPages } = useAppSelector((state) => state.pagination)

  const [openCreateDialog, setCreateOpenDialog] = useState(false)
  const [openUpdateDialog, setUpdateOpenDialog] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [debouncedSearch, dispatch])

  const onOpenUpdate = (clientId: string) => {
    setSelectedClientId(clientId)
    setUpdateOpenDialog(true)
  }

  const { data, isLoading } = useGetClient(
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
        <ClientTable
          data={list}
          onOpenUpdate={(id: string) => onOpenUpdate(id)}
          emptyText={debouncedSearch ? "No matching clients found" : "No records found"}
        />

        <div className="flex">
          <h1 className="text-sm font-bold">Total : {data?.count}</h1>

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
        <h1 className="text-xl font-bold">All Clients</h1>
        <div className="flex justify-end items-center gap-2">
          <Button onClick={() => setCreateOpenDialog(true)}>Create Client</Button>
          <FormInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, address, contact, city, state, zip..."
            className="max-w-sm"
          />
        </div>
      </div>

      {getContent()}

      <DialogBox
        open={openCreateDialog}
        setOpen={setCreateOpenDialog}
        title="Create Client"
        children={<CreateClientForm setOpen={setCreateOpenDialog} />}
      />

      <DialogBox
        open={openUpdateDialog}
        setOpen={setUpdateOpenDialog}
        title="Update Client"
        children={
          <UpdateClientForm setOpen={setUpdateOpenDialog} clientId={selectedClientId as string} />
        }
      />
    </div>
  )
}

export default ClientListPage