import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
    return {
        keyArgs: false, // tells Apoll we will take care of everything
        read(existing = [], { args, cache }) {
            console.log({ existing, args, cache })
            const { skip, first } = args;

            // Read the number of items on the page from the cache
            const data = cache.readQuery({ query: PAGINATION_QUERY});
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count / first);

            // CHeck if we have existing items
            const items = existing.slice(skip, skip + first).filter((x) => x);
            //If there are items AND there aren't enough items to satisfy how many were requested
            // AND we are on the last page
            // Then Just Send It!
            if(items.length && items.length !== first && page === pages) {
                return items
            }
            if(items.length !== first) {
                // We dont have any items, we must go to the netowrk to fetch them
                return false;
            }

            // If there are items, just return them from the cache, and we don't need to go the network.
            if (items.length) {
                console.log(
                    `There are ${items.length} items in the cache! Gonna send them to apollo`
                )
                return items;
            }

            return false // falback to network
// First thing it does it it asks the read function for those items.

// We can either do one of two things:

// First thing we can do is return the items because they are already in the cache

// The other thing we can do is to return from here (network request)
        },
        merge(existing, incoming, { args }) {
            const { skip, first } = args;
            console.log('Merging itmes from the network ${incoming.length}')
            console.log(incoming)
            const merged = existing ? existing.slice(0) : [];
            merged.push(incoming);
            for(let i = skip; i < skip + incoming.length; i++) {
                merged[i] = incoming[i - skip];
            }
            console.log(merged);
            // Finally we return the merged items from cache
            return merged
// This runs when the Apollo client comes back from the ntetwork with our product
        }
    }
}