"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IArticle } from "@/utils/types";
import Link from "next/link";
import { Filter } from "./setting";
import { Row } from "@tanstack/react-table";
import { useDeleteArticle } from "@/services/article";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

interface TableProps<IArticle> {
  data: IArticle[] | [];
  refetchHandler: (row?: Row<IArticle>) => void;
}

export default function Table({ data, refetchHandler }: TableProps<IArticle>) {
  const [delHandler, delLoading] = useDeleteArticle();
  const columns = React.useMemo<ColumnDef<IArticle, any>[]>(
    () => [
      {
        accessorKey: "title",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => info.getValue(),
        header: () => <span>date</span>,
      },
      {
        accessorKey: "action",
        id: "action",
        cell: ({ row }) => (
          <div className="flex justify-evenly">
            <button onClick={() => handleButtonClick(row)}>edit</button>
            <button onClick={() => handleButtonDelete(row)}>delete</button>
          </div>
        ),
        enableColumnFilter: false, // 禁用筛选器
      },
    ],
    []
  );
  const handleButtonClick = (row: Row<IArticle>) => {
    refetchHandler(row);
  };
  const handleButtonDelete = (row: Row<IArticle>) => {
    delHandler(row.original.id, refetchHandler);
  };
  const rerender = React.useReducer(() => ({}), {})[1];
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data: data ? data : [],
    columns,
    state: {
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="border-sky-500 border-1">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-sky-500">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="py-4 px-10  text-center text-white text-xl font-extrabold"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="w-full text-black text-xl mt-4">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="bg-sky-600 ">
                {row.getVisibleCells().map((cell, index) => {
                  if (index == 0) {
                    return (
                      <td
                        key={cell.id}
                        className="px-4 py-2 border-none text-center text-white  text-sm font-extrabold"
                      >
                        <Link href={`/articleList/articles/${row.original.id}`}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Link>
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={cell.id}
                        className="px-4 py-2 border-none text-center text-white  text-sm font-extrabold"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
          refetchHandler(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            一页需要展示的数量: {pageSize}
          </option>
        ))}
      </select> */}
    </div>
  );
}
