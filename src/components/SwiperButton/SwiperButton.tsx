import React from 'react';
import styled from 'styled-components';
import {useSwiper} from 'swiper/react';
import type {Swiper} from 'swiper';
import '../../App.css';

const StyledButton = styled.button`
  margin:1em;
`;
type SwiperButtonPropType = {
	onPreviousClick: (swiper: Swiper) => void;
	onNextClick: (swiper: Swiper) => void;
	isLoading: boolean;
};
export default function SwiperButton(props: SwiperButtonPropType) {
	const {onPreviousClick, onNextClick, isLoading} = props;
	const swiper = useSwiper();
	return (
		<div className='card'>
			<StyledButton disabled={isLoading} onClick={() => {
				onPreviousClick(swiper);
			}}>
        Previous Collection
			</StyledButton>
			<StyledButton disabled={isLoading} onClick={() => {
				onNextClick(swiper);
			}}>Next Collection</StyledButton>
		</div>
	);
}
