function init_editorial_strategy() {
	var csv   = `
	Nom,Prénom,Age
	K,JC,52
	R,Anne,54
	L,Lolo,54
	`
	data      = csvToArr( csv, ',' );
	var table = jQuery( '#example' ).DataTable(
		{
			rowReorder: {
				dataSrc: 'Nom'
			},
			data: data,
			columns: [
				{ data: 'Nom' },
				{ data: 'Prénom' },
				{ data: 'Age' }
				]
		}
	);
}

/**
 *
 */

function csvToArr(stringVal, splitter) {
	const [keys, ...rest] = stringVal
	  .trim()
	  .split( "\n" )
	  .map( (item) => item.split( splitter ) );

	const formedArr  = rest.map(
		(item) => {
			const object = {};
			keys.forEach( (key, index) => (object[key] = item.at( index )) );
			return object;
		}
	);
	return formedArr;
}
