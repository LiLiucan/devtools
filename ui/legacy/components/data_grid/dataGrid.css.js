// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// IMPORTANT: this file is auto generated. Please do not edit this file.
/* istanbul ignore file */
const styles = new CSSStyleSheet();
styles.replaceSync(
  `/*
 * Copyright 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.data-grid {
  position: relative;
  border: 1px solid var(--color-details-hairline-light) !important; /* stylelint-disable-line declaration-no-important */
  /* See: crbug.com/1152736 for color variable migration. */
  line-height: 120%;
}

.data-grid table {
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: separate;
  height: 100%;
  width: 100%;
}

.data-grid .data-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: overlay;
  transform: translateZ(0);
  background-color: var(--color-background);
}

.data-grid thead {
  position: sticky;
  top: 0;
  height: 21px;
  z-index: 1;
}

.data-grid .aria-live-label {
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.data-grid.inline .data-container {
  position: static;
}

.data-grid .corner {
  width: 14px;
  padding-right: 0;
  padding-left: 0;
  border-left: 0 none transparent !important; /* stylelint-disable-line declaration-no-important */
}

.data-grid.inline .corner {
  display: none;
}

.data-grid.data-grid-fits-viewport .corner {
  display: none;
}

.data-grid .top-filler-td,
.data-grid .bottom-filler-td {
  height: auto !important; /* stylelint-disable-line declaration-no-important */
  padding: 0 !important; /* stylelint-disable-line declaration-no-important */
}

.data-grid table.data {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-top: 0 none transparent;
  table-layout: fixed;
}

.data-grid.inline table.data {
  position: static;
}

.data-grid tbody tr {
  display: none;
  height: 20px;
}

.data-grid tbody tr.revealed {
  display: table-row;
}

.striped-data-grid .revealed.data-grid-data-grid-node:nth-child(odd):not(.dirty):not(.selected),
.striped-data-grid-starts-with-odd .revealed.data-grid-data-grid-node:nth-child(even):not(.dirty):not(.selected) {
  background-color: var(--color-background-elevation-1);
}

.data-grid td,
.data-grid th {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 18px;
  height: 18px;
  border-left: 1px solid var(--color-details-hairline);
  padding: 1px 4px;
}

.data-grid td {
  vertical-align: top;
  user-select: text;
}

.data-grid th {
  text-align: left;
  background-color: var(--color-background-elevation-1);
  border-bottom: 1px solid var(--color-details-hairline);
  font-weight: normal;
  vertical-align: middle;
}

.data-grid th:first-child,
.data-grid td:first-child {
  border-left: none !important; /* stylelint-disable-line declaration-no-important */
}

.data-grid td > div,
.data-grid th > div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 8px;
}

.data-grid td.editing > div {
  text-overflow: clip;
}

.data-grid .center {
  text-align: center;
}

.data-grid .right {
  text-align: right;
}

.data-grid th.sortable {
  position: relative;
}

.data-grid th .sort-order-icon-container {
  background-color: var(--color-background-elevation-1);
  min-width: 0;
  position: absolute;
  top: 1px;
  right: 0;
  bottom: 1px;
  display: flex;
  align-items: center;
}

.data-grid th:hover .sort-order-icon-container {
  background-color: var(--color-background-highlight);
}

.data-grid th .sort-order-icon {
  margin-right: 4px;
  margin-bottom: -2px;
  display: none;
}

.data-grid th.sort-ascending .sort-order-icon,
.data-grid th.sort-descending .sort-order-icon {
  display: block;
}

.data-grid th.sort-ascending,
.data-grid th.sort-descending {
  padding-right: 14px;
}

.data-grid th.sortable:hover {
  background-color: var(--color-background-highlight);
}

.data-grid .top-filler-td {
  border-bottom: 0 none transparent;
  line-height: 0;
}

.data-grid button {
  line-height: 18px;
  color: inherit;
}

.data-grid td.disclosure::before {
  user-select: none;
  -webkit-mask-image: var(--image-file-treeoutlineTriangles);
  -webkit-mask-position: 0 0;
  -webkit-mask-size: 32px 24px;
  float: left;
  width: 8px;
  height: 12px;
  margin-right: 2px;
  content: "";
  position: relative;
  top: 3px;
  background-color: var(--color-text-secondary);
}

.data-grid tr:not(.parent) td.disclosure::before {
  background-color: transparent;
}

.data-grid tr.expanded td.disclosure::before {
  -webkit-mask-position: -16px 0;
}

.data-grid tbody tr.revealed.selected {
  background-color: var(--color-background-highlight);
  color: inherit;
}

.data-grid tbody tr.revealed.selected.dirty {
  color: var(--color-selected-option);
}

.data-grid.no-selection:focus-visible {
  border: 1px solid var(--color-primary) !important; /* stylelint-disable-line declaration-no-important */
}

.data-grid:focus tbody tr.selected {
  background-color: var(--color-selected-option-background);
  color: var(--color-selected-option);
}

.data-grid tbody tr.selected.dirty {
  --override-data-grid-dirty-background-color: hsl(0deg 100% 30%);

  background-color: var(--override-data-grid-dirty-background-color);
}

.data-grid:focus tr.selected.dirty {
  --override-data-grid-dirty-background-color: hsl(0deg 100% 70%);
}

.data-grid:focus tr.selected .devtools-link {
  color: var(--color-selected-option);
}

.data-grid:focus tr.parent.selected td.disclosure::before {
  background-color: var(--color-selected-option);
  -webkit-mask-position: 0 0;
}

.data-grid:focus tr.expanded.selected td.disclosure::before {
  background-color: var(--color-selected-option);
  -webkit-mask-position: -16px 0;
}

.data-grid tr.inactive {
  color: var(--color-text-disabled);
  font-style: italic;
}

.data-grid tr.dirty {
  --override-data-grid-dirty-background-color: hsl(0deg 100% 92%);

  background-color: var(--override-data-grid-dirty-background-color);
  color: var(--color-red);
  font-style: normal;
}

.data-grid td.show-more {
  white-space: normal;
}

.data-grid td.show-more::before {
  display: none;
}

.data-grid-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  z-index: 500;
}

@media (forced-colors: active) {
  .sort-order-icon-container [is="ui-icon"].icon-mask,
  .data-grid td.disclosure::before {
    forced-color-adjust: none;
    background-color: ButtonText;
  }

  .data-grid.no-selection:focus-visible * {
    color: ButtonText;
  }

  .data-grid th.sortable:hover *,
  .data-grid th.sortable:hover .sort-order-icon-container [is="ui-icon"].icon-mask,
  .data-grid tr.parent.selected td.disclosure::before,
  .data-grid:focus tr.parent.selected td.disclosure::before,
  .data-grid tbody tr.parent.revealed:hover td.disclosure::before {
    background-color: HighlightText;
  }

  .striped-data-grid .revealed.data-grid-data-grid-node:nth-child(odd):not(.dirty):not(.selected),
  .striped-data-grid-starts-with-odd .revealed.data-grid-data-grid-node:nth-child(even):not(.dirty):not(.selected),
  .request-cookies-view tr.revealed.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(2n),
  .cookies-table tr.revealed.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(odd) {
    background-color: canvas;
  }

  .data-grid.no-selection:focus-visible {
    forced-color-adjust: none;
    border-color: Highlight;
  }

  .data-grid th.sortable:hover,
  .data-grid tbody tr.revealed:hover,
  .data-grid tbody tr.revealed.selected,
  .striped-data-grid .revealed:hover.data-grid-data-grid-node:nth-child(odd):not(.dirty):not(.selected),
  .striped-data-grid-starts-with-odd .revealed:hover.data-grid-data-grid-node:nth-child(even):not(.dirty):not(.selected),
  .request-cookies-view tr.revealed:hover.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(2n),
  .cookies-table tr.revealed:hover.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(odd) {
    forced-color-adjust: none;
    background-color: Highlight;
  }

  .data-grid tbody tr.revealed:hover *,
  .data-grid tbody tr.revealed.selected *,
  .data-grid tbody tr.revealed:focus *,
  .data-grid tbody tr.revealed:hover .heap-object-tag {
    color: HighlightText;
  }

  .data-grid th {
    background-color: canvas;
    border-color: Highlight;
  }
}

/*# sourceURL=dataGrid.css */
`,
);
export default styles;
