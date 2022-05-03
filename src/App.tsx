import logo from './logo.svg';
import './App.css';
import { getRepo } from './utils/github';
import { cloneRepo, getRepoInfo } from './utils/requests';

function App() {
  // TODO: Make this an input where the user can write repo owner and name
  getRepo('balena-io-modules', 'rendition').then((repoInfo) => {
    cloneRepo(repoInfo.data.clone_url)?.then((res) => {
      getRepoInfo().then((data) => {
        console.log('files: ', data);
      }).catch((err) => console.error('Err:', err));
    }).catch((err) => console.error('Err:', err));
  });

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;