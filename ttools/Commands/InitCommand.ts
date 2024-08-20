import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import Config from '../Utils/Config.js';
import AbstractCommand from "./Base/AbstractCommand.js";
import YAML from "json-to-pretty-yaml";

export default class InitCommand extends AbstractCommand
{
    private dockerCompose:any = {}

    constructor(program:Command){
        super(program);
        this.silent = true;
        program
            .command('init')
            .description('Init de projeto')
            .option('--verbose', 'Saidas vesbosas', false)
            .action(async (options) : Promise<void> => {
                await this.run(options);
            });
    }

    async run (options:any) : Promise<unknown>{
        this.silent = !options.verbose;
        return new Promise(async (res, rej) => {
            await this.shellCmd('clear');

            let dockerComposeCfg = Config.getInstance().get('dockerCompose');
            const rootPath = process.env.ROOT_PATH as string;
            this.dockerCompose.version = `${dockerComposeCfg.dockerComposeVersion}`

            this.dockerCompose['services'] = {}
            this.dockerCompose.services.front = {
                build : {
                    context: './projects/front',
                    args: {
                        DK_UID: "${DK_UID}",
                        DK_GID: "${DK_GID}"
                    },
                },
                container_name: "front",
                ports: ["3000:3000"],
                volumes: [
                    "${PWD}/projects/front:/home/node/project"
                ]
            }

            await this.shellCmd(`rm -f ${process.env.ROOT_PATH}/docker-compose.yml`)

            const yamlData: string = YAML.stringify(this.dockerCompose);

            const dockerComposePath: string = path.join(rootPath, 'docker-compose.yml');
            fs.writeFileSync(dockerComposePath, yamlData);

            let result = true;

            if(!result){
                rej(false);
            }

            res(true)
        })
    }

}