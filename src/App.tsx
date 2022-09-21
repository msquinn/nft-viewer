import React from 'react';
import {Virtual} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperButton from './components/SwiperButton/SwiperButton';
import SwiperCards from './components/SwiperCards/SwiperCards';
import {getCollections} from './api/api';
import {useCollections} from './hooks/useCollections';
import {LoadingCard} from './components/LoadingCard/LoadingCard';
import './App.css';
import 'swiper/css';
import 'swiper/css/virtual';

function App() {
	const {
		run,
		page,
		isSuccess,
		isIdle,
		setPage,
		collections,
		collectionsLoaded,
		removeCollection,
		isLoading,
		isError,
		onNextClick,
		onPreviousClick,
	} = useCollections();

	if (isError) {
		return (<div> something went wrong :(</div>);
	}

	return (
		<div className='App'>
			<h1>NFT Showcase:</h1>
			<div className='card'>
				<Swiper
					className='mySwiper'
					modules={[Virtual]}
					virtual={false}
					allowTouchMove={false}
					onReachEnd={async () => {
						if (isSuccess && collectionsLoaded && !isIdle) {
							await run(getCollections((page as number) + 1, 'All'));
							setPage((page as number) + 1);
						}
					}}
				>{ (isSuccess && collections.length > 1) ? (collections?.map(collection => (
						<SwiperSlide key={collection}>
							<div>
								<h2>{collection}</h2>
							</div>
							<SwiperCards
								collectionName={collection}
								removeCollection={removeCollection}
								collectionsLoaded={collectionsLoaded}
								collections={collections}
							/>
						</SwiperSlide>
					))) : (
						<div style={{marginLeft: '25%'}}>
							<LoadingCard/>
						</div>
					)}
					<SwiperButton
						onPreviousClick={onPreviousClick}
						onNextClick={onNextClick}
						isLoading={isLoading}
					/>
				</Swiper>
			</div>
		</div>
	);
}

export default App;
