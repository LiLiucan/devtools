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

:host {
  user-select: none;
  padding: 4px 12px 12px;
}

.error-input {
  box-shadow: 0 0 0 1px var(--color-accent-red);
}

.error-text {
  color: var(--color-accent-red);
  padding: 6px 0;
}

.warning-input {
  --override-warning-input-color: #ffdd9e;

  box-shadow: 0 0 0 1px var(--override-warning-input-color);
}

.-theme-with-dark-background .warning-input,
:host-context(.-theme-with-dark-background) .warning-input {
  --override-warning-input-color: rgb(97 63 0);
}

.hide-warning {
  display: none;
}

.font-section-header {
  font-weight: normal;
  font-size: 17px;
  text-align: left;
}

.font-section-subheader {
  font-size: 12px;
  text-align: left;
  font-weight: bold;
}

.font-selector-section {
  overflow-y: auto;
  padding-bottom: 10px;
}

.font-selector-input {
  width: 204px;
  text-align-last: center;
}

.font-reset-button {
  width: 100%;
  margin-top: 10px;
}

.font-section {
  border-top: 1px solid var(--color-details-hairline);
}

.chrome-select.font-editor-select {
  min-width: 50px;
  min-height: 27px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  display: none;
  margin: 0;
}

.preview-text {
  max-width: 300px;
  word-break: break-word;
  display: block;
}

.rendered-font-list-label {
  font-weight: bold;
  font-size: 12px;
}

.rendered-font-list {
  padding: 5px 0;
}

.shadow-editor-field {
  height: 24px;
  margin-top: 8px;
  font-size: 12px;
  flex-shrink: 0;
}

.shadow-editor-field:last-of-type {
  margin-bottom: 8px;
}

.shadow-editor-flex-field {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.shadow-editor-field.shadow-editor-blur-field {
  margin-top: 40px;
}

.shadow-editor-2D-slider {
  position: absolute;
  height: 88px;
  width: 88px;
  border: 1px solid var(--divider-line);
  border-radius: 2px;
}

.shadow-editor-label {
  display: inline-block;
  width: 70px;
  height: 24px;
  line-height: 24px;
  margin-right: 8px;
  text-align: left;
}

.shadow-editor-button-left,
.shadow-editor-button-right {
  width: 74px;
  height: 24px;
  padding: 3px 7px;
  line-height: 16px;
  border: 1px solid var(--divider-line);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  text-align: center;
  font-weight: 500;
}

.shadow-editor-button-left {
  border-radius: 2px 0 0 2px;
}

.shadow-editor-button-right {
  border-radius: 0 2px 2px 0;
  border-left-width: 0;
}

.shadow-editor-button-left:hover,
.shadow-editor-button-right:hover {
  box-shadow: 0 1px 1px var(--divider-line);
}

.shadow-editor-button-left:focus,
.shadow-editor-button-right:focus {
  background-color: var(--color-background-elevation-1);
}

.shadow-editor-text-input {
  width: 50px;
  margin: 8px;
  text-align: center;
  box-shadow: var(--legacy-focus-ring-inactive-shadow);
}

.spectrum-switcher {
  border-radius: 2px;
  height: 20px;
  width: 20px;
  padding: 2px;
  margin-left: 5px;
}

.spectrum-switcher:hover {
  background-color: var(--color-background-elevation-1);
}

.spectrum-switcher:focus-visible {
  background-color: var(--legacy-focus-bg-color);
}

/*# sourceURL=fontEditor.css */
`,
);
export default styles;
