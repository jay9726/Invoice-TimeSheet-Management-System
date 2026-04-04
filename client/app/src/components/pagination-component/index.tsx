import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const Paggination = ({ totalPages, currentPage, setCurrentPage }: PaginationProps) => {
  const maxVisiblePages = 4;

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mx-auto space-x-2 text-sm font-medium">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Show first page and ellipsis if needed */}
          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
            </>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                className={cn("hover:bg-primary hover:text-white", currentPage === page ? "bg-primary text-white" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show ellipsis and last page if needed */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <PaginationItem><PaginationEllipsis /></PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}

            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paggination;
