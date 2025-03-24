import { t } from "i18next"
import dayjs from "dayjs"

const columns = [
    //{ name: 'Author', selector: row => row.author },
    {
        name: t("Data.Title"),
        grow: 3,
        wrap: true,
        selector: row => row.title,
        sortable: true
    },
    {
        name: t("Type"),
        selector: row => row.type,
        sortable: true,
        hide: "md",
        left: true
    },
    {
        name: t("Data.Date"),
        selector: row => row.date,
        sortable: true, 
        format: row => { return dayjs(row.date).format('DD/MM/YY H:mm:ss')},
        hide: "sm",
        center:true
    },
    {
        cell: row => { return (<MyContentActions contentid={row.id} row={row} removeContent={removeContent} showDetails={showDetails} />) },
        allowOverflow: true,
        width: '75px',
        right: true
    }
]

export default columns