// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// IMPORTANT: this file is auto generated. Please do not edit this file.
/* istanbul ignore file */
const styles = new CSSStyleSheet();
styles.replaceSync(
  `/*
 * Copyright 2020 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
.resource-service-worker-update-view {
  display: block;
  margin: 6px;
  color: rgb(30% 30% 30%); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
  overflow: auto;
}

.service-worker-update-timing-table {
  border: 1px solid var(--color-details-hairline);
  border-spacing: 0;
  padding-left: 10px;
  padding-right: 10px;
  line-height: initial;
  table-layout: auto;
  overflow: hidden;
}

.service-worker-update-timing-row {
  position: relative;
  height: 20px;
  overflow: hidden;
  min-width: 80px;
}

.service-worker-update-timing-bar {
  position: absolute;
  min-width: 1px;
  top: 0;
  bottom: 0;
}

.service-worker-update-timing-bar-clickable::before {
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
  background-color: rgb(110 110 110); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

.service-worker-update-timing-bar-clickable {
  position: relative;
  left: -12px;
}

.service-worker-update-timing-bar-clickable:focus-visible {
  background-color: var(--color-background-elevation-1);
}

.service-worker-update-timing-bar-clickable[aria-checked="true"]::before {
  -webkit-mask-position: -16px 0;
}

.service-worker-update-timing-bar-details-collapsed {
  display: none;
}

.service-worker-update-timing-bar-details-expanded {
  display: table-row;
}

.service-worker-update-timing-bar-details:focus-visible {
  background-color: var(--legacy-selection-bg-color);
}

.service-worker-update-timing-bar.activate {
  top: 5px;
  height: 10px;
  background-color: #ff9800; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

.service-worker-update-timing-bar.wait {
  top: 5px;
  height: 10px;
  background-color: #9c27b0; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

.service-worker-update-timing-bar.install {
  top: 5px;
  height: 10px;
  background-color: #009688; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

.service-worker-update-timing-table > tr > td {
  padding: 4px 0;
  padding-right: 10px;
}

table.service-worker-update-timing-table > tr.service-worker-update-timing-table-header > td {
  border-top: 5px solid transparent;
  color: #737373; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

table.service-worker-update-timing-table > tr.service-worker-update-timing-bar-details > td:first-child {
  padding-left: 12px;
}

table.service-worker-update-timing-table > tr.service-worker-update-timeline > td:first-child {
  padding-left: 12px;
}

/*# sourceURL=serviceWorkerUpdateCycleView.css */
`,
);
export default styles;
