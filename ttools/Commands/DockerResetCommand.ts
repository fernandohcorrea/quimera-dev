import { Command } from "commander";
import AbstractCommand from "./Base/AbstractCommand.js";
import {
  InterfaceDockerPsInfo,
  InterfaceDockerVolume,
} from "./Base/InterfacesCommand";

/**
 * DockerResetCommand
 * Limpa Docker (Services, Images, Volumes)
 */
export default class DockerResetCommand extends AbstractCommand {
  private dockerPsInfos: InterfaceDockerPsInfo[] = [];

  /**
   * @param program Command
   */
  constructor(program: Command) {
    super(program);

    program
      .command("docker-reset")
      .description("Remover docker (Services, Images, Volumes)")
      .option("-s, --silent", "Silenciar saidas", false)
      .action(async (options): Promise<void> => {
        this.silent = options.silent ? true : false;
        await this.#run();
      });
  }

  /**
   * Run Process
   */
  async #run() {
    console.time("Process Time");
    await this.#getDokerInfos();
    await this.#stopDK();
    await this.#containerRemove();
    await this.#imagesRemove();
    await this.#volumesRemove();
    console.time("Process Time");
  }

  /**
   * Responde por obter informações do Docker
   */
  async #getDokerInfos() {
    this.strOut.outSession("Obtendo Informações do Docker", 'info');

    const projectName = this.config.get("projectName");

    const cmd: string[] = [
      `docker ps -a`,
      `--filter="NAME=${projectName}*"`,
      `--format='{{json .}}'`,
    ];

    const flgSilence = this.silent;
    this.silent = true;

    let result = await this.shellCmdResult(cmd.join(" "), true);
    this.silent = flgSilence;

    const dataInfos = result as string[];

    if (dataInfos.length == 0 || dataInfos[0].trim().length == 0) {
      this.strOut.outDanger(
        `Não foi possivel obter informações de docker(${projectName}*)`
      );
      process.exit(1);
    }

    for (const key in dataInfos) {
      if (Object.prototype.hasOwnProperty.call(dataInfos, key)) {
        const dockerInfo = JSON.parse(dataInfos[key]);

        if(!this.silent){
          this.strOut.out(`${dockerInfo.ID}\t${dockerInfo.Names}`)
        }

        this.dockerPsInfos.push({
          ID: dockerInfo.ID,
          Image: dockerInfo.Image,
          Names: dockerInfo.Names,
          State: dockerInfo.State,
          Status: dockerInfo.Status,
        });
      }
    }
  }

  /**
   * Responde por parar os serviços em execução do docker
   */
  async #stopDK() {
    const dockerCompose = this.config.get("dockerCompose");
    const dockerComposeCommand = dockerCompose.command;
    this.strOut.outSession("Parando serviços do Docker", 'info');
    await this.shellCmd(`${dockerComposeCommand} stop`, this.silent);
  }

  /**
   * Responde por remover Docker service
   */
  async #containerRemove() {
    const cmd: string[] = [];

    for (const key in this.dockerPsInfos) {
      if (Object.prototype.hasOwnProperty.call(this.dockerPsInfos, key)) {
        const dockerInfo: InterfaceDockerPsInfo = this.dockerPsInfos[key];
        cmd.push(dockerInfo.ID);
      }
    }

    if (cmd.length == 0) {
      this.strOut.outDanger(`Não foi possível obter ID de serviços docker`);
      process.exit(1);
    }

    const strCommand = `docker rm ${cmd.join(" ")}`;

    await this.shellCmd(strCommand, this.silent);
  }

  /**
   * Responde por remover Imagens
   */
  async #imagesRemove() {
    this.strOut.outSession("Removendo Imagens do Docker", 'info');
    const cmd: string[] = [];

    for (const key in this.dockerPsInfos) {
      if (Object.prototype.hasOwnProperty.call(this.dockerPsInfos, key)) {
        const dockerInfo: InterfaceDockerPsInfo = this.dockerPsInfos[key];
        cmd.push(dockerInfo.Image);
      }
    }

    if (cmd.length == 0) {
      this.strOut.outDanger(
        `Não foi possível obter ID de Imagem de serviços docker`
      );
      process.exit(1);
    }

    const strCommand = `docker rmi ${cmd.join(" ")}`;

    await this.shellCmd(strCommand, this.silent);
  }

  /**
   * Responde por remover Volumes
   */
  async #volumesRemove() {
    this.strOut.outSession("Removendo Volumes do Docker", "info");
    const dockerCompose = this.config.get("dockerCompose");
    const volumes: InterfaceDockerVolume[] = dockerCompose.volumes;

    if (!volumes) {
      this.strOut.outDanger(
        `Não foi possível obter ID de Imagem de serviços docker`
      );
      process.exit(1);
    }

    const cmds: string[] = [];

    for (const key in volumes) {
      if (Object.prototype.hasOwnProperty.call(volumes, key)) {
        const volumeData: InterfaceDockerVolume = volumes[key];

        const cmd: string[] = [
          `find ${volumeData.path}`,
          `grep -Ev '.gitkeep|.gitignore'`,
          `grep -Ev '^${volumeData.path}$'`,
          "xargs rm -fr",
        ];

        cmds.push(cmd.join(" | "));
      }
    }

    await this.shellCmd(cmds.join(" ; "), this.silent);
  }
}
