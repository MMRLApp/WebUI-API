import { MMRLObjectAccessor } from "./MMRLObjectAccessor";

class VersionInterface extends MMRLObjectAccessor<MMRL | undefined> {
  public constructor() {
    super(window["mmrl"] as object);
  }

  /**
   * @private
   * @readonly
   */
  private readonly defaultNumber = -1;

  /**
   * @private
   * @readonly
   */
  private readonly defaultString = -1;

  public get versionCode() {
    if (!this.isMMRL || !this.interface) return this.defaultNumber;

    return this.interface.getBuildConfig().getVersionCode();
  }

  public get versionName() {
    if (!this.isMMRL || !this.interface) return this.defaultString;

    return this.interface.getBuildConfig().getVersionName();
  }

  public get applicationId() {
    if (!this.isMMRL || !this.interface) return this.defaultString;

    return this.interface.getBuildConfig().getApplicationId();
  }

  public get buildType() {
    if (!this.isMMRL || !this.interface) return this.defaultString;

    return this.interface.getBuildConfig().getBuildType();
  }

  public get isDevVersion() {
    if (!this.isMMRL || !this.interface) return false;

    return this.interface.getBuildConfig().isDevVersion();
  }

  public get isGooglePlayBuild() {
    if (!this.isMMRL || !this.interface) return false;

    return this.interface.getBuildConfig().isGooglePlayBuild();
  }

  public get platform() {
    if (!this.isMMRL || !this.interface) return this.defaultString;

    return this.interface.getRootConfig().getPlatform();
  }

  public get rootVersionCode() {
    if (!this.isMMRL || !this.interface) return this.defaultNumber;

    return this.interface.getRootConfig().getVersionCode();
  }

  public get rootVersionName() {
    if (!this.isMMRL || !this.interface) return this.defaultString;

    return this.interface.getRootConfig().getVersionName();
  }
}

export const mmrl = new VersionInterface();
