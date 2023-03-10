/**
 * Metadata to map between bytecode #offsets and line numbers in the
 * disassembly for WebAssembly modules.
 */
interface FunctionBodyOffset {
  start: number;
  end: number;
}
export declare class WasmDisassembly {
  #private;
  readonly lines: string[];
  constructor(lines: string[], offsets: number[], functionBodyOffsets: FunctionBodyOffset[]);
  get lineNumbers(): number;
  bytecodeOffsetToLineNumber(bytecodeOffset: number): number;
  lineNumberToBytecodeOffset(lineNumber: number): number;
  /**
   * returns an iterable enumerating all the non-breakable line numbers in the disassembly
   */
  nonBreakableLineNumbers(): Iterable<number>;
}
export {};
