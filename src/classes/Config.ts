import _ from "lodash";
import { Path } from "./Path";
import { FileSystem } from "./FileSystem";

export class Config {
  public path: Path;
  private _fs: FileSystem;
  public config: any;
  private _configFile: string;
  private _filePath: string;
  private _configFolder: string;

  constructor(scope: string) {
    this._configFolder = `/data/adb/.config/${scope}`;
    this.path = new Path(this._configFolder);
    this._fs = new FileSystem(scope);

    this._configFile = `config.json`;
    this._filePath = this.path.resolve(this._configFile);

    this._loadConfig = this._loadConfig.bind(this);

    if (!this._fs.exists(this._filePath)) {
      if (this._fs.mkdirs(this._configFolder)) {
        this._fs.write(this._filePath, "{}");
      }
    }

    this.config = this._loadConfig();
  }

  private _loadConfig() {
    const fileContent = this._fs.read(this._filePath);

    if (!fileContent) {
      throw new Error("Failed to read config file.");
    }

    return JSON.parse(fileContent);
  }

  public get(key: string, def: string) {
    return _.get(this.config, key, def);
  }

  public set(key: string, value: any) {
    _.set(this.config, key, value);
    this._saveConfig();
  }

  private _saveConfig() {
    this._fs.write(this._filePath, JSON.stringify(this.config, null, 2));
  }
}
