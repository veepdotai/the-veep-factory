import DataTable from 'react-data-table-component'

import columns from "./columns"

export default function DataTableComponent( props ) {
    /* cf https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts */
    const customStyles = {
        table: {
            style: {
                border: '1px solid silver',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
            }
        },
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
            },
        },
    };

	return (
        <DataTable
            {...props}

            columns={columns}
            selectableRows
            pagination
            paginationPerPage='100'
            responsive
            //striped
            highlightOnHover
            fixedHeader
            fixedHeaderScrollHeight="300px"
            pointerOnHover
            customStyles={customStyles}
        />
	);
}
