import * as Common from '../../../../core/common/common.js';
import * as UI from '../../legacy.js';
import { Provider } from './FilteredListWidget.js';
export declare class CommandMenu {
  private readonly commandsInternal;
  private constructor();
  static instance(opts?: { forceNew: boolean | null }): CommandMenu;
  static createCommand(options: CreateCommandOptions): Command;
  static createSettingCommand<V>(setting: Common.Settings.Setting<V>, title: string, value: V): Command;
  static createActionCommand(options: ActionCommandOptions): Command;
  static createRevealViewCommand(options: RevealViewCommandOptions): Command;
  private loadCommands;
  commands(): Command[];
}
export interface ActionCommandOptions {
  action: UI.ActionRegistration.Action;
  userActionCode?: number;
}
export interface RevealViewCommandOptions {
  id: string;
  title: string;
  tags: string;
  category: string;
  userActionCode?: number;
}
export interface CreateCommandOptions {
  category: string;
  keys: string;
  title: string;
  shortcut: string;
  executeHandler: () => void;
  availableHandler?: () => boolean;
  userActionCode?: number;
}
export declare class CommandMenuProvider extends Provider {
  private commands;
  constructor();
  attach(): void;
  detach(): void;
  itemCount(): number;
  itemKeyAt(itemIndex: number): string;
  itemScoreAt(itemIndex: number, query: string): number;
  renderItem(itemIndex: number, query: string, titleElement: Element, subtitleElement: Element): void;
  selectItem(itemIndex: number | null, _promptValue: string): void;
  notFoundText(): string;
}
export declare const MaterialPaletteColors: string[];
export declare class Command {
  private readonly categoryInternal;
  private readonly titleInternal;
  private readonly keyInternal;
  private readonly shortcutInternal;
  private readonly executeHandler;
  private readonly availableHandler?;
  constructor(
    category: string,
    title: string,
    key: string,
    shortcut: string,
    executeHandler: () => void,
    availableHandler?: () => boolean,
  );
  category(): string;
  title(): string;
  key(): string;
  shortcut(): string;
  available(): boolean;
  execute(): void;
}
export declare class ShowActionDelegate implements UI.ActionRegistration.ActionDelegate {
  static instance(opts?: { forceNew: boolean | null }): ShowActionDelegate;
  handleAction(_context: UI.Context.Context, _actionId: string): boolean;
}
