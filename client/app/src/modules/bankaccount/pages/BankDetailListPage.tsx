import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import DialogBox from "@/components/dialog-box"
import CreateBankAccountForm from "../components/create-bank-detail-form"
import UpdateBankAccountFrom from "../components/update-bank-detail-form"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { FormInput } from "@/components/form-input"
import { setCurrentPage, setTotalItems, setTotalPages } from "@/redux/slices/paginationSlice"
import BankDetailsTable from "../components/bank-detail-table"
import Paggination from "@/components/pagination-component"
import Loader from "@/components/loader"
import { useGetBankDetail } from "../apis/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BankDetailListPage = () => {
  const dispatch = useAppDispatch()
  const { currentPage, itemPerPage, totalPages } = useAppSelector((state) => state.pagination)

  const [openCreateDialog, setCreateOpenDialog] = useState(false)
  const [openUpdateDialog, setUpdateOpenDialog] = useState(false)
  const [selectedBankDetailId, setSelectedBankDetailId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [debouncedSearch, dispatch])

  const onOpenUpdate = (bankDetailsId: string) => {
    setSelectedBankDetailId(bankDetailsId)
    setUpdateOpenDialog(true)
  }


  const { data, isLoading } = useGetBankDetail(currentPage, itemPerPage, debouncedSearch)

  useEffect(() => {
    if (data?.count == null) return

    const pages = Math.max(1, Math.ceil(data.count / itemPerPage))
    dispatch(setTotalPages(pages))

    if (currentPage > pages) dispatch(setCurrentPage(pages))
  }, [dispatch, data?.count, itemPerPage, currentPage, itemPerPage])

  const list = data?.data ?? []

  const getContent = () => {
    if (isLoading) return <Loader />

    return (
      <>
        <BankDetailsTable
          data={list}
          onOpenUpdate={(id: string) => onOpenUpdate(id)}
          emptyText={debouncedSearch ? "No matching bank accounts found" : "No records found"}
        />

        <div className="flex">
          <h1 className="text-sm font-bold">Total : {data.count}</h1>
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
        <h1 className="text-xl font-bold">All Bank Accounts</h1>
        <div className="flex justify-end items-center gap-2">
          <Button onClick={() => setCreateOpenDialog(true)}>Create Bank Account</Button>
          <FormInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search account number, name, bank, swiftcode..."
            className="max-w-sm"
          />
        </div>
      </div>

      {getContent()}

      <DialogBox
        open={openCreateDialog}
        setOpen={setCreateOpenDialog}
        title="Create Bank Account"
        children={<CreateBankAccountForm setOpen={() => setCreateOpenDialog(false)} />}
      />

      <DialogBox
        open={openUpdateDialog}
        setOpen={setUpdateOpenDialog}
        title="Update Bank Account"
        children={
          <UpdateBankAccountFrom
            setOpen={() => setUpdateOpenDialog(false)}
            bankDetailId={selectedBankDetailId as string}
          />
        }
      />
    </div>
  )
}

export default BankDetailListPage