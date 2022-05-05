import styled from 'styled-components';

export const ButtonsWrapper = styled.p`
	display: flex;
	justify-content: space-between;
`;

export const Button = styled.button`
	padding: 10px 20px;
	background: white;
	border: 1px solid #888888;
	border-radius: 5px;
	cursor: pointer;
`;

export const Select = styled.select`
	padding: 0.5em;
	margin: 0.5em 0.5em 2em 0.5em;
	height: 40px;
	border: 1px solid #dcdcdc;
	border-radius: 5px;
`;

export const Txt = styled.span<{
	muted?: boolean;
	small?: boolean;
	italic?: boolean;
}>`
	${(props) => `
    color: ${props.muted && `var(--dark-grey)`};
    font-size: ${props.small && `0.7em; vertical-align: baseline;`};
    font-style: ${props.italic && `italic`};
  `}
`;
