import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { type StylePropertiesSection } from './StylePropertiesSection.js';
import { StylesSidebarPane } from './StylesSidebarPane.js';
import { type Hint } from './CSSRuleValidator.js';
export declare const activeHints: WeakMap<Element, Hint>;
export declare class StylePropertyTreeElement extends UI.TreeOutline.TreeElement {
  #private;
  private readonly style;
  private matchedStylesInternal;
  property: SDK.CSSProperty.CSSProperty;
  private readonly inheritedInternal;
  private overloadedInternal;
  private parentPaneInternal;
  isShorthand: boolean;
  private readonly applyStyleThrottler;
  private newProperty;
  private expandedDueToFilter;
  valueElement: HTMLElement | null;
  nameElement: HTMLElement | null;
  private expandElement;
  private originalPropertyText;
  private hasBeenEditedIncrementally;
  private prompt;
  private lastComputedValue;
  private computedStyles;
  private parentsComputedStyles;
  private contextForTest;
  constructor(
    stylesPane: StylesSidebarPane,
    matchedStyles: SDK.CSSMatchedStyles.CSSMatchedStyles,
    property: SDK.CSSProperty.CSSProperty,
    isShorthand: boolean,
    inherited: boolean,
    overloaded: boolean,
    newProperty: boolean,
  );
  matchedStyles(): SDK.CSSMatchedStyles.CSSMatchedStyles;
  private editable;
  inherited(): boolean;
  overloaded(): boolean;
  setOverloaded(x: boolean): void;
  setComputedStyles(computedStyles: Map<string, string> | null): void;
  setParentsComputedStyles(parentsComputedStyles: Map<string, string> | null): void;
  get name(): string;
  get value(): string;
  updateFilter(): boolean;
  private processColor;
  private processVar;
  private handleVarDefinitionActivate;
  private addColorContrastInfo;
  renderedPropertyText(): string;
  private processBezier;
  private processFont;
  private processShadow;
  private processGrid;
  private processAngle;
  private processLength;
  private updateState;
  node(): SDK.DOMModel.DOMNode | null;
  parentPane(): StylesSidebarPane;
  section(): StylePropertiesSection | null;
  private updatePane;
  private toggleDisabled;
  private isPropertyChanged;
  onpopulate(): Promise<void>;
  onattach(): void;
  onexpand(): void;
  oncollapse(): void;
  private updateExpandElement;
  updateTitleIfComputedValueChanged(): void;
  updateTitle(): void;
  private innerUpdateTitle;
  updateAuthoringHint(): void;
  private updateFontVariationSettingsWarning;
  private mouseUp;
  private handleContextMenuEvent;
  private handleCopyContextMenuEvent;
  createCopyContextMenu(event: Event): UI.ContextMenu.ContextMenu;
  private viewComputedValue;
  private copyCssDeclarationAsJs;
  private copyAllCssDeclarationAsJs;
  private navigateToSource;
  startEditing(selectElement?: Element | null): void;
  private editingNameValueKeyDown;
  private editingNameValueKeyPress;
  private applyFreeFlowStyleTextEdit;
  kickFreeFlowStyleEditForTest(): Promise<void>;
  editingEnded(context: Context): void;
  editingCancelled(element: Element | null, context: Context): void;
  private applyOriginalStyle;
  private findSibling;
  private editingCommitted;
  private removePrompt;
  styleTextAppliedForTest(): void;
  applyStyleText(styleText: string, majorChange: boolean, property?: SDK.CSSProperty.CSSProperty | null): Promise<void>;
  private innerApplyStyleText;
  ondblclick(): boolean;
  isEventWithinDisclosureTriangle(event: Event): boolean;
}
export interface Context {
  expanded: boolean;
  hasChildren: boolean;
  isEditingName: boolean;
  originalProperty?: SDK.CSSProperty.CSSProperty;
  originalName?: string;
  originalValue?: string;
  previousContent: string;
}
