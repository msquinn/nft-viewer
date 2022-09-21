import { CollectionApiResponse, NFTApiResponse } from "../types";

const PAGES = 10;

const getCollections = async (page: number, collectionType: string): Promise<CollectionApiResponse> => {
    const start = (page * PAGES);
    const end = start + PAGES;
    return window.fetch(`/api/collections_page?startInclusive=${start}&endExclusive=${end}&collectionType=${collectionType}`).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
            return data;
        }
        else {
            return Promise.reject(data);
        }
    });
}

const getNfts = async (page: number, collectionName: string): Promise<NFTApiResponse> => {
    const start = (page * PAGES);
    const end = start + PAGES;
    return window
        .fetch(
            `/api/nfts_filtered?startInclusive=${start}&endExclusive=${end}&nft_filter_string={"collection": "${collectionName}"}`
        )
        .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                return data;
            }
            else {
                return Promise.reject(data);
            }
        });
}


export { getCollections, getNfts }