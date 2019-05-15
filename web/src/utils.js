export function query_set(key: string, value: any, search: URLSearchParams) {
    search.set(key, value);
    return search;
}