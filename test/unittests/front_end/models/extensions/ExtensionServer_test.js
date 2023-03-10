// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Extensions from '../../../../../front_end/models/extensions/extensions.js';
const { assert } = chai;
describe('Extensions', () => {
    function cleanup() {
        try {
            delete window.chrome;
        }
        catch {
            // Eat errors in headful mode
        }
    }
    beforeEach(cleanup);
    afterEach(cleanup);
    it('can register a recorder extension', async () => {
        const server = Extensions.ExtensionServer.ExtensionServer.instance({ forceNew: true });
        const extensionDescriptor = {
            startPage: 'blank.html',
            name: 'TestExtension',
            exposeExperimentalAPIs: true,
        };
        server.addExtensionForTest(extensionDescriptor, window.location.origin);
        const chrome = {};
        window.chrome = chrome;
        self.injectedExtensionAPI(extensionDescriptor, 'main', 'dark', [], () => { }, 1, window);
        class RecorderPlugin {
            async stringify(recording) {
                return JSON.stringify(recording);
            }
            async stringifyStep(step) {
                return JSON.stringify(step);
            }
        }
        await chrome.devtools?.recorder.registerRecorderExtensionPlugin(new RecorderPlugin(), 'Test', 'text/javascript');
        const manager = Extensions.RecorderPluginManager.RecorderPluginManager.instance();
        assert.strictEqual(manager.plugins().length, 1);
        const plugin = manager.plugins()[0];
        const result = await plugin.stringify({
            name: 'test',
            steps: [],
        });
        const stepResult = await plugin.stringifyStep({
            type: 'scroll',
        });
        assert.strictEqual(manager.plugins().length, 1);
        assert.strictEqual(manager.plugins()[0].getMediaType(), 'text/javascript');
        assert.strictEqual(manager.plugins()[0].getName(), 'Test');
        assert.deepStrictEqual(result, '{"name":"test","steps":[]}');
        assert.deepStrictEqual(stepResult, '{"type":"scroll"}');
    });
    it('can correctly expand resource paths', async () => {
        // Ideally this would be a chrome-extension://, but that doesn't work with URL in chrome headless.
        const extensionOrigin = 'chrome://abcdef';
        const almostOrigin = `${extensionOrigin}/`;
        const expectation = `${extensionOrigin}/foo`;
        assert.strictEqual(undefined, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(extensionOrigin, 'http://example.com/foo'));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(extensionOrigin, expectation));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(extensionOrigin, '/foo'));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(extensionOrigin, 'foo'));
        assert.strictEqual(undefined, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(almostOrigin, 'http://example.com/foo'));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(almostOrigin, expectation));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(almostOrigin, '/foo'));
        assert.strictEqual(expectation, Extensions.ExtensionServer.ExtensionServer.expandResourcePath(almostOrigin, 'foo'));
    });
});
//# sourceMappingURL=ExtensionServer_test.js.map