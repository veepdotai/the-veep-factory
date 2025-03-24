import { Logger } from 'react-logger-lib'
import { DataTable } from "../core/data-table"


interface DataTableProps {
  data: any[],
  operations: any[],
  viewMode: "compact1" | "compact2",
  columns: Function
}

export default function DataTableTanStack(props: DataTableProps) {
  const log = Logger.of(DataTableTanStack.name)

  let columns = props.columns(props.operations)
  let metadata = columns
                  .filter((row) => row?.fieldType == "enum")
                  .map((row) => {
                    return {name: row.name, title: row.title, data: row.data}
                  })

  log.trace("metadata:", metadata)

  return (
    <>
      {/*<DataTable data={data} columns={columns} metadata={metadata} viewMode="compact2" />*/}
      <DataTable {...props} columns={columns} metadata={metadata} viewMode="compact1" />
    </>
  )
}
