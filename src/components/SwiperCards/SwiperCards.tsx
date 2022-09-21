/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect} from 'react';
import {EffectCreative} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {SwiperContainer, ImageContainer, Image} from './Styles';
import {useNfts} from '../../hooks/useNfts';
import {LoadingCard} from '../LoadingCard/LoadingCard';

import 'swiper/css/virtual';
import 'swiper/css/lazy';
import 'swiper/css/effect-creative';

type SwiperCardPropTypes = {
	collectionName: string;
	removeCollection: (
		removedCollection: string,
		collectionsLoaded: boolean
	) => void;
	collectionsLoaded: boolean;
	collections: string[];
};

const SwiperCards = (
	props: SwiperCardPropTypes,
): React.ReactElement => {
	const {collectionName, removeCollection, collectionsLoaded, collections}
    = props;

	const {
		isError,
		isSuccess,
		nfts,
		fetchMore,
	} = useNfts(removeCollection, collectionName, collectionsLoaded, collections);

	if (isError) {
		return <div>something went wrong :(</div>;
	}

	const uniqueId: string[] = [];
	return (
		<SwiperContainer>
			<Swiper
				onReachEnd={fetchMore}
				effect={'creative'}
				creativeEffect={{
					prev: {
						shadow: true,
						translate: [0, 0, -400],
					},
					next: {
						translate: ['100%', 0, 0],
					},
				}}
				grabCursor={true}
				modules={[EffectCreative]}
				className='swiper-creative'
			>
				{isSuccess ? nfts
          	?.filter(item => {
          		const isDuplicate = uniqueId.includes(item.id);
          		if (!isDuplicate) {
          			uniqueId.push(item.id);
          			return true;
          		}

          		return false;
          	})
          	.map(item => (
          		<SwiperSlide key={item.id + item.name}>
          			<ImageContainer>
          				<Image
          					src={item?.thumbnailUrl ?? item?.imageUrl ?? ''}
          				></Image>
          			</ImageContainer>
          			<div>{item?.name}</div>
          		</SwiperSlide>
          	)) : (<LoadingCard/>)}
			</Swiper>
		</SwiperContainer>
	);
};

export default SwiperCards;
