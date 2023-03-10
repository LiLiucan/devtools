/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PuppeteerEventListener } from './util.js';
import { Protocol } from 'devtools-protocol';
import { CDPSession } from './Connection.js';
/**
 * @internal
 */
export { PuppeteerEventListener };
/**
 * The CoverageEntry class represents one entry of the coverage report.
 * @public
 */
export interface CoverageEntry {
  /**
   * The URL of the style sheet or script.
   */
  url: string;
  /**
   * The content of the style sheet or script.
   */
  text: string;
  /**
   * The covered range as start and end positions.
   */
  ranges: Array<{
    start: number;
    end: number;
  }>;
}
/**
 * The CoverageEntry class for JavaScript
 * @public
 */
export interface JSCoverageEntry extends CoverageEntry {
  /**
   * Raw V8 script coverage entry.
   */
  rawScriptCoverage?: Protocol.Profiler.ScriptCoverage;
}
/**
 * Set of configurable options for JS coverage.
 * @public
 */
export interface JSCoverageOptions {
  /**
   * Whether to reset coverage on every navigation.
   */
  resetOnNavigation?: boolean;
  /**
   * Whether anonymous scripts generated by the page should be reported.
   */
  reportAnonymousScripts?: boolean;
  /**
   * Whether the result includes raw V8 script coverage entries.
   */
  includeRawScriptCoverage?: boolean;
}
/**
 * Set of configurable options for CSS coverage.
 * @public
 */
export interface CSSCoverageOptions {
  /**
   * Whether to reset coverage on every navigation.
   */
  resetOnNavigation?: boolean;
}
/**
 * The Coverage class provides methods to gathers information about parts of
 * JavaScript and CSS that were used by the page.
 *
 * @remarks
 * To output coverage in a form consumable by {@link https://github.com/istanbuljs | Istanbul},
 * see {@link https://github.com/istanbuljs/puppeteer-to-istanbul | puppeteer-to-istanbul}.
 *
 * @example
 * An example of using JavaScript and CSS coverage to get percentage of initially
 * executed code:
 *
 * ```ts
 * // Enable both JavaScript and CSS coverage
 * await Promise.all([
 *   page.coverage.startJSCoverage(),
 *   page.coverage.startCSSCoverage(),
 * ]);
 * // Navigate to page
 * await page.goto('https://example.com');
 * // Disable both JavaScript and CSS coverage
 * const [jsCoverage, cssCoverage] = await Promise.all([
 *   page.coverage.stopJSCoverage(),
 *   page.coverage.stopCSSCoverage(),
 * ]);
 * let totalBytes = 0;
 * let usedBytes = 0;
 * const coverage = [...jsCoverage, ...cssCoverage];
 * for (const entry of coverage) {
 *   totalBytes += entry.text.length;
 *   for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
 * }
 * console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
 * ```
 *
 * @public
 */
export declare class Coverage {
  #private;
  constructor(client: CDPSession);
  /**
   * @param options - Set of configurable options for coverage defaults to
   * `resetOnNavigation : true, reportAnonymousScripts : false`
   * @returns Promise that resolves when coverage is started.
   *
   * @remarks
   * Anonymous scripts are ones that don't have an associated url. These are
   * scripts that are dynamically created on the page using `eval` or
   * `new Function`. If `reportAnonymousScripts` is set to `true`, anonymous
   * scripts URL will start with `debugger://VM` (unless a magic //# sourceURL
   * comment is present, in which case that will the be URL).
   */
  startJSCoverage(options?: JSCoverageOptions): Promise<void>;
  /**
   * @returns Promise that resolves to the array of coverage reports for
   * all scripts.
   *
   * @remarks
   * JavaScript Coverage doesn't include anonymous scripts by default.
   * However, scripts with sourceURLs are reported.
   */
  stopJSCoverage(): Promise<JSCoverageEntry[]>;
  /**
   * @param options - Set of configurable options for coverage, defaults to
   * `resetOnNavigation : true`
   * @returns Promise that resolves when coverage is started.
   */
  startCSSCoverage(options?: CSSCoverageOptions): Promise<void>;
  /**
   * @returns Promise that resolves to the array of coverage reports
   * for all stylesheets.
   * @remarks
   * CSS Coverage doesn't include dynamically injected style tags
   * without sourceURLs.
   */
  stopCSSCoverage(): Promise<CoverageEntry[]>;
}
/**
 * @public
 */
export declare class JSCoverage {
  #private;
  constructor(client: CDPSession);
  start(options?: {
    resetOnNavigation?: boolean;
    reportAnonymousScripts?: boolean;
    includeRawScriptCoverage?: boolean;
  }): Promise<void>;
  stop(): Promise<JSCoverageEntry[]>;
}
/**
 * @public
 */
export declare class CSSCoverage {
  #private;
  constructor(client: CDPSession);
  start(options?: { resetOnNavigation?: boolean }): Promise<void>;
  stop(): Promise<CoverageEntry[]>;
}
//# sourceMappingURL=Coverage.d.ts.map
