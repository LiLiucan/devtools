import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import type * as TextUtils from '../text_utils/text_utils.js';
import { type IsolatedFileSystemManager } from './IsolatedFileSystemManager.js';
import { PlatformFileSystem } from './PlatformFileSystem.js';
export declare class IsolatedFileSystem extends PlatformFileSystem {
  private readonly manager;
  private readonly embedderPathInternal;
  private readonly domFileSystem;
  private readonly excludedFoldersSetting;
  private excludedFoldersInternal;
  private readonly excludedEmbedderFolders;
  private readonly initialFilePathsInternal;
  private readonly initialGitFoldersInternal;
  private readonly fileLocks;
  constructor(
    manager: IsolatedFileSystemManager,
    path: Platform.DevToolsPath.UrlString,
    embedderPath: Platform.DevToolsPath.RawPathString,
    domFileSystem: FileSystem,
    type: string,
  );
  static create(
    manager: IsolatedFileSystemManager,
    path: Platform.DevToolsPath.UrlString,
    embedderPath: Platform.DevToolsPath.RawPathString,
    type: string,
    name: string,
    rootURL: string,
  ): Promise<IsolatedFileSystem | null>;
  static errorMessage(error: DOMError): string;
  private serializedFileOperation;
  getMetadata(path: Platform.DevToolsPath.EncodedPathString): Promise<Metadata | null>;
  initialFilePaths(): Platform.DevToolsPath.EncodedPathString[];
  initialGitFolders(): Platform.DevToolsPath.EncodedPathString[];
  embedderPath(): Platform.DevToolsPath.RawPathString;
  private initializeFilePaths;
  private createFoldersIfNotExist;
  private innerCreateFolderIfNeeded;
  createFile(
    path: Platform.DevToolsPath.EncodedPathString,
    name: Platform.DevToolsPath.RawPathString | null,
  ): Promise<Platform.DevToolsPath.EncodedPathString | null>;
  deleteFile(path: Platform.DevToolsPath.EncodedPathString): Promise<boolean>;
  requestFileBlob(path: Platform.DevToolsPath.EncodedPathString): Promise<Blob | null>;
  requestFileContent(path: Platform.DevToolsPath.EncodedPathString): Promise<TextUtils.ContentProvider.DeferredContent>;
  private innerRequestFileContent;
  setFileContent(path: Platform.DevToolsPath.EncodedPathString, content: string, isBase64: boolean): Promise<void>;
  renameFile(
    path: Platform.DevToolsPath.EncodedPathString,
    newName: Platform.DevToolsPath.RawPathString,
    callback: (arg0: boolean, arg1?: string | undefined) => void,
  ): void;
  private readDirectory;
  private requestEntries;
  private saveExcludedFolders;
  addExcludedFolder(path: Platform.DevToolsPath.EncodedPathString): void;
  removeExcludedFolder(path: Platform.DevToolsPath.EncodedPathString): void;
  fileSystemRemoved(): void;
  isFileExcluded(folderPath: Platform.DevToolsPath.EncodedPathString): boolean;
  excludedFolders(): Set<Platform.DevToolsPath.EncodedPathString>;
  searchInPath(query: string, progress: Common.Progress.Progress): Promise<string[]>;
  indexContent(progress: Common.Progress.Progress): void;
  mimeFromPath(path: Platform.DevToolsPath.UrlString): string;
  canExcludeFolder(path: Platform.DevToolsPath.EncodedPathString): boolean;
  contentType(path: string): Common.ResourceType.ResourceType;
  tooltipForURL(url: Platform.DevToolsPath.UrlString): string;
  supportsAutomapping(): boolean;
}
export declare const BinaryExtensions: Set<string>;
