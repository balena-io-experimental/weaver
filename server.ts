import { existsSync, promises } from "fs";
import path from "path";
import { execSync } from "child_process";
import express, { json, urlencoded } from "express";

const REPO_PATH = "./repository";

const app = express();
const port = 8000;

app.use(json());
app.use(urlencoded());
app.use(function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
  getRepoInfo(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// METHODS:
const cloneRepo = async (res: any, repoUrl: string) => {
  if (!repoUrl) {
    res.json({ error: { message: "Bad request: missing repo URL" } });
    return;
  }
  if (!existsSync(REPO_PATH)) {
    try {
      await promises.mkdir(REPO_PATH);
    } catch (err) {
      logError(err);
    }
  }
  try {
    execSync(`cd ${REPO_PATH} && git clone ${repoUrl} && cd ..`);
    res.json({ data: "Repository Cloned" });
    return;
  } catch (err) {
    res.status(500).json(err);
  }
};

export interface NodeProps {
  id: string;
  size: number;
}

export interface LinkProps {
  source: string;
  target: string;
  distance: number;
}

const getRepoInfo = async (res: any) => {
  const repoName = (await getDirectories(REPO_PATH))?.[0];
  let nodes: Array<NodeProps> = [];
  let links: Array<LinkProps> = [];
  const files = await getFilesInDirectory(REPO_PATH);

  if (!files) {
    return null;
  }
  for (const filePath of files) {
    const repoFilePath = filePath.replace(`repository/${repoName}/`, "");
    try {
      nodes.push({ id: `/${repoFilePath}`, size: 1 });
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
          const idx = nodes.findIndex(
            (node) => node.id === `${comp.name}|${relativePath}`
          );
          if (idx >= 0) {
            nodes[idx].size = nodes[idx].size + 1;
          } else {
            nodes.push({ id: `${comp.name}|${relativePath}`, size: 1 });
          }
          links.push({
            source: `/${repoFilePath}`,
            target: `${comp.name}|${relativePath}`,
            distance: 25,
          });
        }
      }
    } catch (err) {
      logError(err);
    }
  }
  // TODO: for now we just close the request
  res.status(200).json({ nodes, links });
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
    .replaceAll(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
    .replaceAll("\\`", "")
    .replaceAll(/`([\s\S]*?)`/gm, "")
    .split("import")
    .filter((x) => x.includes("from "))
    .map((a) => {
      const [components, path] = a.split("from");
      return {
        components: components
          .replaceAll(/\r?\n/g, "")
          .replaceAll("{", "")
          .replaceAll("}", "")
          .replaceAll("\t", "")
          .split(",")
          .filter((a) => !!a.trim())
          .map((t) => {
            const aliased = t.split(" as ");
            return {
              name: aliased[0].replaceAll(" ", ""),
              alias: !!aliased[1] ? aliased[1].replaceAll(" ", "") : null,
            };
          }),
        path: path
          .replaceAll(";", "")
          .replaceAll(" ", "")
          .replaceAll('\\"', "")
          .replaceAll("'", "")
          .replaceAll('"', "")
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
