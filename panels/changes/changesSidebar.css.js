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

.tree-outline {
  /**
   * These variables (and the dark mode variants) are duplicated from
   * navigatorTree.css. They will be de-duped and tidied up as part of
   * crbug.com/1210894
   */
  --override-script-snippet-tree-item-color: hsl(48deg 70% 50%);
  --override-stylesheet-tree-item-color: hsl(256deg 50% 50%);
  --override-image-font-tree-item-color: hsl(109deg 33% 50%);
}

.-theme-with-dark-background .tree-outline,
:host-context(.-theme-with-dark-background) .tree-outline {
  --override-script-snippet-tree-item-color: rgb(217 181 38);
  --override-stylesheet-tree-item-color: rgb(98 64 191);
  --override-image-font-tree-item-color: rgb(101 170 85);
}

li .icon {
  margin: -3px -5px;
  background: var(--color-background-elevation-2);
}

.tree-outline li {
  min-height: 20px;
}

.tree-outline li:hover:not(.selected) .selection {
  display: block;
  background-color: var(--item-hover-color);
}

.navigator-sm-script-tree-item .icon,
.navigator-script-tree-item .icon,
.navigator-snippet-tree-item .icon {
  background: var(--override-script-snippet-tree-item-color);
}

.navigator-sm-stylesheet-tree-item .icon,
.navigator-stylesheet-tree-item .icon {
  background: var(--override-stylesheet-tree-item-color);
}

.navigator-image-tree-item .icon,
.navigator-font-tree-item .icon {
  background: var(--override-image-font-tree-item-color);
}

@media (forced-colors: active) {
  li .icon,
  .navigator-sm-script-tree-item .icon,
  .navigator-script-tree-item .icon,
  .navigator-snippet-tree-item .icon,
  .navigator-sm-stylesheet-tree-item .icon,
  .navigator-stylesheet-tree-item .icon,
  .navigator-image-tree-item .icon,
  .navigator-font-tree-item .icon {
    background-color: ButtonText;
    background-image: none;
    forced-color-adjust: none;
  }
}

/*# sourceURL=changesSidebar.css */
`,
);
export default styles;
