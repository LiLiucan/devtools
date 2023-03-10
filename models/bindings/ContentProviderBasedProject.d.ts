import type * as Common from '../../core/common/common.js';
import type * as Platform from '../../core/platform/platform.js';
import type * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
export declare class ContentProviderBasedProject extends Workspace.Workspace.ProjectStore {
  #private;
  constructor(
    workspace: Workspace.Workspace.WorkspaceImpl,
    id: string,
    type: Workspace.Workspace.projectTypes,
    displayName: string,
    isServiceProject: boolean,
  );
  requestFileContent(
    uiSourceCode: Workspace.UISourceCode.UISourceCode,
  ): Promise<TextUtils.ContentProvider.DeferredContent>;
  isServiceProject(): boolean;
  requestMetadata(
    uiSourceCode: Workspace.UISourceCode.UISourceCode,
  ): Promise<Workspace.UISourceCode.UISourceCodeMetadata | null>;
  canSetFileContent(): boolean;
  setFileContent(
    _uiSourceCode: Workspace.UISourceCode.UISourceCode,
    _newContent: string,
    _isBase64: boolean,
  ): Promise<void>;
  fullDisplayName(uiSourceCode: Workspace.UISourceCode.UISourceCode): string;
  mimeType(uiSourceCode: Workspace.UISourceCode.UISourceCode): string;
  canRename(): boolean;
  rename(
    uiSourceCode: Workspace.UISourceCode.UISourceCode,
    newName: Platform.DevToolsPath.RawPathString,
    callback: (
      arg0: boolean,
      arg1?: string | undefined,
      arg2?: Platform.DevToolsPath.UrlString | undefined,
      arg3?: Common.ResourceType.ResourceType | undefined,
    ) => void,
  ): void;
  excludeFolder(_path: Platform.DevToolsPath.UrlString): void;
  canExcludeFolder(_path: Platform.DevToolsPath.EncodedPathString): boolean;
  createFile(
    _path: Platform.DevToolsPath.EncodedPathString,
    _name: string | null,
    _content: string,
    _isBase64?: boolean,
  ): Promise<Workspace.UISourceCode.UISourceCode | null>;
  canCreateFile(): boolean;
  deleteFile(_uiSourceCode: Workspace.UISourceCode.UISourceCode): void;
  remove(): void;
  performRename(
    path: Platform.DevToolsPath.UrlString,
    newName: string,
    callback: (arg0: boolean, arg1?: string | undefined) => void,
  ): void;
  searchInFileContent(
    uiSourceCode: Workspace.UISourceCode.UISourceCode,
    query: string,
    caseSensitive: boolean,
    isRegex: boolean,
  ): Promise<TextUtils.ContentProvider.SearchMatch[]>;
  findFilesMatchingSearchRequest(
    searchConfig: Workspace.Workspace.ProjectSearchConfig,
    filesMatchingFileQuery: Platform.DevToolsPath.UrlString[],
    progress: Common.Progress.Progress,
  ): Promise<string[]>;
  indexContent(progress: Common.Progress.Progress): void;
  addUISourceCodeWithProvider(
    uiSourceCode: Workspace.UISourceCode.UISourceCode,
    contentProvider: TextUtils.ContentProvider.ContentProvider,
    metadata: Workspace.UISourceCode.UISourceCodeMetadata | null,
    mimeType: string,
  ): void;
  addContentProvider(
    url: Platform.DevToolsPath.UrlString,
    contentProvider: TextUtils.ContentProvider.ContentProvider,
    mimeType: string,
  ): Workspace.UISourceCode.UISourceCode;
  removeFile(path: Platform.DevToolsPath.UrlString): void;
  reset(): void;
  dispose(): void;
}
