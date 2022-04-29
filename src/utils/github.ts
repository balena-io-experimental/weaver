// docs: https://github.com/octokit/rest.js/
import { Octokit } from "@octokit/rest"; 

// TO TEST: call getAllFiles('balena-io-modules', 'rendition').then(console.log);
const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_TOKEN
});


// TODO: remove if not needed
export const getRepo = (owner: string, repo: string) => {
  return octokit.rest.repos.get({
    owner,
    repo,
  });
}

export const getRepoContent = (owner: string, repo: string, path: string = '') => {
  return octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });
}

export const getAllFiles = async (owner: string, repo: string, path: string = '', files: any[] = []): Promise<any[]> => {
  const dirContent = await getRepoContent(owner, repo, path);
  let accumulator = files;
  // TODO: verify what we have when data is not array
  if(!('data' in dirContent && Array.isArray(dirContent.data))) {
    return accumulator;
  }
  for(let i = 0; i < dirContent.data.length; i++) {
    const item = dirContent.data[i];
    if(item.type === 'dir') {
      accumulator = await getAllFiles(owner, repo, item.path, accumulator);
      continue;
    }
    if(item.type === 'file') {
      accumulator.push(item);
    }
  }
  return accumulator;
}