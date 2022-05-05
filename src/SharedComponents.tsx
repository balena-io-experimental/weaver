import styled from "styled-components"

export const ButtonsWrapper = styled.p`
  display: flex;
  justify-content: space-between;
`

export const Button = styled.div`
  background: white;
  color: black;
  border: 1px solid black;
  outline: none;
  border-radius: var(--border-radius);
  padding: 0.3em 0.5em;
  font-size: 1em;
  font-family: Lato, sans-serif;
  cursor: pointer;
  :hover {
    opacity: var(--hover-opacity);
  }
  > * {
    vertical-align: baseline;
  }
`

export const Txt = styled.span<{ muted?: boolean; small?: boolean, italic?: boolean }>`
  ${(props) => `
    color: ${props.muted && `var(--dark-grey)`};
    font-size: ${props.small && `0.7em; vertical-align: baseline;`};
    font-style: ${props.italic && `italic`};
  `}
`
