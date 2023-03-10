import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { WebAudioModel } from './WebAudioModel.js';
export declare class WebAudioView
  extends UI.ThrottledWidget.ThrottledWidget
  implements SDK.TargetManager.SDKModelObserver<WebAudioModel>
{
  private readonly contextSelector;
  private readonly contentContainer;
  private readonly detailViewContainer;
  private graphManager;
  private readonly landingPage;
  private readonly summaryBarContainer;
  constructor();
  static instance(opts?: { forceNew: null }): WebAudioView;
  wasShown(): void;
  willHide(): void;
  modelAdded(webAudioModel: WebAudioModel): void;
  modelRemoved(webAudioModel: WebAudioModel): void;
  doUpdate(): Promise<void>;
  private addEventListeners;
  private removeEventListeners;
  private contextCreated;
  private contextDestroyed;
  private contextChanged;
  private reset;
  private suspendModel;
  private audioListenerCreated;
  private audioListenerWillBeDestroyed;
  private audioNodeCreated;
  private audioNodeWillBeDestroyed;
  private audioParamCreated;
  private audioParamWillBeDestroyed;
  private nodesConnected;
  private nodesDisconnected;
  private nodeParamConnected;
  private nodeParamDisconnected;
  private updateDetailView;
  private updateSummaryBar;
  private clearSummaryBar;
  private pollRealtimeData;
}
