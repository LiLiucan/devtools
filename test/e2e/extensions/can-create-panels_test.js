"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const events_js_1 = require("../../conductor/events.js");
const helper_js_1 = require("../../shared/helper.js");
const extension_helpers_js_1 = require("../helpers/extension-helpers.js");
describe('The Extension API', async () => {
    it('can create panels with callbacks', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const callbackArgs = await extension.evaluate(() => new Promise(r => window.chrome.devtools.panels.create('extension-tab-title', /* iconPath=*/ '', /* resourcePath=*/ '', (...args) => r(JSON.stringify(args)))));
        chai_1.assert.deepEqual(callbackArgs, '[{"onShown":{},"onHidden":{},"onSearch":{}}]');
    });
    it('rejects absolute resource URLs', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const error = (0, events_js_1.expectError)('Extension server error: Invalid argument page: Resources paths cannot point to non-extension resources');
        // absolute URLs should report an error and not create a panel view
        await extension.evaluate(async () => {
            await new Promise(r => window.chrome.devtools.panels.create('extension-tab-title', /* iconPath=*/ '', /* resourcePath=*/ 'http://example.com', r));
        });
        await (0, helper_js_1.waitForFunction)(async () => error.caught);
        await (0, helper_js_1.waitForAriaNone)('extension-tab-title');
    });
    it('handles absolute resource paths correctly', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // We don't have a real extension host, so the extension origin will match the frontend
        const origin = await frontend.evaluate(() => document.location.origin);
        await extension.evaluate(async () => {
            await new Promise(r => window.chrome.devtools.panels.create('extension-tab-title', /* iconPath=*/ '', /* resourcePath=*/ '/blank.html', r));
        });
        const header = await (0, helper_js_1.waitForAria)('extension-tab-title');
        await header.click();
        const panel = await (0, helper_js_1.waitForAria)('extension-tab-title panel');
        const page = await (0, helper_js_1.waitFor)('iframe', panel);
        const target = await page.evaluate(e => e.src);
        chai_1.assert.strictEqual(target, `${origin}/blank.html`);
    });
    it('handles relative resource paths correctly', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // We don't have a real extension host, so the extension origin will match the frontend
        const origin = await frontend.evaluate(() => document.location.origin);
        await extension.evaluate(async () => {
            await new Promise(r => window.chrome.devtools.panels.create('extension-tab-title', /* iconPath=*/ '', /* resourcePath=*/ '/blank.html', r));
        });
        const header = await (0, helper_js_1.waitForAria)('extension-tab-title');
        await header.click();
        const panel = await (0, helper_js_1.waitForAria)('extension-tab-title panel');
        const page = await (0, helper_js_1.waitFor)('iframe', panel);
        const target = await page.evaluate(e => e.src);
        chai_1.assert.strictEqual(target, `${origin}/blank.html`);
    });
});
//# sourceMappingURL=can-create-panels_test.js.map