import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import type * as Protocol from '../../generated/protocol.js';
import { type NetworkRequest } from './NetworkRequest.js';
import { type ResourceTreeFrame, type ResourceTreeModel } from './ResourceTreeModel.js';
export declare class Resource implements TextUtils.ContentProvider.ContentProvider {
  #private;
  constructor(
    resourceTreeModel: ResourceTreeModel,
    request: NetworkRequest | null,
    url: Platform.DevToolsPath.UrlString,
    documentURL: Platform.DevToolsPath.UrlString,
    frameId: Protocol.Page.FrameId | null,
    loaderId: Protocol.Network.LoaderId | null,
    type: Common.ResourceType.ResourceType,
    mimeType: string,
    lastModified: Date | null,
    contentSize: number | null,
  );
  lastModified(): Date | null;
  contentSize(): number | null;
  get request(): NetworkRequest | null;
  get url(): Platform.DevToolsPath.UrlString;
  set url(x: Platform.DevToolsPath.UrlString);
  get parsedURL(): Common.ParsedURL.ParsedURL | undefined;
  get documentURL(): Platform.DevToolsPath.UrlString;
  get frameId(): Protocol.Page.FrameId | null;
  get loaderId(): Protocol.Network.LoaderId | null;
  get displayName(): string;
  resourceType(): Common.ResourceType.ResourceType;
  get mimeType(): string;
  get content(): string | null;
  get isGenerated(): boolean;
  set isGenerated(val: boolean);
  contentURL(): Platform.DevToolsPath.UrlString;
  contentType(): Common.ResourceType.ResourceType;
  requestContent(): Promise<TextUtils.ContentProvider.DeferredContent>;
  canonicalMimeType(): string;
  searchInContent(
    query: string,
    caseSensitive: boolean,
    isRegex: boolean,
  ): Promise<TextUtils.ContentProvider.SearchMatch[]>;
  populateImageSource(image: HTMLImageElement): Promise<void>;
  private requestFinished;
  private innerRequestContent;
  hasTextContent(): boolean;
  frame(): ResourceTreeFrame | null;
  statusCode(): number;
}
