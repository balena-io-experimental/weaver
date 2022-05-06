import axios from 'axios';

export const clean = () => {
	if (!process.env.REACT_APP_SERVER_URL) {
		return Promise.reject('Missing REACT_APP_SERVER_URL env var');
	}
	const url = `${process.env.REACT_APP_SERVER_URL}/clean`;
	return axios.get(url);
};

export const cloneRepo = (repoUrl: string) => {
	if (!process.env.REACT_APP_SERVER_URL) {
		return Promise.reject('Missing REACT_APP_SERVER_URL env var');
	}
	const url = `${process.env.REACT_APP_SERVER_URL}/clone`;
	return axios.post(url, { data: repoUrl });
};

export const getRepoInfo = (groupBy: string) => {
	if (!process.env.REACT_APP_SERVER_URL) {
		return Promise.reject('Missing REACT_APP_SERVER_URL env var');
	}
	const url = `${process.env.REACT_APP_SERVER_URL}/getRepoInfo`;
	return axios.get(url, { params: { groupBy } });
};

export const getRepoReadme = () => {
	if (!process.env.REACT_APP_SERVER_URL) {
		return Promise.reject('Missing REACT_APP_SERVER_URL env var');
	}
	const url = `${process.env.REACT_APP_SERVER_URL}/getRepoReadme`;
	return axios.get(url);
};
