// docs: https://github.com/octokit/rest.js/
import { Octokit } from '@octokit/rest';

// TO TEST: call getRepo('balena-io-modules', 'rendition').then(console.log);
const octokit = new Octokit({
	auth: process.env.REACT_APP_GITHUB_TOKEN,
});

// TODO: remove if not needed
export const getRepo = (owner: string, repo: string) => {
	return octokit.rest.repos.get({
		owner,
		repo,
	});
};
