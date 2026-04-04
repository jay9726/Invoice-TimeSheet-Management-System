import { useEffect, useState } from "react"
import DialogBox from "@/components/dialog-box"
import CreateCompanyForm from "../components/create-company-form"
import UpdateCompanyForm from "../components/update-compnay-form"
import Paggination from "@/components/pagination-component"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setCurrentPage, setTotalItems, setTotalPages } from "@/redux/slices/paginationSlice"
import { useGetCompany } from "../apis/queries"
import Loader from "@/components/loader"
import { FormInput } from "@/components/form-input"
import { Button } from "@/components/ui/button"
import CompanyTable from "../components/company-table"
import { useDebounce } from "@/hooks/useDebounce"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CompanyListPage = () => {
  const dispatch = useAppDispatch()
  const { currentPage, itemPerPage, totalPages } = useAppSelector((state: any) => state.pagination)

  const [openCreateDialog, setCreateOpenDialog] = useState(false)
  const [openUpdateDialog, setUpdateOpenDialog] = useState(false)

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [debouncedSearch, dispatch])

  const onOpenUpdate = (companyId: string) => {
    setSelectedCompanyId(companyId)
    setUpdateOpenDialog(true)
  }

  const { data, isLoading } = useGetCompany(currentPage, itemPerPage, debouncedSearch)

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
        <CompanyTable
          data={list}
          onOpenUpdate={(id: string) => onOpenUpdate(id)}
          emptyText={debouncedSearch ? "No matching companies found" : "No records found"}
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
        <h1 className="text-xl font-bold text-secondary">All Companies</h1>
        <div className="flex justify-end items-center gap-2">
          <Button onClick={() => setCreateOpenDialog(true)}>Create Company</Button>
          <FormInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, address, city, state, zip..."
            className="max-w-sm"
          />
        </div>
      </div>

      {getContent()}

      <DialogBox
        open={openCreateDialog}
        setOpen={setCreateOpenDialog}
        title="Create Company"
        children={<CreateCompanyForm setOpen={() => setCreateOpenDialog(false)} />}
      />

      <DialogBox
        open={openUpdateDialog}
        setOpen={setUpdateOpenDialog}
        title="Update Company"
        children={
          <UpdateCompanyForm
            setOpen={() => setUpdateOpenDialog(false)}
            companyId={selectedCompanyId as string}
          />
        }
      />
    </div>
  )
}

export default CompanyListPage