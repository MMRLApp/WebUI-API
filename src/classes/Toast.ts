import { ToastImpl } from "../types";
import { MMRLObjectAccessor } from "./MMRLObjectAccessor";

/**
 * Class representing a native Toast notification.
 * @extends MMRLObjectAccessor
 */
export class Toast extends MMRLObjectAccessor<MMRL | undefined> {
  /**
   * @private
   * @readonly
   * @type {ToastImpl}
   */
  private readonly toastBuilder: ToastImpl | undefined;

  /**
   * Short duration for the toast.
   * @type {number}
   * @readonly
   */
  public static readonly LENGTH_SHORT: number = 0;

  /**
   * Long duration for the toast.
   * @type {number}
   * @readonly
   */
  public static readonly LENGTH_LONG: number = 1;

  /**
   * Duration of the toast.
   * @private
   * @type {number}
   */
  private duration: number = Toast.LENGTH_SHORT;

  /**
   * The required MMRL version for the Toast class.
   * @private
   * @readonly
   */
  private readonly requireVersion = 33049;

  /**
   * Creates an instance of Toast.
   */
  public constructor() {
    super(window["mmrl"] as object);

    if (!this.interface) return;

    this.toastBuilder = this.interface.toastBuilder.bind(this.interface)();
  }

  /**
   * Sets the text for the toast.
   * @param {string} text - The text to display. @throws If text is not a string.
   * @requires MMRL version `33049` or higher.
   */
  public setText(text: string): void {
    if (!this.isMMRL || !this.toastBuilder) return;
    if (!this.hasRequiredVersion(this.requireVersion)) return;

    if (typeof text !== "string") {
      throw new TypeError("Text must be a string");
    }

    this.toastBuilder.setText(text);
  }

  /**
   * Sets the duration for the toast.
   * @param {number} duration - The duration of the toast.
   * @throws If the duration is not a number.
   * @throws If the duration is invalid.
   * @requires MMRL version `33049` or higher.
   */
  public setDuration(duration: number): void {
    if (!this.isMMRL || !this.toastBuilder) return;
    if (!this.hasRequiredVersion(this.requireVersion)) return;

    if (typeof duration !== "number") {
      throw new TypeError("Duration must be a number");
    }

    if (duration !== Toast.LENGTH_SHORT && duration !== Toast.LENGTH_LONG) {
      throw new Error("Invalid duration");
    }

    this.duration = duration;
    this.toastBuilder.setDuration(this.duration);
  }

  /**
   * Sets the gravity for the toast.
   * @param {number} gravity - The gravity of the toast. @throws If gravity is not a valid number.
   * @param {number} xOffset - The x offset of the toast. @throws If xOffset is not a valid number.
   * @param {number} yOffset - The y offset of the toast. @throws If yOffset is not a valid number.
   * @requires MMRL version `33049` or higher.
   */
  public setGravity(gravity: number, xOffset: number, yOffset: number): void {
    if (!this.isMMRL || !this.toastBuilder) return;
    if (!this.hasRequiredVersion(this.requireVersion)) return;

    if (typeof gravity !== "number") {
      throw new TypeError("Gravity must be a number");
    }

    if (typeof xOffset !== "number") {
      throw new TypeError("X offset must be a number");
    }

    if (typeof yOffset !== "number") {
      throw new TypeError("Y offset must be a number");
    }

    this.toastBuilder.setGravity(gravity, xOffset, yOffset);
  }

  /**
   * Shows the toast.
   * @requires MMRL version `33049` or higher.
   */
  public show(): void {
    if (!this.isMMRL || !this.toastBuilder) return;
    if (!this.hasRequiredVersion(this.requireVersion)) return;

    this.toastBuilder.show();
  }

  /**
   * Cancels the toast.
   * @requires MMRL version `33049` or higher.
   */
  public cancel(): void {
    if (!this.isMMRL || !this.toastBuilder) return;
    if (!this.hasRequiredVersion(this.requireVersion)) return;

    this.toastBuilder.cancel();
  }

  /**
   * Creates a new Toast instance with the specified text and duration.
   * @param {string} text - The text to display.
   * @param {number} [duration=Toast.LENGTH_SHORT] - The duration of the toast.
   * @requires MMRL version `33049` or higher.
   * @returns {Toast} The created Toast instance.
   */
  public static makeText(
    text: string,
    duration: number = Toast.LENGTH_SHORT
  ): Toast {
    const toast = new Toast();
    toast.setText(text);
    toast.setDuration(duration);
    return toast;
  }
}
