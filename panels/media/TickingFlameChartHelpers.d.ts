export declare function formatMillisecondsToSeconds(ms: number, decimalPlaces: number): string;
/**
 * Manage the bounding box properties for the ticking flame chart.
 * kept in a separate file for unit testing.
 */
export declare class Bounds {
  private minInternal;
  private maxInternal;
  private lowInternal;
  private highInternal;
  private readonly maxRange;
  private readonly minRange;
  constructor(initialLow: number, initialHigh: number, maxRange: number, minRange: number);
  get low(): number;
  get high(): number;
  get min(): number;
  get max(): number;
  get range(): number;
  private reassertBounds;
  /**
   * zoom out |amount| ticks at position [0, 1] along the current range of the timeline.
   */
  zoomOut(amount: number, position: number): void;
  /**
   * zoom in |amount| ticks at position [0, 1] along the current range of the timeline.
   */
  zoomIn(amount: number, position: number): void;
  /**
   * Add Xms to the max value, and scroll the timeline forward if the end is in sight.
   */
  addMax(amount: number): void;
  /**
   * Attempt to push the maximum time up to |time| ms.
   */
  pushMaxAtLeastTo(time: number): boolean;
}
