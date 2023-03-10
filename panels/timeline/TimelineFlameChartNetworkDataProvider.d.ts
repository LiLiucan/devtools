import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import { type PerformanceModel } from './PerformanceModel.js';
import { TimelineSelection } from './TimelinePanel.js';
export declare class TimelineFlameChartNetworkDataProvider implements PerfUI.FlameChart.FlameChartDataProvider {
  private readonly font;
  private readonly style;
  private group;
  private minimumBoundaryInternal;
  private maximumBoundary;
  private timeSpan;
  private requests;
  private maxLevel;
  private model?;
  private timelineDataInternal?;
  private startTime?;
  private endTime?;
  private lastSelection?;
  private priorityToValue?;
  constructor();
  setModel(performanceModel: PerformanceModel | null): void;
  isEmpty(): boolean;
  maxStackDepth(): number;
  timelineData(): PerfUI.FlameChart.TimelineData;
  minimumBoundary(): number;
  totalTime(): number;
  setWindowTimes(startTime: number, endTime: number): void;
  createSelection(index: number): TimelineSelection | null;
  entryIndexForSelection(selection: TimelineSelection | null): number;
  entryColor(index: number): string;
  textColor(_index: number): string;
  entryTitle(index: number): string | null;
  entryFont(_index: number): string | null;
  decorateEntry(
    index: number,
    context: CanvasRenderingContext2D,
    text: string | null,
    barX: number,
    barY: number,
    barWidth: number,
    barHeight: number,
    unclippedBarX: number,
    timeToPixelRatio: number,
  ): boolean;
  forceDecoration(_index: number): boolean;
  prepareHighlightedEntryInfo(index: number): Element | null;
  private colorForPriority;
  private appendTimelineData;
  private updateTimelineData;
  private appendEntry;
  preferredHeight(): number;
  isExpanded(): boolean;
  formatValue(value: number, precision?: number): string;
  canJumpToEntry(_entryIndex: number): boolean;
  navStartTimes(): Map<any, any>;
}
