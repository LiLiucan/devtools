import * as Common from '../../core/common/common.js';
import * as Settings from '../components/settings/settings.js';
export declare const createSettingCheckbox: (
  name: string,
  setting: Common.Settings.Setting<boolean>,
  omitParagraphElement?: boolean,
  tooltip?: string,
) => Element;
export declare const bindCheckbox: (inputElement: Element, setting: Common.Settings.Setting<boolean>) => void;
export declare const createCustomSetting: (name: string, element: Element) => Element;
export declare const createControlForSetting: (
  setting: Common.Settings.Setting<unknown>,
  subtitle?: string,
) => Element | null;
export interface SettingUI {
  settingElement(): Element | null;
}
