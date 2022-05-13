import { existsSync, promises } from "fs";
import path from "path";
import { execSync } from "child_process";
import express, { json, urlencoded } from "express";
import { Dataset } from "./src/types";

// starting size of a node before any edges are established
const DEFAULT_NODE_SIZE = 5;

const REPO_PATH = "./repository";
let context = {
  repoUrl: "",
};

const app = express();
const port = 8000;

app.use(json());
app.use(urlencoded());
app.use(function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.disable("etag");
app.get("/clean", async (req: any, res: any) => {
  if (existsSync(REPO_PATH)) {
    await promises.rm(REPO_PATH, { recursive: true });
  }
});

app.post("/clone", async (req: any, res: any) => {
  if (existsSync(REPO_PATH)) {
    await promises.rm(REPO_PATH, { recursive: true });
  }
  cloneRepo(res, req.body.data);
});

app.get("/getRepoInfo", (req: any, res: any) => {
  if (!req.query?.groupBy) {
    logError("Missing groupBy param");
    res
      .status(400)
      .json({ error: { message: "Bad request: missing groupBy param" } });
  }
  getRepoInfo(res, req.query.groupBy);
});

app.get("/getRepoReadme", (req: any, res: any) => {
  getRepoReadme(res);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// METHODS:
const cloneRepo = async (res: any, repoUrl: string) => {
  if (!repoUrl) {
    res
      .status(400)
      .json({ error: { message: "Bad request: missing repo URL" } });
    return;
  }
  context.repoUrl = repoUrl;
  if (!existsSync(REPO_PATH)) {
    try {
      await promises.mkdir(REPO_PATH);
    } catch (err) {
      logError(err);
    }
  }
  try {
    execSync(`cd ${REPO_PATH} && git clone ${repoUrl} && cd ..`);
    res.status(200).json({ data: "Repository Cloned" });
    return;
  } catch (err) {
    logError(err);
    res.status(500).json(err);
  }
};

const getRepoInfo = async (res: any, groupBy: string) => {
  const repoName = (await getDirectories(REPO_PATH))?.[0];
  let nodes: Dataset["nodes"] = [];
  let edges: Dataset["edges"] = [];
  let filePaths: any[] = [];
  const files = await getFilesInDirectory(REPO_PATH);

  if (!files) {
    return null;
  }
  for (const filePath of files) {
    const repoFilePath = filePath.replace(`repository/${repoName}/`, "");
    const filePathId = `${filePaths.length}`;
    filePaths.push({
      filePathLabel: repoFilePath,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      key: filePathId,
    });
    try {
      const sourceIndex = nodes.length;
      nodes.push({
        key: repoFilePath,
        label: `/${repoFilePath}`,
        filePath: filePathId,
        URL: `${context.repoUrl.replace(
          ".git",
          ""
        )}/blob/master/${repoFilePath}`,
        x: Math.random(),
        y: Math.random(),
        size: DEFAULT_NODE_SIZE,
        imports: 0,
        exports: 0,
      });
      if (
        !repoFilePath.endsWith("tsx") &&
        !repoFilePath.endsWith("ts") &&
        !repoFilePath.endsWith("jsx") &&
        !repoFilePath.endsWith("js")
      ) {
        continue;
      }
      const fileContent = await promises.readFile(filePath, "utf8");
      /**
       * repoFilePath
       * imports: `import X from 'x'`, `import {X, Y, Z} from 'x'`, `import * as X from './X/Y/Z'`
       * consts/exports: `export const`, `const`, `interface`
       */
      const imports = getImports(fileContent);
      for (const imp of imports) {
        let relativePath = imp.path;
        if (imp.path.startsWith(".")) {
          relativePath = path.normalize(
            `/${repoFilePath.replace(/(?!.*\/).+/, "")}${imp.path}`
          );
        }
        for (const comp of imp.components) {
          const key =
            groupBy === "export"
              ? `${comp.name}|${relativePath}`
              : relativePath;
          // determine if the import node exists already. If it does increase its size
          const importIndex = nodes.findIndex((node) => node.key === key);
          if (importIndex >= 0) {
            nodes[importIndex].size = nodes[importIndex].size + 1;
          } else {
            // If the import node does not exist, push it
            nodes.push({
              key,
              label: `import ${comp.name} from ${relativePath}`,
              filePath: filePathId,
              URL: `${context.repoUrl.replace(
                ".git",
                ""
              )}/blob/master/${repoFilePath}`,
              x: Math.random(),
              y: Math.random(),
              // all imports have an edge so they start with a size of DEFAULT_NODE_SIZE + 1
              size: DEFAULT_NODE_SIZE + 1,
              imports: 0,
              exports: 0,
            });
          }
          if (!edges.some(([a, b]) => a === key && b === repoFilePath)) {
            // establish edge between the import and its source if it does not exist yet
            edges.push([key, repoFilePath]);
          }
          // Increase the source node's size by 1
          nodes[sourceIndex].size = nodes[sourceIndex].size + 1;
          nodes[sourceIndex].imports = nodes[sourceIndex].imports + 1;
        }
      }
    } catch (err) {
      logError(err);
    }
  }
  // TODO: for now we just close the request
  res.status(200).json({ nodes, edges, filePaths });
};

const getRepoReadme = async (res: any) => {
  const files = await getFilesInDirectory(REPO_PATH);
  if (!files) {
    res.status(404).json({ error: { message: "Repository not cloned yet" } });
    return;
  }
  const readmePth = files.find((f) => f.toLowerCase().includes("readme.md"));
  if (!readmePth) {
    res
      .status(404)
      .json({ error: { message: "Readme file not found in repository" } });
    return;
  }
  const readmeContent = await promises.readFile(readmePth, "utf8");
  res.status(200).json({ data: readmeContent });
};

const getFilesInDirectory = async (dir: string) => {
  if (!checkFileExists(dir)) {
    return;
  }
  const files: string[] = [];
  const directory = await promises.readdir(dir);
  try {
    for (const fileName of directory) {
      const filePath = path.join(dir, fileName);
      const stat = await promises.lstat(filePath);
      if (stat.isDirectory()) {
        const nestedFile = await getFilesInDirectory(filePath);
        if (!nestedFile) {
          return null;
        }
        files.push(...nestedFile);
      } else {
        files.push(filePath);
      }
    }
  } catch (err) {
    logError(err);
  }
  return files;
};

const checkFileExists = async (dir: string) => {
  try {
    await promises.access(dir);
    return true;
  } catch {
    logError(`Specified directory: ${dir} does not exist`);
    return false;
  }
};

const logError = (...args: any) => {
  console.error("\x1b[31m%s\x1b[0m", ...args);
};
/**
 * getImports
 *
 * @param fileContent
 * @returns [{components: [{name: string, alias: string}], path: string}]
 */
const getImports = (fileContent: string) => {
  return fileContent
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
    .replace(/\\`/gm, "")
    .replace(/`([\s\S]*?)`/gm, "")
    .split("import")
    .filter((x) => x.includes("from "))
    .map((a) => {
      const [components, path] = a.split(/\bfrom\b/gm);
      return {
        components: components
          .replace(/\r?\n/gm, "")
          .replace(/[{}]/gm, "")
          .replace(/\t/gm, "")
          .split(",")
          .filter((a) => !!a.trim())
          .map((t) => {
            const aliased = t.split(" as ");
            return {
              name: aliased[0].replace(/ /gm, ""),
              alias: !!aliased[1] ? aliased[1].replace(/ /gm, "") : null,
            };
          }),
        path: path
          .replace(/[; '"]/gm, "")
          .replace(/\\"/gm, "")
          .split(/\r?\n/)[0],
      };
    });
};

const getDirectories = async (path: string) => {
  const files = await promises.readdir(path);
  return files.filter(async (file) => {
    const fileType = await promises.stat(path + "/" + file);
    return fileType.isDirectory();
  });
};
