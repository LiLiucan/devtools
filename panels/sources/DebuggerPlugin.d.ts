import * as Common from '../../core/common/common.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as CodeMirror from '../../third_party/codemirror.next/codemirror.next.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import type * as TextEditor from '../../ui/components/text_editor/text_editor.js';
import { Plugin } from './Plugin.js';
export declare class DebuggerPlugin extends Plugin {
  private readonly transformer;
  private editor;
  private executionLocation;
  private controlDown;
  private controlTimeout;
  private sourceMapInfobar;
  private readonly scriptsPanel;
  private readonly breakpointManager;
  private popoverHelper;
  private scriptFileForDebuggerModel;
  private breakpoints;
  private continueToLocations;
  private readonly liveLocationPool;
  private muted;
  private initializedMuted;
  private ignoreListInfobar;
  private prettyPrintInfobar;
  private refreshBreakpointsTimeout;
  private activeBreakpointDialog;
  private missingDebugInfoBar;
  private readonly ignoreListCallback;
  constructor(uiSourceCode: Workspace.UISourceCode.UISourceCode, transformer: SourceFrame.SourceFrame.Transformer);
  editorExtension(): CodeMirror.Extension;
  private shortcutHandlers;
  editorInitialized(editor: TextEditor.TextEditor.TextEditor): void;
  static accepts(uiSourceCode: Workspace.UISourceCode.UISourceCode): boolean;
  private showIgnoreListInfobarIfNeeded;
  attachInfobar(bar: UI.Infobar.Infobar): void;
  removeInfobar(bar: UI.Infobar.Infobar | null): void;
  private hideIgnoreListInfobar;
  willHide(): void;
  editBreakpointLocation({ breakpoint, uiLocation }: Bindings.BreakpointManager.BreakpointLocation): void;
  populateLineGutterContextMenu(contextMenu: UI.ContextMenu.ContextMenu, editorLineNumber: number): void;
  populateTextAreaContextMenu(contextMenu: UI.ContextMenu.ContextMenu): void;
  private workingCopyChanged;
  private workingCopyCommitted;
  private didMergeToVM;
  private didDivergeFromVM;
  private setMuted;
  private consistentScripts;
  private isVariableIdentifier;
  private isIdentifier;
  private getPopoverRequest;
  private onEditorUpdate;
  private onWheel;
  private onKeyDown;
  private onMouseMove;
  private onMouseDown;
  private onBlur;
  private onKeyUp;
  private setControlDown;
  private editBreakpointCondition;
  private computeExecutionDecorations;
  private updateValueDecorations;
  private computeValueDecorations;
  getVariablesByLine(
    editorState: CodeMirror.EditorState,
    variableMap: Map<string, unknown>,
    fromLoc: {
      lineNumber: number;
      columnNumber: number;
    },
    toLoc: {
      lineNumber: number;
      columnNumber: number;
    },
  ): Map<number, Set<string>> | null;
  private showContinueToLocations;
  private clearContinueToLocations;
  private asyncStepIn;
  private fetchBreakpoints;
  private lineBreakpoints;
  private computeBreakpointDecoration;
  private restoreBreakpointsAfterEditing;
  private refreshBreakpoints;
  private breakpointChange;
  onInlineBreakpointMarkerClick(event: MouseEvent, breakpoint: Bindings.BreakpointManager.Breakpoint | null): void;
  onInlineBreakpointMarkerContextMenu(
    event: MouseEvent,
    breakpoint: Bindings.BreakpointManager.Breakpoint | null,
  ): void;
  private updateScriptFiles;
  private updateScriptFile;
  private updateMissingDebugInfoInfobar;
  private showSourceMapInfobar;
  private detectMinified;
  private handleGutterClick;
  private toggleBreakpoint;
  private createNewBreakpoint;
  private setBreakpoint;
  private breakpointWasSetForTest;
  private callFrameChanged;
  private setExecutionLocation;
  dispose(): void;
}
export declare class BreakpointLocationRevealer implements Common.Revealer.Revealer {
  static instance({ forceNew }?: { forceNew: boolean }): BreakpointLocationRevealer;
  reveal(breakpointLocation: Object, omitFocus?: boolean | undefined): Promise<void>;
}
