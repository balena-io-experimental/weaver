# weaver

Automatically generate an intricate web interconnecting all components of your project

## Usage

1. Clone this repo locally
2. Run `npm i`
3. Create a `.env` file in the base directory of the locally cloned repo
   - Add an env variable called `REACT_APP_GITHUB_TOKEN` and set it to your [github auth token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with read-access (write-access is neither used nor required)
   - Add an env variable called `REACT_APP_SERVER_URL` and set it to `http://localhost:8000`
   - (Optional) Add an env variable called `GENERATE_SOURCEMAP` and set it to false (Windows users will likely see the following warning in their console without this env variable: `Failed to parse source map from '/path/to/repo/node_modules/graphology/dist/graphology.umd.min.js.map' file: Error: ENOENT: no such file or directory, open '/path/to/repo/weaver/node_modules/graphology/dist/graphology.umd.min.js.map'`)
4. In the `App.tsx` file, you will see the `getRepo` function being called and accepting 2 parameters. The first parameter is for the repository owner, the second parameter is for the repository name. Set the 2 parameters to the info of the repository you want to visualize
5. Run `npm run server` in one terminal
6. Run `npm start` in another terminal
7. `localhost:3000` will open in a new tab in your browser. Once loaded, it will locally clone the repo if it can access it with the provided auth token. Then it will parse the files in the repo to detect all imports and create nodes and links. Once it is finished, you will see the graphic appear on the site.
8. You can manage the file paths you do and do not want to see via the `File paths` menu on the right. You can search for a specific node to zoom in on it via the search bar. Hovering on a node will show you every node it is connected to.

## Contribution Guidelines

If you find any bugs, please create an issue with steps for reproduction. If you want to fix a bug or add a feature, please assign yourself to the issue your are addressing (create one if it does not exist yet) and create a PR with your changes and request review from the maintainers of this project. PRs will be reviewed as soon as possible.
