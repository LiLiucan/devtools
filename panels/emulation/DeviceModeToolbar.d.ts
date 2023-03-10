import * as Common from '../../core/common/common.js';
import * as EmulationModel from '../../models/emulation/emulation.js';
export declare class DeviceModeToolbar {
  private model;
  private readonly showMediaInspectorSetting;
  private readonly showRulersSetting;
  private readonly experimentDualScreenSupport;
  private readonly deviceOutlineSetting;
  private readonly showDeviceScaleFactorSetting;
  private readonly showUserAgentTypeSetting;
  private autoAdjustScaleSetting;
  private readonly lastMode;
  private readonly elementInternal;
  private readonly emulatedDevicesList;
  private readonly persistenceSetting;
  private spanButton;
  private modeButton;
  private widthInput;
  private heightInput;
  private deviceScaleItem;
  private deviceSelectItem;
  private scaleItem;
  private uaItem;
  private experimentalButton;
  private cachedDeviceScale;
  private cachedUaType;
  private xItem?;
  private throttlingConditionsItem?;
  private cachedModelType?;
  private cachedScale?;
  private cachedModelDevice?;
  private cachedModelMode?;
  constructor(
    model: EmulationModel.DeviceModeModel.DeviceModeModel,
    showMediaInspectorSetting: Common.Settings.Setting<boolean>,
    showRulersSetting: Common.Settings.Setting<boolean>,
  );
  private createEmptyToolbarElement;
  private fillLeftToolbar;
  private fillMainToolbar;
  private fillRightToolbar;
  private fillModeToolbar;
  private createExperimentalButton;
  private experimentalClicked;
  private fillOptionsToolbar;
  private appendScaleMenuItems;
  private onScaleMenuChanged;
  private onAutoAdjustScaleChanged;
  private appendDeviceScaleMenuItems;
  private appendUserAgentMenuItems;
  private appendOptionsMenuItems;
  private reset;
  private wrapToolbarItem;
  private emulateDevice;
  private switchToResponsive;
  private filterDevices;
  private standardDevices;
  private customDevices;
  private allDevices;
  private appendDeviceMenuItems;
  private deviceListChanged;
  private updateDeviceScaleFactorVisibility;
  private updateUserAgentTypeVisibility;
  private spanClicked;
  private modeMenuClicked;
  private getPrettyFitZoomPercentage;
  private getPrettyZoomPercentage;
  element(): Element;
  update(): void;
  restore(): void;
}
