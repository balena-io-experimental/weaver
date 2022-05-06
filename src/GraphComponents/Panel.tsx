import { FC, useEffect, useRef, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimateHeight from 'react-animate-height';
import styled from 'styled-components';

const PanelWrapper = styled.div`
	background: white;
	padding: 1em;
	border-radius: var(--border-radius);
	box-shadow: var(--shadow);

	:not(:last-child) {
		margin-bottom: 0.5em;
	}

	h2 button {
		float: right;
		background: white;
		border: 1px solid black;
		border-radius: var(--border-radius);
		font-size: 1.2em;
		height: 1em;
		width: 1em;
		text-align: center;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	h2 button:hover {
		opacity: var(--hover-opacity);
	}
`;

const DURATION = 300;

export interface PanelProps {
	title: JSX.Element | string;
	initiallyDeployed?: boolean;
}

export const Panel: FC<PanelProps> = ({
	title,
	initiallyDeployed,
	children,
}) => {
	const [isDeployed, setIsDeployed] = useState(initiallyDeployed || false);
	const dom = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isDeployed) {
			setTimeout(() => {
				if (dom.current) {
					dom.current.parentElement!.scrollTo({
						top: dom.current.offsetTop - 5,
						behavior: 'smooth',
					});
				}
			}, DURATION);
		}
	}, [isDeployed]);

	return (
		<PanelWrapper ref={dom}>
			<h2>
				{title}{' '}
				<button type="button" onClick={() => setIsDeployed((v) => !v)}>
					{isDeployed ? (
						<FontAwesomeIcon icon={faChevronDown} />
					) : (
						<FontAwesomeIcon icon={faChevronUp} />
					)}
				</button>
			</h2>
			<AnimateHeight
				duration={DURATION}
				height={isDeployed ? 'auto' : 0}
				style={{ wordWrap: 'break-word' }}
			>
				{children}
			</AnimateHeight>
		</PanelWrapper>
	);
};
