import { Constants } from '../Constants.js';

import { useState, useEffect } from 'react';

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import useInterval from  "src/hooks/useInterval";
import dayjs from 'dayjs';
import DataTable from 'react-data-table-component';

const client = new ApolloClient({
  uri: Constants.WORDPRESS_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: 'cors', // no-cors, *cors, same-origin
  }
});

export default function Questions() {

  const [data, setData] = useState([]);

  client
  .query({
    query: gql`
    query posts {
      posts {
        nodes {
          author {
            node {
              firstName
              lastName
            }
          }
          date
          postId
          title
          uri
        }
      }
    }
    `,
  })
  .then(
    (result) => {
      let data = result.data.posts.nodes;
      let r = data.map( (o) => {return {
        "id": o.postId,
        "date": o.date,
        "author": o.author.node.firstName,
        "title": o.title,
        "uri": o.uri}
      });
      setData(r);
  })

  const [columns, setColumns] = useState([]);
	const [pending, setPending] = useState(true);

  return (
    <>
      <DataTable
          title="Generated articles"
          columns={columns}
          data={data}
          progressPending={pending}
          pagination
          paginationPerPage='5'
          responsive
          onRowClicked={(row, e) => { log.info('row: ' + JSON.stringify(row)); e.preventDefault();}}
          highlightOnHover
		      pointerOnHover
      />
    </>
  );
}