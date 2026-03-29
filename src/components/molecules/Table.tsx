"use client"

import cn from "classnames"
import { TableProperties } from "lucide-react"
import type { ReactNode } from "react"

export type TableColumn<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  headerClassName?: string
  cellClassName?: string | ((row: T) => string)
}

type TableProps<T> = {
  data: T[]
  columns: TableColumn<T>[]
  title?: ReactNode
  noDataMessages?: {
    title?: ReactNode
    subtitle?: ReactNode
  }
  onRowClick?: (row: T) => void
  getRowKey?: (row: T, index: number) => string | number
}

export function Table<T>({
  data,
  columns,
  title,
  noDataMessages,
  onRowClick,
  getRowKey,
}: TableProps<T>): React.ReactElement {
  const emptySubtitle = noDataMessages?.subtitle ?? noDataMessages?.subtitle

  return (
    <div className="rounded-3xl border border-border bg-surface">
      {title ? (
        <div className="border-b border-border px-6 py-5">
          <p className="text-sm text-muted">{title}</p>
        </div>
      ) : null}

      {data.length === 0 && noDataMessages ? (
        <div className="p-10 text-center">
          <TableProperties className="mx-auto h-10 w-10 text-accent" />
          {noDataMessages.title ? (
            <h2 className="mt-5 text-2xl font-black tracking-tight">
              {noDataMessages.title}
            </h2>
          ) : null}
          {emptySubtitle ? (
            <p className="mt-3 text-sm text-muted">{emptySubtitle}</p>
          ) : null}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.22em] text-muted">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-4 font-medium",
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {data.map((row, index) => (
                <tr
                  key={getRowKey?.(row, index) ?? index}
                  className={cn(
                    "transition-colors hover:bg-surface-elevated/60",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-6 py-4",
                        typeof column.cellClassName === "function"
                          ? column.cellClassName(row)
                          : column.cellClassName,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
