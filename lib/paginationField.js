import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we'll take care of everything

    read(existing = [], { args, cache }) {
      // first apollo asks read function for items
      // return items if already in cache
      // return false and make network request

      const { skip, first } = args;

      // Read number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });

      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if
      // there are items
      // AND there are less than the perPage / first variables expect
      // AND we are on the last page
      // THEN just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      // check that number of items is as expected on perPage
      if (items.length !== first) {
        // we don't have items, we need to fetch from network
        return false;
      }

      // if there are items, return them from the cache and don't go to the network
      if (items.length) {
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      // this runs when apollo client comes back from the network with items
      // how to put them into cache?

      // console.log(`Merging items from the network ${incoming.length}`);

      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];

      // insert items in correct slot in the array
      // in case go automatically to page 4 etc, order still preserved
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      // finally return merged items from the cache
      return merged;
    },
  };
}
