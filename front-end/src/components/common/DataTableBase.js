import { t } from 'i18next'
import PubSub from 'pubsub-js'

import { Button } from 'src/components/ui/shadcn/button'
import DataTableComponent from 'src/components/screens/mycontent/datatable/react-dtc/content/page'
import DataTableTanStack from 'src/components/screens/mycontent/datatable/shadcn-dt-tanstack/content/page'

import { Icons } from '@/constants/Icons'
import { cn } from '@/lib/utils'

//import { z } from "zod"
import getColumns from "./datatable/vcontents/columns"

function getData(props) {
	return props.data
	//return z.array(schema).parse(data)
}
  
function getDataTableContent(props, cns) {
	return (
		<>
			{ props?.dtViewType == "DTComponent" ?
				<DataTableComponent {...props}/>
				:
				<>
				<DataTableTanStack {...props} columns={getColumns} cns={cns}/>
				</>
			}
		</>
	)
}
function DataTableBase( props ) {

	//enum ViewTypeEnum {DTComponent, DTTanStack}
	let classNames = {
		"compact": {
			"cnForTableOuterContainer": "",
			"cnForTablePresentation": "p-4",
			"cnForTableToolbar": "px-4 py-2",
			"cnForTableFacets": "px-4 py-2",
			"cnForTableContainer": ""

		},
		"normal": {
			"cnForTableOuterContainer": "p-8",
			"cnForTablePresentation": "",
			"cnForTableToolbar": "",
			"cnForTableFacets": "",
			"cnForTableContainer": "rounded-md border"
		}
	}
	let dtViewType = "compact"
	let cns = classNames[dtViewType]
	
	function handleRefresh() {
		PubSub.publish( "CONTENTS_LIST_TO_REFRESH", null);
	}

	return (
		<>
		<div className={`h-full flex-1 flex-col space-y-8 ${cns.cnForTableOuterContainer} md:flex`}>
			{/*
				<div className={`flex items-center justify-between ${cns.cnForTablePresentation} space-y-2`}>
						<h2 className="text-2xl font-bold tracking-tight">{t("WelcomeBack")}</h2>
				</div>
			*/}
			<div className={cn(cns.cnForTablePresentation, "d-flex mt-4 space-y-2")}>
				<Button variant="ghost" className=" justify-end" onClick={handleRefresh}>{Icons.refresh}</Button>
				<p className="text-muted-foreground">{t("CurrentContentsList")}</p>
			</div>
			{getDataTableContent(props, cns)}
		</div>
	  </>
	)
}

export default DataTableBase;