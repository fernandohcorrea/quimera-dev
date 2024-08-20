import { Command } from "commander";
import shell from "shelljs";
import StrOut from "../../Utils/StrOut.js";
import {InterfaceCommand} from "./InterfacesCommand.js";
import readLineSync from "readline-sync";
import Config from "../../Utils/Config.js";

export default abstract class AbstractCommand implements InterfaceCommand
{
  protected config : Config
  protected strOut: StrOut;
  protected silent: boolean;
  protected program: Command;

  constructor(program: Command) {
    this.config = Config.getInstance();
    this.silent = false;
    this.strOut = new StrOut();
    this.program = program;
    return;
  }

  /**
   * Promise de execução de command shell
   * @param str_cmd string
   * @param end_process boolean
   * @returns Promise<any>
   */
  async shellCmd(str_cmd: string, end_process: boolean = false): Promise<any> {
    return new Promise((res, rej) => {
      shell.exec(str_cmd, { silent: this.silent }, (code, stdout, stderr) => {
        if (end_process && code !== 0) {
          this.strOut.outDanger(`Command error: ${str_cmd}`);
          console.error(stderr);
          rej(false);
          process.exit(code);
        }
        if (code !== 0) {
          rej(false);
        } else {
          res(true);
        }
      });
    });
  }

  /**
   * Promise de execução de command shell com retorno de resultado
   *
   * @param str_cmd string
   * @param end_process voolena
   * @returns Promise<boolean | string[]>
   */
  async shellCmdResult(str_cmd: string, end_process: boolean = false) : Promise<boolean | string[]> {
    return new Promise((res, rej) => {
      shell.exec(str_cmd, { silent: this.silent }, (code, stdout, stderr) => {
        if (end_process && code !== 0) {
          this.strOut.outDanger(`Command error: ${str_cmd}`);
          console.error(stderr);
          rej(false);
          process.exit(code);
        }
        if (code !== 0) {
          this.strOut.outWarning(`Command error: ${str_cmd}`);
          rej(false);
        } else {
          res(stdout.trim().split("\n"));
        }
      });
    });
  }

  /**
   * Promise de Questão de interação
   *
   * @param question string
   * @param select_options string[]
   * @returns 
   */
  async questionSelect(question: string, select_options: string[]) {
    return new Promise((res) => {
      const index = readLineSync.keyInSelect(select_options, question);
      res(index);
    });
  }

  /**
   * Abstract Run
   * @param options<any>
   * @returns Promise<unknown> 
   */
  run(options: any): Promise<unknown> {
    return new Promise(async (res, rej) => {
      const result = await this.shellCmd(`echo "AbstractCommand::RUN"`);
      res(result);
    });
  }
}
