/**
 * SuFileInputStream is a class designed to facilitate the reading of files through an underlying
 * platform-specific file input stream implementation. It abstracts interaction with a dynamically
 * discovered interface provided by the runtime environment and provides methods for file operations
 * such as reading and skipping data.
 *
 * @class
 */
export class SuFileInputStream {
    /**
     * Dynamically discovered platform-specific file input stream interface name.
     * @private
     * @type {string | undefined}
     */
    private readonly _interface: string | undefined;

    /**
     * The file input stream object provided by the runtime environment.
     * @private
     * @type {any}
     */
    private readonly _is: any;

    /**
     * Creates an instance of SuFileInputStream, initializes the platform-specific interface,
     * and opens the file input stream for the given file path.
     *
     * @param {string} path - The path to the file to be read.
     * @throws {ReferenceError} If the platform-specific interface cannot be found.
     * @throws {Error} If the file input stream cannot be opened.
     */
    constructor(public path: string) {
        this._interface = Object.keys(window).find(key => key.match(/^\$(\w{2})FileInputStream$/m));

        if (!this._interface) {
            throw new ReferenceError("Unable to find a interface SuFileInputStream");
        }

        this._is = window[this._interface].open(path);
        if (!this._is) {
            throw new Error("Failed to open file input stream");
        }
    }

    /**
     * Closes the input stream and releases any associated resources.
     *
     * @returns {void}
     */
    close(): void {
        this._is?.close();
    }

    /**
     * Reads the next byte of data from the input stream.
     *
     * @returns {number | null} The next byte of data, or `null` if no more data is available.
     */
    read(): number | null {
        return this._is.read();
    }

    /**
     * Skips over a specified number of bytes in the input stream.
     *
     * @returns {number} The actual number of bytes skipped.
     */
    skip(): number {
        return this._is.skip();
    }

    /**
     * Reads a chunk of data from the input stream with the specified size.
     * The returned chunk is a JSON string representation of the byte array. Use `JSON.parse` to
     * convert the returned string into an actual byte array.
     *
     * @param {number} [chunkSize=1048576] - The size of the chunk to read, in bytes (default is 1 MB).
     * @returns {string | null} The chunk of data as a JSON string, or `null` if no more data is available.
     */
    readChunk(chunkSize: number = 1024 * 1024): string | null {
        return this._is.readChunk(chunkSize);
    }
}
