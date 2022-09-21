import React from 'react';
import styled, {keyframes, css} from 'styled-components';
import {FaSpinner} from 'react-icons/fa';

const StyledLoadingCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
    background-color: rgb(206, 17, 17);
    width: 240px;
    height: 320px;
`;

const spin = keyframes({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'0%': {transform: 'rotate(0deg)'},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'100%': {transform: 'rotate(360deg)'},
});

const AnimatedSpinner = styled(FaSpinner)`
    animation: ${spin} 1s linear infinite
`;

export const LoadingCard = () => (<StyledLoadingCard>
	<AnimatedSpinner></AnimatedSpinner>
	<div>Loading...</div>
</StyledLoadingCard>);
