import { gql, useQuery } from "@apollo/client";

const CURRENT_USER_QUERY = gql`
    query {
        authenticatedItem {
            ... on User {
                id
                email
                name
                # TODO: Query the cart once we have it
            }
        }
    }
`
export function useUser() {
    const { data } = useQuery(CURRENT_USER_QUERY);
    return data?.authenticatedItem;
}

export { CURRENT_USER_QUERY };