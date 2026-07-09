import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationBarProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationBarProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  if (pageCount <= 1) return null

  const pages = getVisiblePages(page, pageCount)

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
      <p className="text-muted-foreground text-sm">
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <span className="text-muted-foreground px-2">…</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < pageCount) onPageChange(page + 1)
              }}
              className={page === pageCount ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1
  const range: (number | "ellipsis")[] = []
  const rangeWithDots: (number | "ellipsis")[] = []
  let last: number | undefined

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (typeof i === "number" && last !== undefined) {
      if (i - last === 2) rangeWithDots.push(last + 1)
      else if (i - last > 2) rangeWithDots.push("ellipsis")
    }
    rangeWithDots.push(i)
    if (typeof i === "number") last = i
  }

  return rangeWithDots
}
