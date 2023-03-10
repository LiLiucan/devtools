import type * as Platform from '../../core/platform/platform.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
export declare class AffectedSourcesView extends AffectedResourcesView {
  #private;
  protected getResourceNameWithCount(count: number): Platform.UIString.LocalizedString;
  update(): void;
}
