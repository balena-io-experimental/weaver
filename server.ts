import { existsSync, promises } from "fs";
import path from "path";
import { execSync } from "child_process";
import express, { json, urlencoded } from "express";

const REPO_PATH = "./repository";

const app = express();
const port = 8000;

app.use(json());
app.use(urlencoded());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.disable("etag");
app.post("/clone", async (req, res) => {
  if (existsSync(REPO_PATH)) {
    await promises.rm(REPO_PATH, { recursive: true });
  }
  cloneRepo(res, req.body.data);
});

app.get("/getRepoInfo", (req, res) => {
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
    await promises.mkdir(REPO_PATH);
  }
  try {
    execSync(`cd ${REPO_PATH} && git clone ${repoUrl} && cd ..`);
    res.json({ data: "Repository Cloned" });
    return;
  } catch (err) {
    res.status(500).json(err);
  }
};

interface NodeProps {
  id: string;
  size: number;
}

interface LinkProps {
  source: string;
  target: string;
}

const getRepoInfo = async (res: any) => {
  let nodes: Array<NodeProps> = [];
  let links: Array<LinkProps> = [];
  const files = await getFilesInDirectory(REPO_PATH);
  if (!files) {
    return null;
  }
  for (const filePath of files) {
    const fileContent = await promises.readFile(filePath, "utf8");
    nodes.push({ id: filePath, size: 2 });
    fileContent.split(/\r?\n/).forEach((line: string, lineIndex: number) => {
      // testing nivo node creation
      nodes.push({ id: filePath + lineIndex, size: 1 });
      links.push({ source: filePath, target: filePath + lineIndex });
    });
    break;
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
