import * as Protocol from '../../generated/protocol.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import type * as Platform from '../../core/platform/platform.js';
import * as Common from '../common/common.js';
import { Location, type DebuggerModel } from './DebuggerModel.js';
import { type FrameAssociated } from './FrameAssociated.js';
import { type PageResourceLoadInitiator } from './PageResourceLoader.js';
import { type ExecutionContext } from './RuntimeModel.js';
import { type Target } from './Target.js';
export declare class Script implements TextUtils.ContentProvider.ContentProvider, FrameAssociated {
  #private;
  debuggerModel: DebuggerModel;
  scriptId: Protocol.Runtime.ScriptId;
  sourceURL: Platform.DevToolsPath.UrlString;
  lineOffset: number;
  columnOffset: number;
  endLine: number;
  endColumn: number;
  executionContextId: number;
  hash: string;
  sourceMapURL?: string;
  debugSymbols: Protocol.Debugger.DebugSymbols | null;
  hasSourceURL: boolean;
  contentLength: number;
  originStackTrace: Protocol.Runtime.StackTrace | null;
  readonly isModule: boolean | null;
  constructor(
    debuggerModel: DebuggerModel,
    scriptId: Protocol.Runtime.ScriptId,
    sourceURL: Platform.DevToolsPath.UrlString,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number,
    executionContextId: number,
    hash: string,
    isContentScript: boolean,
    isLiveEdit: boolean,
    sourceMapURL: string | undefined,
    hasSourceURL: boolean,
    length: number,
    isModule: boolean | null,
    originStackTrace: Protocol.Runtime.StackTrace | null,
    codeOffset: number | null,
    scriptLanguage: string | null,
    debugSymbols: Protocol.Debugger.DebugSymbols | null,
    embedderName: Platform.DevToolsPath.UrlString | null,
  );
  embedderName(): Platform.DevToolsPath.UrlString | null;
  target(): Target;
  private static trimSourceURLComment;
  isContentScript(): boolean;
  codeOffset(): number | null;
  isJavaScript(): boolean;
  isWasm(): boolean;
  scriptLanguage(): string | null;
  executionContext(): ExecutionContext | null;
  isLiveEdit(): boolean;
  contentURL(): Platform.DevToolsPath.UrlString;
  contentType(): Common.ResourceType.ResourceType;
  private loadTextContent;
  private loadWasmContent;
  requestContent(): Promise<TextUtils.ContentProvider.DeferredContent>;
  getWasmBytecode(): Promise<ArrayBuffer>;
  originalContentProvider(): TextUtils.ContentProvider.ContentProvider;
  searchInContent(
    query: string,
    caseSensitive: boolean,
    isRegex: boolean,
  ): Promise<TextUtils.ContentProvider.SearchMatch[]>;
  private appendSourceURLCommentIfNeeded;
  editSource(newSource: string): Promise<{
    status: Protocol.Debugger.SetScriptSourceResponseStatus;
    exceptionDetails?: Protocol.Runtime.ExceptionDetails;
  }>;
  rawLocation(lineNumber: number, columnNumber: number): Location | null;
  toRelativeLocation(location: Location): number[];
  isInlineScript(): boolean;
  isAnonymousScript(): boolean;
  setBlackboxedRanges(positions: Protocol.Debugger.ScriptPosition[]): Promise<boolean>;
  containsLocation(lineNumber: number, columnNumber: number): boolean;
  get frameId(): Protocol.Page.FrameId;
  createPageResourceLoadInitiator(): PageResourceLoadInitiator;
}
export declare const sourceURLRegex: RegExp;
