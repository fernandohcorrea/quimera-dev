export interface InterfaceCommand {
  run(options: any): Promise<unknown>;
}

export interface InterfaceDockerPsInfo {
  Names: string;
  ID: string;
  Image: string;
  State: string;
  Status: string;
}

export interface InterfaceDockerVolume {
  path: string;
}
