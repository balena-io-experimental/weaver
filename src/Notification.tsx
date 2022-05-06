import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationBox = styled.div<{ type: 'success' | 'warning' | 'error' }>`
	border: 1px solid
		${(props) =>
			props.type === 'success'
				? `rgba(139,195,74,0.7)`
				: props.type === 'error'
				? `rgba(255,0,0,0.7)`
				: `rgba(255,193,7,0.7)`};
	background: ${(props) =>
		props.type === 'success'
			? `rgba(139,195,74,0.7)`
			: props.type === 'error'
			? `rgba(255,0,0,0.7)`
			: `rgba(255,193,7,0.7)`};
	padding: 10px 20px;
	border-radius: 5px;
	min-width: 500px;
	min-height: 50px;
	position: absolute;
	top: 10px;
	right: 10px;
	vertical-align: middle;
	display: flex;
	align-items: center;
`;

interface NotificationProps {
	show: boolean;
	type: 'success' | 'warning' | 'error';
	message: string;
	timer?: number;
}

export const Notification: FC<NotificationProps> = ({
	show,
	type,
	message,
	timer,
}) => {
	let timeout: NodeJS.Timeout;
	const [display, setDisplay] = useState(show);

	useEffect(() => {
		if (!show && !!timeout) {
			clearTimeout(timeout);
		}
	}, [show]);

	if (!display) {
		return null;
	}

	if (!!timer) {
		timeout = setTimeout(() => {
			setDisplay(false);
		}, timer * 1000);
	}

	return <NotificationBox type={type}>{message}</NotificationBox>;
};
