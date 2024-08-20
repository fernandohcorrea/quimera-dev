import nconf from "nconf";

export default class Config {
  private static instance: Config;
  private dataCfg: any = {};

  private constructor() {
    this.dataCfg = {};
  }

  static getInstance() {
    if (typeof this.instance === 'undefined') {
      nconf.use('memory');
      nconf.use('file', { file: process.env.PACKAGE_PATH });

      const projectName = nconf.get('name');
      const version = nconf.get('version');

      const cfg = nconf.get(process.env.SCRIPT_NAME);
      cfg.version = version;
      cfg.projectName = projectName;

      nconf.remove('file');
      nconf.defaults(cfg);

      this.instance = new Config();
      this.instance.dataCfg = nconf;
    }

    return this.instance;
  }

  get(key: string | null = null) {
    return this.dataCfg.get(key);
  }
}