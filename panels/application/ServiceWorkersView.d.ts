import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare const setThrottleDisabledForDebugging: (enable: boolean) => void;
export declare class ServiceWorkersView
  extends UI.Widget.VBox
  implements SDK.TargetManager.SDKModelObserver<SDK.ServiceWorkerManager.ServiceWorkerManager>
{
  private currentWorkersView;
  private readonly toolbar;
  private readonly sections;
  private manager;
  private securityOriginManager;
  private readonly sectionToRegistration;
  private readonly eventListeners;
  constructor();
  modelAdded(serviceWorkerManager: SDK.ServiceWorkerManager.ServiceWorkerManager): void;
  modelRemoved(serviceWorkerManager: SDK.ServiceWorkerManager.ServiceWorkerManager): void;
  private getTimeStamp;
  private updateSectionVisibility;
  private registrationUpdated;
  private gcRegistrations;
  private getReportViewForOrigin;
  private updateRegistration;
  private registrationDeleted;
  private removeRegistrationFromList;
  private isRegistrationVisible;
  private updateListVisibility;
  wasShown(): void;
}
export declare class Section {
  private manager;
  section: UI.ReportView.Section;
  registration: SDK.ServiceWorkerManager.ServiceWorkerRegistration;
  private fingerprint;
  private readonly pushNotificationDataSetting;
  private readonly syncTagNameSetting;
  private readonly periodicSyncTagNameSetting;
  private readonly toolbar;
  private readonly updateCycleView;
  private readonly networkRequests;
  private readonly updateButton;
  private readonly deleteButton;
  private sourceField;
  private readonly statusField;
  private readonly clientsField;
  private readonly linkifier;
  private readonly clientInfoCache;
  private readonly throttler;
  private updateCycleField?;
  constructor(
    manager: SDK.ServiceWorkerManager.ServiceWorkerManager,
    section: UI.ReportView.Section,
    registration: SDK.ServiceWorkerManager.ServiceWorkerRegistration,
  );
  private createSyncNotificationField;
  scheduleUpdate(): void;
  private targetForVersionId;
  private addVersion;
  private updateClientsField;
  private updateSourceField;
  private update;
  private createLink;
  private unregisterButtonClicked;
  private createUpdateCycleField;
  private updateButtonClicked;
  private networkRequestsClicked;
  private push;
  private sync;
  private periodicSync;
  private onClientInfo;
  private updateClientInfo;
  private activateTarget;
  private startButtonClicked;
  private skipButtonClicked;
  private stopButtonClicked;
  private inspectButtonClicked;
  private wrapWidget;
}
