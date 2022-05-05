# weaver

<img src="./src/logo.svg" alt="weaver" style="height: 200px; width: 200px;"/>

Automatically generate an intricate web interconnecting all components of your project

## Prerequisites

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git): expected to be in your $PATH

## Installation

1. Clone this repo locally
2. Run `npm i`
3. Create a `.env` file in the base directory of the locally cloned repo
   - Add an env variable called `REACT_APP_SERVER_URL` and set it to `http://localhost:8000`
   - (Optional) Add an env variable called `REACT_APP_GITHUB_TOKEN` and set it to your [github auth token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with read-access (write-access is neither used nor required)
   - (Optional) Add an env variable called `GENERATE_SOURCEMAP` and set it to `false` (users may see the following warning in their console without this env variable: `Failed to parse source map from '/path/to/repo/node_modules/graphology/dist/graphology.umd.min.js.map' file: Error: ENOENT: no such file or directory, open '/path/to/repo/weaver/node_modules/graphology/dist/graphology.umd.min.js.map'`)
4. Run `npm run server` in one terminal
5. Run `npm start` in another terminal
6. `localhost:3000` will open in a new tab in your browser.

## Features

- You can manage the file paths you do and do not want to see via the `File paths` menu on the right.
- You can search for a specific node to zoom in on it via the search bar.
- Hovering on a node will show you every node it is connected to.
- Isolate nodes that do not have links by hiding those that do.
- (Optional) Provide [github auth token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) in order to access private repos.
- Choose whether to render the graph with nodes grouped by either module or export.

## Contribution Guidelines

If you find any bugs, please create an issue with steps for reproduction. If you want to fix a bug or add a feature, please assign yourself to the issue your are addressing (create one if it does not exist yet) and create a PR with your changes and request review from the maintainers of this project. PRs will be reviewed as soon as possible.
