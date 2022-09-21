import * as React from 'react';

function useSafeDispatch(dispatch: React.Dispatch<any>) {
	const mounted = React.useRef(false);
	React.useLayoutEffect((): (() => any) => {
		mounted.current = true;
		// eslint-disable-next-line no-return-assign
		return () => (mounted.current = false);
	}, []);
	return React.useCallback(
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, no-void
		(...args: [any]): void => (mounted.current ? dispatch(...args) : void 0),
		[dispatch],
	);
}

export {useSafeDispatch};
