import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import type * as Protocol from '../../generated/protocol.js';
import { type Edit } from './CSSModel.js';
import { type CSSStyleDeclaration } from './CSSStyleDeclaration.js';
export declare class CSSProperty {
  #private;
  ownerStyle: CSSStyleDeclaration;
  index: number;
  name: string;
  value: string;
  important: boolean;
  disabled: boolean;
  parsedOk: boolean;
  implicit: boolean;
  text: string | null | undefined;
  range: TextUtils.TextRange.TextRange | null;
  constructor(
    ownerStyle: CSSStyleDeclaration,
    index: number,
    name: string,
    value: string,
    important: boolean,
    disabled: boolean,
    parsedOk: boolean,
    implicit: boolean,
    text?: string | null,
    range?: Protocol.CSS.SourceRange,
    longhandProperties?: Protocol.CSS.CSSProperty[],
  );
  static parsePayload(ownerStyle: CSSStyleDeclaration, index: number, payload: Protocol.CSS.CSSProperty): CSSProperty;
  private ensureRanges;
  nameRange(): TextUtils.TextRange.TextRange | null;
  valueRange(): TextUtils.TextRange.TextRange | null;
  rebase(edit: Edit): void;
  setActive(active: boolean): void;
  get propertyText(): string | null;
  activeInStyle(): boolean;
  trimmedValueWithoutImportant(): string;
  setText(propertyText: string, majorChange: boolean, overwrite?: boolean): Promise<boolean>;
  static formatStyle(styleText: string, indentation: string, endIndentation: string): Promise<string>;
  private detectIndentation;
  setValue(newValue: string, majorChange: boolean, overwrite: boolean, userCallback?: (arg0: boolean) => void): void;
  setDisabled(disabled: boolean): Promise<boolean>;
  /**
   * This stores the warning string when a CSS Property is improperly parsed.
   */
  setDisplayedStringForInvalidProperty(invalidString: Common.UIString.LocalizedString): void;
  /**
   * Retrieve the warning string for a screen reader to announce when editing the property.
   */
  getInvalidStringForInvalidProperty(): Common.UIString.LocalizedString | undefined;
  getLonghandProperties(): CSSProperty[];
}
