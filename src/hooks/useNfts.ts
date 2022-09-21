import * as React from 'react';
import {useSafeDispatch} from './useSafeDispatch';
import {useAsync} from './useAsync';
import {getNfts} from '../api/api';
import type {NFTApiResponse, NFT} from '../types';

type NftState = {
	nfts: NFT[];
	nftStatus: string;

};

type NftStateAction = {
	type: string;
	value: NFT | NFT[];
};

const defaultInitialState = {nfts: [], nftStatus: 'idle'};

function useNfts(removeCollection: (
	removedCollection: string,
	collectionsLoaded: boolean
) => void, collectionName: string, collectionsLoaded: boolean, collections: string[], initialState?: NftState) {
	const {
		data,
		error,
		run,
		page,
		isLoading,
		isError,
		isSuccess,
		isIdle,
		setPage,
	} = useAsync();

	const initialStateRef = React.useRef({
		...defaultInitialState,
		...initialState,
	});

	const [{nfts, nftStatus}, setState] = React.useReducer(
		(state: NftState, action: NftStateAction): NftState => {
			if (action.type === 'add') {
				if ((action.value as NFT[]).length > 0) {
					const filteredValue = (action.value as NFT[]).filter((item, index, self) => index === self.findIndex(t => (t.id === item.id)));
					return ({...state, ...filteredValue});
				}

				return ({...state, ...(action.value as NFT[])});
			}

			if (action.type === 'remove') {
				const newNfts = state.nfts.filter(item => (item !== action.value));
				console.log('new collection', newNfts);
				return ({...state, nfts: newNfts});
			}

			return ({...state});
		},
		initialStateRef.current,
	);
	const nftsLoaded = nftStatus === 'success';

	const isEmpty = isSuccess && (data as NFTApiResponse)?.result?.count === 0;

	const total = (data as NFTApiResponse)?.result.total;

	const hasMoreNfts = isSuccess && total > nfts.length;

	const safeSetState = useSafeDispatch(setState);

	const fetchMore = async () => {
		if (hasMoreNfts) {
			await run(getNfts((page as number) + 1, collectionName));
			setPage((page as number) + 1);
		}
	};

	const setNfts = React.useCallback((nfts: NFT[]) => {
		safeSetState({type: 'add', value: {nfts, nftStatus: 'success'}});
	}, [safeSetState]);

	const removeNfts = React.useCallback((removedNfts: NFT, nftsLoaded: boolean) => {
		if (nftsLoaded) {
			safeSetState({type: 'remove', value: removedNfts});
		}
	}, [safeSetState]);

	const reset = React.useCallback(() => {
		safeSetState(initialStateRef.current);
	}, [safeSetState]);

	React.useEffect(() => {
		if (isSuccess) {
			const newNfts: NFT[] = [];
			(data as NFTApiResponse).result.nfts.map(item => newNfts.push(item));
			setNfts([...nfts, ...newNfts]);
		}
	}, [isSuccess, data, setNfts]);

	React.useEffect(() => {
		if (!isIdle) {
			return;
		}

		run(getNfts(page as number, collectionName)).catch(error => {
			console.log(error);
		});
	}, [page, isIdle, run]);

	React.useEffect(() => {
		if (collectionsLoaded && isEmpty) {
			removeCollection(collectionName, collectionsLoaded);
		}
	}, [collectionName, collectionsLoaded, isEmpty, collections]);

	return {
		setNfts,
		removeNfts,
		nfts,
		nftsLoaded,
		reset,
		run,
		page,
		isLoading,
		isIdle,
		isSuccess,
		isError,
		data,
		setPage,
		error,
		isEmpty,
		hasMoreNfts,
		fetchMore,
	};
}

export {useNfts};
