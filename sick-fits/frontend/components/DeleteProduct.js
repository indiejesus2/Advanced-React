import { useMutation } from "@apollo/client";
import gql from "graphql-tag"

const DELETE_PRODUCT_MUTATION = gql`
    mutation DELETE_PRODUCT_MUTATION($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`;

function update(cache, payload) {
    cache.evict(cache.identify(payload.data.deleteProduct))
}

export default function DeleteProduct({ id, children }) {
    const [deleteProduct, { loading, error }] = useMutation(DELETE_PRODUCT_MUTATION, {
        variables: { id },
        update: update
    }) 
    return <button
        type="button"
        disabled={loading}
        onClick={() => {
        if (confirm('Are you  sure you want to delete this item?')) {
            //go ahead and delete it
            console.log('Delete')
            deleteProduct().catch((err) => alert(err.message))
        }
    }}>{children}</button>
}