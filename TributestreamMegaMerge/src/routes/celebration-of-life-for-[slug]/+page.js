export function load({ data }) {
    // Simply pass through the data from the server
    return {
        tribute: data.tribute
    };
}