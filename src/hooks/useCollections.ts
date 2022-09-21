import * as React from 'react';
import {useSafeDispatch} from './useSafeDispatch';
import {useAsync} from './useAsync';
import type {CollectionApiResponse} from '../types';
import {getCollections} from '../api/api';
import type {Swiper as SwiperType} from 'swiper';

type CollectionState = {
	collections: string[];
	collectionStatus: string;
};

type CollectionStateAction = {
	type: string;
	value: string | string[];
};

const defaultInitialState = {collections: [], collectionStatus: 'idle'};

function useCollections(initialState?: CollectionState) {
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

	const [{collections, collectionStatus}, setState] = React.useReducer(
		(
			state: CollectionState,
			action: CollectionStateAction,
		): CollectionState => {
			if (action.type === 'add') {
				return {...state, ...(action.value as string[])};
			}

			if (action.type === 'remove') {
				const newCollections = state.collections.filter(
					item => item !== action.value,
				);
				return {...state, collections: newCollections};
			}

			return {...state};
		},
		initialStateRef.current,
	);
	const collectionsLoaded = collectionStatus === 'success';

	const safeSetState = useSafeDispatch(setState);

	const setCollections = React.useCallback(
		(collections: string[]) => {
			safeSetState({
				type: 'add',
				value: {collections, collectionStatus: 'success'},
			});
		},
		[safeSetState],
	);

	const removeCollection = React.useCallback(
		(removedCollection: string, collectionsLoaded: boolean) => {
			if (collectionsLoaded) {
				safeSetState({type: 'remove', value: removedCollection});
			}
		},
		[safeSetState],
	);

	const reset = React.useCallback(
		() => {
			safeSetState(initialStateRef.current);
		},
		[safeSetState],
	);

	React.useEffect(() => {
		if (isSuccess) {
			console.log('in use effect...');
			const newCollections: string[] = [];
			(data as CollectionApiResponse).result.collections.map(item => {
				if (
					collections.includes(item.group_id)
          || newCollections.includes(item.group_id)
				) {
					return; // Prevent duplicates
				}

				return	newCollections.push(item.group_id);
			});
			setCollections([...collections, ...newCollections]);
		}
	}, [isSuccess, data, setCollections]);

	React.useEffect(() => {
		if (!isIdle) {
			return;
		}

		run(getCollections(page as number, 'All')).catch(err => {
			console.log('error', err);
		});
	}, [page, isIdle, run]);

	const onNextClick = (swiper: SwiperType) => {
		swiper.slideNext();
	};

	const onPreviousClick = async (swiper: SwiperType) => {
		swiper.slidePrev();
	};

	return {
		setCollections,
		removeCollection,
		collections,
		collectionsLoaded,
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
		onPreviousClick,
		onNextClick,
	};
}

export {useCollections};
