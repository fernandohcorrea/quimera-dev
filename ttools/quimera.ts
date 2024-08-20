import fs from 'fs';
import path from "path";
import { program } from "commander";
import { fileURLToPath } from "url";
import StrOut from "./Utils/StrOut.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.ROOT_PATH = path.dirname(__dirname);
process.env.SCRIPT_NAME = path.parse(__filename).name;
process.env.PACKAGE_PATH = [process.env.ROOT_PATH, "package.json"].join("/");

import Config from "./Utils/Config.js";
import InitCommand from './Commands/InitCommand.js';
import InstallCommand from "./Commands/InstallCommand.js";
import DockerResetCommand from './Commands/DockerResetCommand.js';

const strOut = new StrOut();

try {
  let config = Config.getInstance().get();
  program.version(config.version)

  if (
    !fs.existsSync(path.join(process.env.ROOT_PATH, 'docker-compose.yml')) ||
    process.env.NODE_ENV === 'develop'
    ) {
    new InitCommand(program);
  }

  new InstallCommand(program);
  new DockerResetCommand(program);
  await program.parseAsync(process.argv);

  process.exit(0);
} catch (error) {
  strOut.outDanger("Falha de execução!");
  console.error(error);
  process.exit(1);
}
