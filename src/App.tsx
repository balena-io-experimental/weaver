import { constant, keyBy, mapValues } from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Graph } from './Graph';
import { Loader } from './Loader';
import { Notification } from './Notification';
import { Button, Select } from './SharedComponents';
import { Dataset, FiltersState } from './types';
import { getRepo } from './utils/github';
import { cloneRepo, getRepoInfo } from './utils/requests';

const UserInteractionWrapper = styled.div`
	flex-direction: column;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
`;

const Card = styled.div`
	flex-direction: column;
	display: flex;
	border: 1px solid #b6b6b6;
	width: 600px;
	padding: 40px 20px;
	box-shadow: 2px 6px 10px rgb(136 136 136 / 30%);
	margin: 10px 0px;
`;

const Input = styled.input`
	padding: 0.5em;
	margin: 0.5em 0.5em 2em 0.5em;
	height: 40px;
	border: 1px solid #dcdcdc;
	border-radius: 5px;
`;

export const App = () => {
	const [owner, setOwner] = useState<string>();
	const [repoName, setRepoName] = useState<string>();
	const [token, setToken] = useState<string>();
	const [groupBy, setGroupBy] = useState<string>('export');
	const [showGraph, setShowGraph] = useState<boolean>(false);
	const [error, setError] = useState<string>();
	const [data, setData] = useState<Dataset | undefined>();
	const [repositoryName, setRepositoryName] = useState<string>();
	const [filtersState, setFiltersState] = useState<FiltersState>({
		filePaths: {},
		onlyOrphans: false,
	});

	useEffect(() => {
		if (!owner || !repoName || !showGraph) {
			return;
		}
		setError(undefined);
		getRepo(owner, repoName, token)
			.then((repo) => {
				setRepositoryName(repo.data.name);
				const url = !!token
					? `https://${token}@${repo.data.clone_url.replace('https://', '')}`
					: repo.data.clone_url;
				cloneRepo(url).then(() =>
					getRepoInfo(groupBy).then((res) => {
						setData(res.data);
						setFiltersState({
							...filtersState,
							filePaths: mapValues(
								keyBy(res.data.filePaths, 'key'),
								constant(true),
							),
						});
					}),
				);
			})
			.catch((err) => {
				console.error(err.message);
				setError('Repository not found!');
				setShowGraph(false);
			});
	}, [showGraph, owner, repoName, token, groupBy]);

	if (!showGraph || !data || !repoName) {
		return (
			<Loader
				content="Loading, this could take several seconds..."
				show={showGraph && !data}
			>
				<UserInteractionWrapper>
					{!!error && (
						<Notification
							type="error"
							message={error}
							show={!!error}
							timer={5}
						/>
					)}
					<h1>weaver</h1>
					<Card>
						<h3>Insert GitHub information:</h3>
						<label>Owner:</label>
						<Input
							autoComplete="true"
							value={owner}
							onChange={(e) => setOwner(e.target.value)}
						/>
						<label>Repository name:</label>
						<Input
							autoComplete="true"
							value={repoName}
							onChange={(e) => setRepoName(e.target.value)}
						/>
						<label>Token:</label>
						<Input
							autoComplete="true"
							value={token}
							type="password"
							onChange={(e) => setToken(e.target.value)}
						/>
						<label>Group by:</label>
						<Select
							value={groupBy}
							onChange={(e) => setGroupBy(e.target.value)}
						>
							<option value="export">Export</option>
							<option value="module">Module</option>
						</Select>
						<div>
							<Button
								disabled={!owner || !repoName}
								onClick={() => setShowGraph(true)}
								style={{ float: 'right' }}
							>
								GO!
							</Button>
						</div>
					</Card>
					<img src="logo.svg" style={{ height: '200px', width: '200px' }} />
				</UserInteractionWrapper>
			</Loader>
		);
	}

	return (
		<div id="app-root">
			<Graph
				data={data}
				repositoryName={repositoryName!}
				groupBy={groupBy}
				onBackClick={() => {
					setData(undefined);
					setShowGraph(false);
				}}
				filtersState={filtersState}
				setFiltersState={setFiltersState}
			/>
		</div>
	);
};
