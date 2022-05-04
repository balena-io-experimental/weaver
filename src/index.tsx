import * as ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from 'styled-components';
import { Provider } from "rendition";

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}

	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}
`;

ReactDOM.render(
	<Provider style={{width: '100vw', height: '100vh'}}>
		<App />
		<GlobalStyle />
	</Provider>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
