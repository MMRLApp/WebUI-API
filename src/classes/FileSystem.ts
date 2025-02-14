import { ObjectScope } from "../types";
import { AccessorScope } from "../util/AccessorScope";
import { MMRLObjectAccessor } from "./MMRLObjectAccessor";

/**
 * Interface defining the methods for FileSystem implementation.
 */
export interface FileSystemImpl {
  read(path: string): string | null;
  read(path: string, bytes: boolean): string | null;
  write(path: string, data: string): void;
  readAsBase64(path: string): string | null;
  list(path: string): string[] | null;
  list(path: string, delimiter: string): string[] | null;
  size(path: string): number;
  size(path: string, recursive: boolean): number;
  stat(path: string): number;
  stat(path: string, total: boolean): number;
  delete(path: string): boolean;
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  isFile(path: string): boolean;
  mkdir(path: string): boolean;
  mkdirs(path: string): boolean;
  createNewFile(path: string): boolean;
  renameTo(target: string, dest: string): boolean;
  copyTo(target: string, dest: string, overwrite: boolean): boolean;
  canExecute(path: string): boolean;
  canRead(path: string): boolean;
  isHidden(path: string): boolean;
}

/**
 * Class representing the FileSystem interface.
 * Extends the MMRLObjectAccessor class to provide additional functionality specific to FileSystem.
 * @example
 * const fileSystem = FileSystemFactory("net-switch");
 * console.log(fileSystem.read("/path/to/file"));
 */
export class FileSystem extends MMRLObjectAccessor<FileSystemImpl> {
  /**
   * Creates an instance of FileSystem.
   * @param {ObjectScope} scope - The scope to initialize the internal interface with.
   * @example
   * const fileSystem = FileSystemFactory("net-switch");
   */
  public constructor(scope: ObjectScope) {
    const parsedScope = AccessorScope.parseFileScope(scope);
    super(parsedScope);
  }

  /**
   * @private
   * @readonly
   */
  private readonly advancedFsOperations = 33162;

  /**
   * Reads the content of a file.
   * @param {string} path - The path to the file.
   * @param {boolean} [bytes=false] - Whether to read the file as bytes.
   * @returns {string | null} The content of the file or null if not available.
   * @example
   * console.log(fileSystem.read("/path/to/file"));
   */
  public read(path: string, bytes: boolean = false): string | null {
    if (!this.isMMRL) return null;

    return this.interface.read(path, bytes);
  }

  /**
   * Writes data to a file.
   * @param {string} path - The path to the file.
   * @param {string} data - The data to write.
   * @example
   * fileSystem.write("/path/to/file", "Hello, world!");
   */
  public write(path: string, data: string): void {
    if (this.isMMRL) {
      this.interface.write(path, data);
    }
  }

  /**
   * Reads the content of a file as a Base64 encoded string.
   * @param {string} path - The path to the file.
   * @returns {string | null} The Base64 encoded content of the file or null if not available.
   * @example
   * console.log(fileSystem.readAsBase64("/path/to/file"));
   */
  public readAsBase64(path: string): string | null {
    if (this.isMMRL) {
      return this.interface.readAsBase64(path);
    }

    return null;
  }

  /**
   * Lists the contents of a directory.
   * @param {string} path - The path to the directory.
   * @param {string} [delimiter=","] - The delimiter to use for separating the contents.
   * @returns {string[] | null} The list of contents or null if not available.
   * @example
   * console.log(fileSystem.list("/path/to/directory"));
   */
  public list(path: string, delimiter: string = ","): string[] | null {
    if (this.isMMRL) {
      return this.interface.list(path, delimiter);
    }

    return null;
  }

  /**
   * Gets the size of a file or directory.
   * @param {string} path - The path to the file or directory.
   * @param {boolean} [recursive=false] - Whether to calculate the size recursively.
   * @returns {number} The size of the file or directory.
   * @example
   * console.log(fileSystem.size("/path/to/file"));
   */
  public size(path: string, recursive: boolean = false): number {
    if (this.isMMRL) {
      return this.interface.size(path, recursive);
    }

    return 0;
  }

  /**
   * Gets the status of a file or directory.
   * @param {string} path - The path to the file or directory.
   * @param {boolean} [total=false] - Whether to get the total status.
   * @returns {number} The status of the file or directory.
   * @example
   * console.log(fileSystem.stat("/path/to/file"));
   */
  public stat(path: string, total: boolean = false): number {
    if (this.isMMRL) {
      return this.interface.stat(path, total);
    }

    return 0;
  }

  /**
   * Deletes a file or directory.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the file or directory was deleted, otherwise false.
   * @example
   * console.log(fileSystem.delete("/path/to/file"));
   */
  public delete(path: string): boolean {
    if (this.isMMRL) {
      return this.interface.delete(path);
    }

    return false;
  }

  /**
   * Checks if a file or directory exists.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the file or directory exists, otherwise false.
   * @example
   * console.log(fileSystem.exists("/path/to/file"));
   */
  public exists(path: string): boolean {
    if (this.isMMRL) {
      return this.interface.exists(path);
    }

    return false;
  }

  private _unsupportedWarning(method: string) {
    console.warn(`'${method}' is not supported on this version`);
    return false;
  }

  /**
   * Checks if a path is a directory.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the path is a directory, otherwise false.
   * @example
   * console.log(fileSystem.isDirectory("/path/to/directory"));
   */
  public isDirectory(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("isDirectroy");
    }

    return this.interface.isDirectory(path);
  }

  /**
   * Checks if a path is a file.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the path is a file, otherwise false.
   * @example
   * console.log(fileSystem.isFile("/path/to/file"));
   */
  public isFile(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("isFile");
    }

    return this.interface.isFile(path);
  }

  /**
   * Creates a directory.
   * @param {string} path - The path to the directory.
   * @returns {boolean} True if the directory was created, otherwise false.
   * @example
   * console.log(fileSystem.mkdir("/path/to/directory"));
   */
  public mkdir(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("mkdir");
    }

    return this.interface.mkdir(path);
  }

  /**
   * Creates a directory and any necessary parent directories.
   * @param {string} path - The path to the directory.
   * @returns {boolean} True if the directory was created, otherwise false.
   * @example
   * console.log(fileSystem.mkdirs("/path/to/directory"));
   */
  public mkdirs(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("mkdirs");
    }

    return this.interface.mkdirs(path);
  }

  /**
   * Creates a new file.
   * @param {string} path - The path to the file.
   * @returns {boolean} True if the file was created, otherwise false.
   * @example
   * console.log(fileSystem.createNewFile("/path/to/file"));
   */
  public createNewFile(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("createNewFile");
    }

    return this.interface.createNewFile(path);
  }

  /**
   * Renames a file or directory.
   * @param {string} target - The path to the file or directory.
   * @param {string} dest - The new path to the file or directory.
   * @returns {boolean} True if the file or directory was renamed, otherwise false.
   * @example
   * console.log(fileSystem.renameTo("/path/to/file", "/new/path/to/file"));
   */
  public renameTo(target: string, dest: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("renameTo");
    }

    return this.interface.renameTo(target, dest);
  }

  /**
   * Copies a file or directory.
   * @param {string} target - The path to the file or directory.
   * @param {string} dest - The new path to the file or directory.
   * @param {boolean} [overwrite=false] - Whether to overwrite the destination.
   * @returns {boolean} True if the file or directory was copied, otherwise false.
   * @example
   * console.log(fileSystem.copyTo("/path/to/file", "/new/path/to/file"));
   */
  public copyTo(
    target: string,
    dest: string,
    overwrite: boolean = false
  ): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("copyTo");
    }

    return this.interface.copyTo(target, dest, overwrite);
  }

  /**
   * Checks if a file or directory can be executed.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the file or directory can be executed, otherwise false.
   * @example
   * console.log(fileSystem.canExecute("/path/to/file"));
   */
  public canExecute(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("canExecute");
    }

    return this.interface.canExecute(path);
  }

  /**
   * Checks if a file or directory can be read.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the file or directory can be read, otherwise false.
   * @example
   * console.log(fileSystem.canRead("/path/to/file"));
   */
  public canRead(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("canRead");
    }

    return this.interface.canRead(path);
  }

  /**
   * Checks if a file or directory is hidden.
   * @param {string} path - The path to the file or directory.
   * @returns {boolean} True if the file or directory is hidden, otherwise false.
   * @example
   * console.log(fileSystem.isHidden("/path/to/file"));
   */
  public isHidden(path: string): boolean {
    if (!this.isMMRL) return false;
    if (!this.hasRequiredVersion(this.advancedFsOperations)) {
      return this._unsupportedWarning("isHidden");
    }

    return this.interface.isHidden(path);
  }
}

/**
 * Factory function to create an instance of FileSystem.
 * @param {ObjectScope} scope - The scope to initialize the FileSystem with.
 * @returns {FileSystem} The created FileSystem instance.
 * @example
 * const fileSystem = FileSystemFactory("net-switch");
 */
export function FileSystemFactory(scope: ObjectScope): FileSystem {
  return new FileSystem(scope);
}
