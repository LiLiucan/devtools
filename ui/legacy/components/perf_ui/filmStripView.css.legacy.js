// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// IMPORTANT: this file is auto generated. Please do not edit this file.
/* istanbul ignore file */
export default {
  cssContent: `/*
 * Copyright (c) 2015 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.film-strip-view {
  overflow-x: auto;
  overflow-y: hidden;
  align-content: flex-start;
  min-height: 81px;
}

.film-strip-view .frame .time {
  font-size: 10px;
  margin-top: 2px;
}

.film-strip-view.time-based .frame .time {
  display: none;
}

.film-strip-view .label {
  margin: auto;
  font-size: 18px;
  color: var(--color-text-secondary);
}

.film-strip-view .frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  flex: none;
  cursor: pointer;
}

.film-strip-view .frame .thumbnail {
  min-width: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  pointer-events: none;
  margin: 4px 0 2px;
  border: 2px solid transparent;
}

.film-strip-view .frame:hover .thumbnail,
.film-strip-view .frame:focus .thumbnail {
  border-color: var(--color-selection-highlight-border);
}

.film-strip-view .frame .thumbnail img {
  height: auto;
  width: auto;
  max-width: 80px;
  max-height: 50px;
  pointer-events: none;
  box-shadow: 0 0 3px var(--box-shadow-outline-color);
  flex: 0 0 auto;
}

.film-strip-view .frame:hover .thumbnail img,
.film-strip-view .frame:focus .thumbnail img {
  box-shadow: none;
}
`,
};
