'use strict';
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, '__esModule', { value: true });
const chai_1 = require('chai');
const helper_js_1 = require('../../shared/helper.js');
const mocha_extensions_js_1 = require('../../shared/mocha-extensions.js');
const coverage_helpers_js_1 = require('../helpers/coverage-helpers.js');
(0, mocha_extensions_js_1.describe)('The Coverage Panel', async () => {
  (0, mocha_extensions_js_1.it)('Loads correctly', async () => {
    await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
  });
  (0, mocha_extensions_js_1.it)('Can start and stop instrumenting coverage', async () => {
    await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
    await (0, coverage_helpers_js_1.navigateToCoverageTestSite)();
    await (0, coverage_helpers_js_1.startInstrumentingCoverage)();
    await (0, coverage_helpers_js_1.stopInstrumentingCoverage)();
    await (0, coverage_helpers_js_1.clearCoverageContent)();
  });
  (0, mocha_extensions_js_1.it)('Shows completly uncovered css files', async () => {
    const { target } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.goToResource)('coverage/unused-css-coverage.html');
    await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
    await (0, coverage_helpers_js_1.startInstrumentingCoverage)();
    const URL_PREFIX = `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/coverage`;
    chai_1.assert.deepEqual(await (0, coverage_helpers_js_1.getCoverageData)(5), [
      {
        total: '283',
        unused: '276',
        url: `${URL_PREFIX}/unused-css-coverage.html`,
      },
      {
        total: '198',
        unused: '198',
        url: `${URL_PREFIX}/not-initially-used.css`,
      },
      {
        total: '196',
        unused: '196',
        url: `${URL_PREFIX}/unused.css`,
      },
      {
        total: '198',
        unused: '174',
        url: `${URL_PREFIX}/used.css`,
      },
      {
        total: '0',
        unused: '0',
        url: `${URL_PREFIX}/empty.css`,
      },
    ]);
    await target.evaluate('appendStylesheet()');
    chai_1.assert.deepInclude(await (0, coverage_helpers_js_1.getCoverageData)(6), {
      total: '0',
      unused: '0',
      url: `${URL_PREFIX}/lazily-loaded.css`,
    });
    await target.evaluate('appendElement()');
    await (0, helper_js_1.waitForElementWithTextContent)(`${URL_PREFIX}/not-initially-used.cssCSS198198100%`);
    chai_1.assert.deepInclude(await (0, coverage_helpers_js_1.getCoverageData)(6), {
      total: '198',
      unused: '198',
      url: `${URL_PREFIX}/not-initially-used.css`,
    });
  });
});
//# sourceMappingURL=coverage_test.js.map
