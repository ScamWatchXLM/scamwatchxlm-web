import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableSkeleton } from "@/components/shared/loading-skeletons"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows?: T[]
  rowKey: (row: T) => string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your filters or search terms.",
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) return <TableSkeleton columns={columns.length} />
  if (isError) return <ErrorState onRetry={onRetry} />
  if (!rows || rows.length === 0)
    return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
