import { SuFileInputStream } from "./SuFileInputStream";

/**
 * Interface defining options for fetching a file stream.
 */
export interface FetchStreamOptions {
    /**
     * The size of each chunk to be read from the file, in bytes.
     * Default is 1 MB.
     */
    chunkSize?: number;

    /**
     * An AbortSignal to allow canceling the fetch operation.
     */
    signal?: AbortSignal;
}

/**
 * SuFile is a class designed to provide file-related operations such as reading, writing,
 * listing directories, checking file properties, and more. It interacts with a platform-specific
 * file interface discovered at runtime.
 *
 * @class
 */
export class SuFile {
    /**
     * Default options for fetching file streams.
     * @static
     * @type {FetchStreamOptions}
     */
    public static defaultFetchStreamOptions: FetchStreamOptions = {
        chunkSize: 1024 * 1024,
        signal: undefined,
    };

    /**
     * The platform-specific file interface object.
     * @private
     * @type {any}
     */
    private _fileInterface: any;

    /**
     * The dynamically discovered platform-specific file interface name.
     * @private
     * @type {string | undefined}
     */
    private readonly _interface: string | undefined;

    /**
     * Creates an instance of SuFile and initializes the platform-specific file interface.
     *
     * @param {string} path - The path to the file or directory.
     * @throws {ReferenceError} If the platform-specific interface cannot be found.
     */
    public constructor(public path: string) {
        this._interface = Object.keys(window).find(key => key.match(/^\$(\w{2})FileInputStream$/m));

        if (!this._interface) {
            throw new ReferenceError("Unable to find a interface SuFile");
        }

        this._fileInterface = window[this._interface];
    }

    /**
     * Tries to execute a function and provides a fallback value in case of failure.
     *
     * @private
     * @template T
     * @param {T} fallback - The fallback value to return in case of failure.
     * @param {() => T} fn - The function to execute.
     * @param {string} [errorMsg="Unknown error"] - A custom error message to log on failure.
     * @returns {T} The result of the function or the fallback value.
     */
    private _try<T = any>(fallback: T, fn: () => T, errorMsg: string = "Unknown error"): T {
        try {
            return fn();
        } catch (error) {
            console.error(`${errorMsg}:`, error);
            return fallback;
        }
    }

    /**
     * Reads the file and returns its content.
     *
     * @returns {string | null} The content of the file or null on failure.
     */
    public read(): string | null {
        return this._try(null, () => this._fileInterface.read(this.path), `Error while reading from '${this.path}'`);
    }

    /**
     * Writes data to the file.
     *
     * @param {string} data - The data to write to the file.
     * @returns {boolean | null} True if the operation succeeds, otherwise null.
     */
    public write(data: string): boolean {
        return this._try(false, () => this._fileInterface.write(this.path, data), `Error while writing to '${this.path}'`);
    }

    /**
     * Reads the file's content as a Base64-encoded string.
     *
     * @returns {string | null} The Base64-encoded content of the file or null on failure.
     */
    public readAsBase64(): string | null {
        return this._try(null, () => this._fileInterface.readAsBase64(this.path), `Error while reading '${this.path}' as base64`);
    }

    /**
     * Lists the contents of the directory.
     *
     * @param {string} [delimiter=","] - The delimiter for separating directory contents.
     * @returns {string} An array of directory contents or null on failure.
     */
    public list(delimiter: string = ","): string {
        return this._try("[]", () => this._fileInterface.list(this.path, delimiter), `Error while listing '${this.path}'`);
    }

    /**
     * Gets the size of the file or directory.
     *
     * @param {boolean} [recursive=false] - Whether to include subdirectories in the size calculation.
     * @returns {number} The size in bytes, or 0 on failure.
     */
    public size(recursive: boolean = false): number {
        return this._try(0, () => this._fileInterface.size(this.path, recursive), `Error while getting size of '${this.path}'`);
    }

    /**
     * Deletes the file or directory.
     *
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public delete(): boolean {
        return this._try(false, () => this._fileInterface.delete(this.path), `Error while deleting '${this.path}'`);
    }

    /**
     * Checks if the file or directory exists.
     *
     * @returns {boolean} True if the file or directory exists, otherwise false.
     */
    public exists(): boolean {
        return this._try(false, () => this._fileInterface.exists(this.path), `Error while checking existence of '${this.path}'`);
    }

    /**
     * Checks if the path is a directory.
     *
     * @returns {boolean} True if the path is a directory, otherwise false.
     */
    public isDirectory(): boolean {
        return this._try(false, () => this._fileInterface.isDirectory(this.path), `Error while checking if '${this.path}' is a directory`);
    }

    /**
     * Checks if the path is a file.
     *
     * @returns {boolean} True if the path is a file, otherwise false.
     */
    public isFile(): boolean {
        return this._try(false, () => this._fileInterface.isFile(this.path), `Error while checking if '${this.path}' is a file`);
    }

    /**
     * Checks if the path is a symbolic link.
     *
     * @returns {boolean} True if the path is a symbolic link, otherwise false.
     */
    public isSymLink(): boolean {
        return this._try(false, () => this._fileInterface.isSymLink(this.path), `Error while checking if '${this.path}' is a symbolic link`);
    }

    /**
     * Creates a directory at the given path.
     *
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public mkdir(): boolean {
        return this._try(false, () => this._fileInterface.mkdir(this.path), `Error while creating directory '${this.path}'`);
    }

    /**
     * Creates directories recursively along the given path.
     *
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public mkdirs(): boolean {
        return this._try(false, () => this._fileInterface.mkdirs(this.path), `Error while creating directories '${this.path}'`);
    }

    /**
     * Creates a new file at the given path.
     *
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public createNewFile(): boolean {
        return this._try(false, () => this._fileInterface.createNewFile(this.path), `Error while creating file '${this.path}'`);
    }

    /**
     * Renames the file or directory to the specified destination path.
     *
     * @param {string} destPath - The target path for renaming.
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public renameTo(destPath: string): boolean {
        return this._try(false, () => this._fileInterface.renameTo(this.path, destPath), `Error while renaming '${this.path}' to '${destPath}'`);
    }

    /**
     * Copies the file or directory to the target path.
     *
     * @param {string} targetPath - The target path for copying.
     * @param {boolean} [overwrite=false] - Whether to overwrite existing files at the target location.
     * @returns {boolean} True if the operation succeeds, otherwise false.
     */
    public copyTo(targetPath: string, overwrite: boolean = false): boolean {
        return this._try(false, () => this._fileInterface.copyTo(this.path, targetPath, overwrite), `Error while copying '${this.path}' to '${targetPath}'`);
    }

    /**
     * Checks if the file is executable.
     *
     * @returns {boolean} True if the file is executable, otherwise false.
     */
    public canExecute(): boolean {
        return this._try(false, () => this._fileInterface.canExecute(this.path), `Error while checking if '${this.path}' can be executed`);
    }

    /**
     * Checks if the file is writable.
     *
     * @returns {boolean} True if the file is writable, otherwise false.
     */
    public canWrite(): boolean {
        return this._try(false, () => this._fileInterface.canWrite(this.path), `Error while checking if '${this.path}' can be written`);
    }

    /**
     * Checks if the file is readable.
     *
     * @returns {boolean} True if the file is readable, otherwise false.
     */
    public canRead(): boolean {
        return this._try(false, () => this._fileInterface.canRead(this.path), `Error while checking if '${this.path}' can be read`);
    }

    /**
     * Checks if the file is hidden.
     *
     * @returns {boolean} True if the file is hidden, otherwise false.
     */
    public isHidden(): boolean {
        return this._try(false, () => this._fileInterface.isHidden(this.path), `Error while checking if '${this.path}' is hidden`);
    }

    /**
     * Fetches the file as a stream with specified options.
     *
     * @param {FetchStreamOptions} [options={}] - Options for fetching the file stream.
     * @returns {Promise<Response>} A promise that resolves with the file's stream response.
     */
    public fetch(options = {}): Promise<Response> {
        const mergedOptions = { ...SuFile.defaultFetchStreamOptions, ...options };

        return new Promise((resolve, reject) => {
            let input: SuFileInputStream | null = null;
            try {
                input = new SuFileInputStream(this.path);
            } catch (e) {
                const error = e as ReferenceError;

                reject(
                    new Error("Failed to open file at path '" + this.path + "': " + error.message)
                );

                return;
            }

            const abortHandler = () => {
                try {
                    input?.close();
                } catch (error) {
                    console.error("Error during abort cleanup:", error);
                }
                reject(new DOMException("The operation was aborted.", "AbortError"));
            };

            if (mergedOptions.signal) {
                if (mergedOptions.signal.aborted) {
                    abortHandler();
                    return;
                }
                mergedOptions.signal.addEventListener("abort", abortHandler);
            }

            const stream = new ReadableStream({
                async pull(controller) {
                    try {
                        const chunkData = input.readChunk(mergedOptions.chunkSize);
                        if (!chunkData) {
                            controller.close();
                            cleanup();
                            return;
                        }

                        const chunk = JSON.parse(chunkData);
                        if (chunk && chunk.length > 0) {
                            controller.enqueue(new Uint8Array(chunk));
                        } else {
                            controller.close();
                            cleanup();
                        }
                    } catch (e) {
                        const error = e as Error;
                        cleanup();
                        controller.error(error);
                        reject(new Error("Error reading file chunk: " + error.message));
                    }
                },
                cancel() {
                    cleanup();
                },
            });

            function cleanup() {
                try {
                    if (mergedOptions.signal) {
                        mergedOptions.signal.removeEventListener("abort", abortHandler);
                    }
                    input?.close();
                } catch (error) {
                    console.error("Error during cleanup:", error);
                }
            }

            resolve(
                new Response(stream, {
                    headers: { "Content-Type": "application/octet-stream" },
                })
            );
        });
    };
}
