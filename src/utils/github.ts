// docs: https://github.com/octokit/rest.js/
import { Octokit } from '@octokit/rest';

// TODO: remove if not needed
export const getRepo = (
	owner: string,
	repo: string,
	token: string | undefined,
) => {
	const octokit = new Octokit({
		auth: token || process.env.REACT_APP_GITHUB_TOKEN,
	});

	return (
		octokit.rest.repos
			.get({
				owner,
				repo,
			})
			// public repos fail if the provided token is invalid. If the request fails, try again without a token
			.catch(() =>
				octokit.rest.repos.get({
					owner,
					repo,
					headers: { authorization: '' },
				}),
			)
	);
};
