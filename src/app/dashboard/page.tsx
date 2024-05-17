"use client"
import * as React from 'react'
import TemporaryDrawer from '@/components/drawer';
import { client } from "@/utils/apollo";
import './index.css'

import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    RowData,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Button, SwipeableDrawer } from '@mui/material'
import { useQuery } from '@apollo/client';
import { GET_ARTICLES } from '@/graphql/article';
import { IArticle } from '@/utils/types';
import { useArticles } from '@/services/article';
import Link from 'next/link';

//TData

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}




export default function App() {
    const columns = React.useMemo<ColumnDef<IArticle, any>[]>(
        () => [
            {
                accessorKey: 'title',
                cell: info => info.getValue(),
            },
            {
                accessorFn: row => row.date,
                id: 'date',
                cell: info => info.getValue(),
                header: () => <span>date</span>,
            },
        ],
        []
    )
    const rerender = React.useReducer(() => ({}), {})[1]
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )


    const [curId, setCurId] = React.useState<string>('');
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [pageNum, setPageNum] = React.useState<number>(1);
    const [open, _setOpen] = React.useState(() => false)
    const openProject = () => {
        _setOpen(true)
    }
    const closeAndRefetchHandler = (isReload?: boolean) => {
        if (isReload) {
            refetch({});
        }
    };
    const {
        loading, data, page, refetch,
    } = useArticles(pageNum, pageSize);
    React.useEffect(() => {
        console.log('打撒所多大所', data)
    }, [])
    const table = useReactTable({
        data: data ? data : [],
        columns,
        state: {
            columnFilters,
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
    })

    return (
        <div className="p-2 w-full">
            <table className='w-full'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell, index) => {
                                    if (index == 0) {
                                        return (
                                            <td key={cell.id}>
                                                <Link href={`/dashboard/articles/${row.original.id}`}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </Link>
                                            </td>
                                        )
                                    } else {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    }

                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))

                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            {/* <div>{table.getPrePaginationRowModel().rows.length} Rows</div> */}
            {/* <div>
                <button onClick={() => rerender()}>Force Rerender</button>
            </div> */}
            <TemporaryDrawer id='' onClose={closeAndRefetchHandler}></TemporaryDrawer>
            {/* <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div> */}
            {/* <pre>
                {JSON.stringify(
                    { columnFilters: table.getState().columnFilters },
                    null,
                    2
                )}
            </pre> */}

        </div>
    )
}
function ref<T>(arg0: never[]) {
    throw new Error("Function not implemented.");
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {}

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = React.useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys())
                    .sort()
                    .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ''
                        }`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
                        ? `(${column.getFacetedMinMaxValues()?.[1]})`
                        : ''
                        }`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            {sortedUniqueValues.map(value => (
                //dynamically generated select options from faceted values feature
                <option value={value} key={value}>
                    {value}
                </option>
            ))}
        </select>
    ) : (
        <>
            {/* Autocomplete suggestions from faceted values feature */}
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

