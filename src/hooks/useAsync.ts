import * as React from 'react';
import type {CollectionApiResponse, NFTApiResponse} from '../types';
import {useSafeDispatch} from './useSafeDispatch';

const defaultInitialState = {status: 'idle', data: null, error: null, page: 0};

function useAsync(initialState?: Record<string, unknown>) {
	const initialStateRef = React.useRef({
		...defaultInitialState,
		...initialState,
	});

	const [{status, data, error, page}, setState] = React.useReducer(
		(s: Record<string, unknown>, a: Record<string, unknown>) => ({...s, ...a}),
		initialStateRef.current,
	);

	const safeSetState = useSafeDispatch(setState);

	const setData = React.useCallback(
		(data: CollectionApiResponse | NFTApiResponse) => {
			safeSetState({data, status: 'resolved'});
		},
		[safeSetState],
	);
	const setError = React.useCallback(
		(error: Error) => {
			safeSetState({error, status: 'rejected'});
		},
		[safeSetState],
	);

	const setPage = React.useCallback((page: number) => {
		safeSetState({page});
	}, [safeSetState]);

	const reset = React.useCallback(
		() => {
			safeSetState(initialStateRef.current);
		},
		[safeSetState],
	);

	const run = React.useCallback(
		async (promise: Promise<CollectionApiResponse | NFTApiResponse>) => {
			if (!promise.then) {
				throw new Error(
					'The argument passed to useAsync().run must be a promise. Maybe a function that\'s passed isn\'t returning anything?',
				);
			}

			safeSetState({status: 'pending'});
			return promise.then(
				data => {
					setData(data);
					return data;
				},
				async error => {
					setError(error);
					return Promise.reject(error);
				},
			);
		},
		[safeSetState, setData, setError],
	);
	return {
		isIdle: status === 'idle',
		isLoading: status === 'pending',
		isError: status === 'rejected',
		isSuccess: status === 'resolved',

		setData,
		setError,
		setPage,
		error,
		status,
		data,
		page,
		run,
		reset,
	};
}

export {useAsync};
