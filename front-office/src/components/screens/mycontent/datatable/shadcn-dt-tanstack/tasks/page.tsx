import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { DataTable } from "../core/data-table"
import { t } from "i18next"

import { columns } from "./columns"
import mydata from "../data/tasks.json"
import { schema } from "../data/schema"
import { statuses, priorities } from "../data/enums"

/*
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}
*/
// Simulate a database read for tasks.
function getData() {
//async function getTasks() {
    //const data = await fs.readFile(
  //  path.join(process.cwd(), "app/examples/tasks/data/tasks.json")
  //)

//  const tasks = JSON.parse(data.toString())
  const data = mydata

  return z.array(schema).parse(data)
}

//export default async function TaskPage() {
export default function DataTableTanStack() {
  //const tasks = await getTasks()
  const data = getData()

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
      <DataTable data={data} columns={columns} metadata={metadata} viewMode="compact2" />
    </>
  )
}
