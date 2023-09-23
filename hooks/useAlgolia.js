import { useCallback } from "react";

import chunk from "lodash.chunk";
import flatten from "lodash.flatten";
import algoliasearch from "algoliasearch";

import Constants from "@utils/constants";

const client = algoliasearch(
  Constants.ALGOLIA_APP_ID,
  Constants.ALGOLIA_API_KEY,
);

function numbersToQueries(numbers) {
  const queries = numbers.map((number) => ({
    indexName: "users",
    query: number,
    params: { hitsPerPage: 1 },
  }));

  return chunk(queries, 50);
}

export default function useAlgolia() {
  const contactsSearch = useCallback(async (numbers) => {
    const allHits = [];
    const queryList = numbersToQueries(numbers);

    const chunkResults = await Promise.all(
      queryList.map((queryChunk) => {
        return client.multipleQueries(queryChunk);
      }),
    );

    const results = chunkResults.map((chunkResult) => chunkResult.results);
    const flattened = flatten(results);

    flattened.map((result) => {
      if (result.nbHits > 0) {
        allHits.push(result.hits[0]);
      }
    });

    return allHits;
  }, []);

  return { contactsSearch };
}
