
//import { z } from "zod"
import { DataTable } from "../core/data-table"
import getColumns from "./columns"
//import { schema } from "../data/schema"
import { statuses, priorities } from "../data/enums"
import { t } from "i18next"

function getData(props) {
  return props.data
  //return z.array(schema).parse(data)
}

export default function DataTableTanStack(props) {
  //const tasks = await getTasks()
  const data = getData(props)

  let metadata = [
    {
      name: "status",
      title: t("Status"),
      data: statuses
    },
    {
      name: "priority",
      title: t("Priority"),
      data: priorities
    }
  ]

  return (
    <>
      {/*<DataTable data={data} columns={columns} metadata={metadata} viewMode="compact2" />*/}
      <DataTable {...props} columns={getColumns(props.operations)} metadata={metadata} viewMode="compact1" />
    </>
  )
}
