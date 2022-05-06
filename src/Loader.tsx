import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const LoaderWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.7);
	color: white;
`;

const ellipsis = keyframes`
	to {
		width: 1.25em;    
	}
`;

const Loading = styled.div`
	font-size: 14px;
	&:after {
		overflow: hidden;
		display: inline-block;
		vertical-align: bottom;
		-webkit-animation: ${ellipsis} steps(4, end) 1500ms infinite;
		animation: ${ellipsis} steps(4, end) 1500ms infinite;
		content: '...';
		width: 0px;
	}
`;

export interface LoaderProps {
	show: boolean;
	content: string;
}

export const Loader: FC<LoaderProps> = ({ show, content, children }) => {
	if (!show) {
		return <>{children}</>;
	}

	return (
		<>
			<LoaderWrapper>
				{content} <Loading />
			</LoaderWrapper>
			{children}
		</>
	);
};
