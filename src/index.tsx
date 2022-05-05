import * as ReactDOM from "react-dom";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	:root {
		--ruby: #e22653;
		--grey: #999;
		--dark-grey: #666;
		--light-grey: #ccc;
		--cream: #f9f7ed;
		--transparent-white: #ffffffcc;
		--transition: all ease-out 300ms;
		--shadow: 0 1px 5px var(--dark-grey);
		--hover-opacity: 0.7;
		--stage-padding: 8px;
		--panels-width: 350px;
		--border-radius: 3px;
	}
	* {
		box-sizing: border-box;
	}
	body {
		font-family: "Public Sans", sans-serif;
		background: white;
		font-size: 0.9em;
		overflow: hidden;
	}
	h1,
	h2 {
		font-family: Lora, serif;
	}
	h2 {
		font-size: 1.3em;
		margin: 0;
	}
	h2 > * {
		vertical-align: text-top;
	}
	a {
		color: black !important;
	}
	a:hover {
		opacity: var(--hover-opacity);
	}
	body {
		margin: 0;
		padding: 0;
	}
	#root {
		width: 100vw;
		height: 100vh;
		position: relative;
	}
	#app-root,
	.sigma-container {
		position: absolute;
		inset: 0;
	}

	::-webkit-scrollbar {
		width: 5px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background-color: var(--grey);
		border: transparent;
	}

	.mouse-pointer {
		cursor: pointer;
	}
`;

ReactDOM.render(
	<>
		<App />
		<GlobalStyle />
	</>,
	document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
