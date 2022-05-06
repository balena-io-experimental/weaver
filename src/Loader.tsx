import { FC } from 'react';
import styled from 'styled-components';

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
			<LoaderWrapper>{content}</LoaderWrapper>
			{children}
		</>
	);
};
