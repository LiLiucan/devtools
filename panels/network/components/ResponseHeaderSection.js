// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as LitHtml from '../../../ui/lit-html/lit-html.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as NetworkForward from '../../../panels/network/forward/forward.js';
import * as Host from '../../../core/host/host.js';
import * as IssuesManager from '../../../models/issues_manager/issues_manager.js';
import { HeaderSectionRow } from './HeaderSectionRow.js';
import * as Persistence from '../../../models/persistence/persistence.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Common from '../../../core/common/common.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Root from '../../../core/root/root.js';
import responseHeaderSectionStyles from './ResponseHeaderSection.css.js';
const { render, html } = LitHtml;
const UIStrings = {
  /**
   *@description Label for a button which allows adding an HTTP header.
   */
  addHeader: 'Add header',
  /**
   *@description Explanation text for which cross-origin policy to set.
   */
  chooseThisOptionIfTheResourceAnd:
    'Choose this option if the resource and the document are served from the same site.',
  /**
   *@description Explanation text for which cross-origin policy to set.
   */
  onlyChooseThisOptionIfAn:
    'Only choose this option if an arbitrary website including this resource does not impose a security risk.',
  /**
   *@description Message in the Headers View of the Network panel when a cross-origin opener policy blocked loading a sandbox iframe.
   */
  thisDocumentWasBlockedFrom:
    'This document was blocked from loading in an `iframe` with a `sandbox` attribute because this document specified a cross-origin opener policy.',
  /**
   *@description Message in the Headers View of the Network panel when a cross-origin embedder policy header needs to be set.
   */
  toEmbedThisFrameInYourDocument:
    'To embed this frame in your document, the response needs to enable the cross-origin embedder policy by specifying the following response header:',
  /**
   *@description Message in the Headers View of the Network panel when a cross-origin resource policy header needs to be set.
   */
  toUseThisResourceFromADifferent:
    'To use this resource from a different origin, the server needs to specify a cross-origin resource policy in the response headers:',
  /**
   *@description Message in the Headers View of the Network panel when the cross-origin resource policy header is too strict.
   */
  toUseThisResourceFromADifferentOrigin:
    'To use this resource from a different origin, the server may relax the cross-origin resource policy response header:',
  /**
   *@description Message in the Headers View of the Network panel when the cross-origin resource policy header is too strict.
   */
  toUseThisResourceFromADifferentSite:
    'To use this resource from a different site, the server may relax the cross-origin resource policy response header:',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/ResponseHeaderSection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
const plusIconUrl = new URL('../../../Images/plus_icon.svg', import.meta.url).toString();
export const RESPONSE_HEADER_SECTION_DATA_KEY = 'ResponseHeaderSection';
export class ResponseHeaderSection extends HTMLElement {
  static litTagName = LitHtml.literal`devtools-response-header-section`;
  #shadow = this.attachShadow({ mode: 'open' });
  #request;
  #headerDetails = [];
  #headerEditors = [];
  #uiSourceCode = null;
  #overrides = [];
  #headersAreOverrideable = false;
  connectedCallback() {
    this.#shadow.adoptedStyleSheets = [responseHeaderSectionStyles];
  }
  set data(data) {
    this.#request = data.request;
    this.#headerDetails = this.#request.sortedResponseHeaders.map((header) => ({
      name: Platform.StringUtilities.toLowerCaseString(header.name),
      value: header.value.replace(/\s/g, ' '),
    }));
    const headersWithIssues = [];
    if (this.#request.wasBlocked()) {
      const headerWithIssues = BlockedReasonDetails.get(this.#request.blockedReason());
      if (headerWithIssues) {
        if (
          IssuesManager.RelatedIssue.hasIssueOfCategory(
            this.#request,
            IssuesManager.Issue.IssueCategory.CrossOriginEmbedderPolicy,
          )
        ) {
          const followLink = () => {
            Host.userMetrics.issuesPanelOpenedFrom(Host.UserMetrics.IssueOpener.LearnMoreLinkCOEP);
            if (this.#request) {
              void IssuesManager.RelatedIssue.reveal(
                this.#request,
                IssuesManager.Issue.IssueCategory.CrossOriginEmbedderPolicy,
              );
            }
          };
          if (headerWithIssues.blockedDetails) {
            headerWithIssues.blockedDetails.reveal = followLink;
          }
        }
        headersWithIssues.push(headerWithIssues);
      }
    }
    function mergeHeadersWithIssues(headers, headersWithIssues) {
      let i = 0,
        j = 0;
      const result = [];
      while (i < headers.length && j < headersWithIssues.length) {
        if (headers[i].name < headersWithIssues[j].name) {
          result.push({ ...headers[i++], headerNotSet: false });
        } else if (headers[i].name > headersWithIssues[j].name) {
          result.push({ ...headersWithIssues[j++], headerNotSet: true });
        } else {
          result.push({ ...headersWithIssues[j++], ...headers[i++], headerNotSet: false });
        }
      }
      while (i < headers.length) {
        result.push({ ...headers[i++], headerNotSet: false });
      }
      while (j < headersWithIssues.length) {
        result.push({ ...headersWithIssues[j++], headerNotSet: true });
      }
      return result;
    }
    this.#headerDetails = mergeHeadersWithIssues(this.#headerDetails, headersWithIssues);
    const blockedResponseCookies = this.#request.blockedResponseCookies();
    const blockedCookieLineToReasons = new Map(blockedResponseCookies?.map((c) => [c.cookieLine, c.blockedReasons]));
    for (const header of this.#headerDetails) {
      if (header.name === 'set-cookie' && header.value) {
        const matchingBlockedReasons = blockedCookieLineToReasons.get(header.value);
        if (matchingBlockedReasons) {
          header.setCookieBlockedReasons = matchingBlockedReasons;
        }
      }
    }
    if (data.toReveal?.section === NetworkForward.UIRequestLocation.UIHeaderSection.Response) {
      this.#headerDetails
        .filter((header) => header.name === data.toReveal?.header?.toLowerCase())
        .forEach((header) => {
          header.highlight = true;
        });
    }
    const dataAssociatedWithRequest = this.#request.getAssociatedData(RESPONSE_HEADER_SECTION_DATA_KEY);
    if (dataAssociatedWithRequest) {
      this.#headerEditors = dataAssociatedWithRequest;
    } else {
      this.#headerEditors = this.#headerDetails.map((header) => ({
        name: header.name,
        value: header.value,
        originalValue: header.value,
      }));
      this.#markOverrides();
    }
    void this.#loadOverridesFileInfo();
    this.#request.setAssociatedData(RESPONSE_HEADER_SECTION_DATA_KEY, this.#headerEditors);
    this.#render();
  }
  #resetEditorState() {
    if (!this.#request) {
      return;
    }
    this.#headerEditors = this.#headerDetails.map((header) => ({
      name: header.name,
      value: header.value,
      originalValue: header.value,
    }));
    this.#markOverrides();
    this.#request.setAssociatedData(RESPONSE_HEADER_SECTION_DATA_KEY, this.#headerEditors);
  }
  async #loadOverridesFileInfo() {
    if (!this.#request) {
      return;
    }
    this.#uiSourceCode =
      Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().getHeadersUISourceCodeFromUrl(
        this.#request.url(),
      );
    if (!this.#uiSourceCode) {
      this.#resetEditorState();
      this.#render();
      return;
    }
    try {
      const deferredContent = await this.#uiSourceCode.requestContent();
      this.#overrides = JSON.parse(deferredContent.content || '[]');
      if (!this.#overrides.every(Persistence.NetworkPersistenceManager.isHeaderOverride)) {
        throw 'Type mismatch after parsing';
      }
      this.#headersAreOverrideable =
        Root.Runtime.experiments.isEnabled(Root.Runtime.ExperimentName.HEADER_OVERRIDES) &&
        Common.Settings.Settings.instance().moduleSetting('persistenceNetworkOverridesEnabled').get();
      for (const header of this.#headerEditors) {
        header.valueEditable = this.#headersAreOverrideable;
      }
    } catch (error) {
      this.#headersAreOverrideable = false;
      console.error(
        'Failed to parse',
        this.#uiSourceCode?.url() || 'source code file',
        'for locally overriding headers.',
      );
      this.#resetEditorState();
    } finally {
      this.#render();
    }
  }
  #markOverrides() {
    if (!this.#request || this.#request.originalResponseHeaders.length === 0) {
      return;
    }
    // To compare original headers and actual headers we use a map from header
    // name to an array of header values. This allows us to handle the cases
    // in which we have multiple headers with the same name (and corresponding
    // header values which may or may not occur multiple times as well). We are
    // not using MultiMaps, because a Set would not able to distinguish between
    // header values [a, a, b] and [a, b, b].
    const originalHeaders = new Map();
    for (const header of this.#request?.originalResponseHeaders || []) {
      const headerName = Platform.StringUtilities.toLowerCaseString(header.name);
      const headerValues = originalHeaders.get(headerName);
      if (headerValues) {
        headerValues.push(header.value.replace(/\s/g, ' '));
      } else {
        originalHeaders.set(headerName, [header.value.replace(/\s/g, ' ')]);
      }
    }
    const actualHeaders = new Map();
    for (const header of this.#headerDetails) {
      const headerValues = actualHeaders.get(header.name);
      if (headerValues) {
        headerValues.push(header.value || '');
      } else {
        actualHeaders.set(header.name, [header.value || '']);
      }
    }
    const isDifferent = (headerName, actualHeaders, originalHeaders) => {
      const actual = actualHeaders.get(headerName);
      const original = originalHeaders.get(headerName);
      if (!actual || !original || actual.length !== original.length) {
        return true;
      }
      actual.sort();
      original.sort();
      for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== original[i]) {
          return true;
        }
      }
      return false;
    };
    for (const headerName of actualHeaders.keys()) {
      // If the array of actual headers and the array of original headers do not
      // exactly match, mark all headers with 'headerName' as being overridden.
      if (isDifferent(headerName, actualHeaders, originalHeaders)) {
        this.#headerEditors
          .filter((header) => header.name === headerName)
          .forEach((header) => {
            header.isOverride = true;
          });
      }
    }
  }
  #onHeaderEdited(event) {
    const target = event.target;
    if (target.dataset.index === undefined) {
      return;
    }
    const index = Number(target.dataset.index);
    this.#updateOverrides(event.headerName, event.headerValue, index);
  }
  #fileNameFromUrl(url) {
    const rawPath = Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().rawPathFromUrl(
      url,
      true,
    );
    const lastIndexOfSlash = rawPath.lastIndexOf('/');
    return Common.ParsedURL.ParsedURL.substring(rawPath, lastIndexOfSlash + 1);
  }
  #commitOverrides() {
    this.#uiSourceCode?.setWorkingCopy(JSON.stringify(this.#overrides, null, 2));
    this.#uiSourceCode?.commitWorkingCopy();
    Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().updateInterceptionPatterns();
  }
  #removeEntryFromOverrides(rawFileName, headerName, headerValue) {
    for (let blockIndex = this.#overrides.length - 1; blockIndex >= 0; blockIndex--) {
      const block = this.#overrides[blockIndex];
      if (block.applyTo !== rawFileName) {
        continue;
      }
      const foundIndex = block.headers.findIndex(
        (header) => header.name === headerName && header.value === headerValue,
      );
      if (foundIndex < 0) {
        continue;
      }
      block.headers.splice(foundIndex, 1);
      if (block.headers.length === 0) {
        this.#overrides.splice(blockIndex, 1);
      }
      return;
    }
  }
  #onHeaderRemoved(event) {
    const target = event.target;
    if (target.dataset.index === undefined || !this.#request) {
      return;
    }
    const index = Number(target.dataset.index);
    const rawFileName = this.#fileNameFromUrl(this.#request.url());
    this.#removeEntryFromOverrides(rawFileName, event.headerName, event.headerValue);
    this.#commitOverrides();
    if (index < this.#headerDetails.length) {
      const originalHeaders = (this.#request?.originalResponseHeaders || []).filter(
        (header) => Platform.StringUtilities.toLowerCaseString(header.name) === event.headerName,
      );
      if (originalHeaders.length === 1) {
        // Remove the header override and replace it with the original non-
        // overridden header in the UI.
        this.#headerDetails[index].value = originalHeaders[0].value;
        this.#headerEditors[index].value = originalHeaders[0].value;
        this.#headerEditors[index].originalValue = originalHeaders[0].value;
        this.#headerEditors[index].isOverride = false;
      } else {
        // If there is no (or multiple) matching originalResonseHeader,
        // remove the header from the UI.
        this.#headerDetails.splice(index, 1);
        this.#headerEditors.splice(index, 1);
      }
    } else {
      // This is the branch for headers which were added via the UI after the
      // response was received. They can simply be removed.
      this.#headerEditors.splice(index, 1);
    }
    this.#render();
  }
  #updateOverrides(headerName, headerValue, index) {
    if (!this.#request) {
      return;
    }
    // If 'originalResponseHeaders' are not populated (because there was no
    // request interception), fill them with a copy of 'sortedResponseHeaders'.
    // This ensures we have access to the original values when undoing edits.
    if (this.#request.originalResponseHeaders.length === 0) {
      this.#request.originalResponseHeaders = this.#request.sortedResponseHeaders.map((headerEntry) => ({
        ...headerEntry,
      }));
    }
    const previousName = this.#headerEditors[index].name;
    const previousValue = this.#headerEditors[index].value;
    this.#headerEditors[index].name = headerName;
    this.#headerEditors[index].value = headerValue;
    // If multiple headers have the same name 'foo', we treat them as a unit.
    // If there are overrides for 'foo', all original 'foo' headers are removed
    // and replaced with the override(s) for 'foo'.
    const headersToUpdate = this.#headerEditors.filter(
      (header) => header.name === headerName && (header.value !== header.originalValue || header.isOverride),
    );
    const rawFileName = this.#fileNameFromUrl(this.#request.url());
    // If the last override-block matches 'rawFileName', use this last block.
    // Otherwise just append a new block at the end. We are not using earlier
    // blocks, because they could be overruled by later blocks, which contain
    // wildcards in the filenames they apply to.
    let block = null;
    const [lastOverride] = this.#overrides.slice(-1);
    if (lastOverride?.applyTo === rawFileName) {
      block = lastOverride;
    } else {
      block = {
        applyTo: rawFileName,
        headers: [],
      };
      this.#overrides.push(block);
    }
    // Keep header overrides for headers with a different name.
    block.headers = block.headers.filter((header) => header.name !== headerName);
    // If a header name has been edited (only possible when adding headers),
    // remove the previous override entry.
    if (this.#headerEditors[index].name !== previousName) {
      for (let i = 0; i < block.headers.length; ++i) {
        if (block.headers[i].name === previousName && block.headers[i].value === previousValue) {
          block.headers.splice(i, 1);
          break;
        }
      }
    }
    // Append freshly edited header overrides.
    for (const header of headersToUpdate) {
      block.headers.push({ name: header.name, value: header.value || '' });
    }
    if (block.headers.length === 0) {
      this.#overrides.pop();
    }
    this.#commitOverrides();
  }
  #onAddHeaderClick() {
    this.#headerEditors.push({
      name: Platform.StringUtilities.toLowerCaseString(i18n.i18n.lockedString('header-name')),
      value: i18n.i18n.lockedString('header value'),
      isOverride: true,
      nameEditable: true,
      valueEditable: true,
    });
    const index = this.#headerEditors.length - 1;
    this.#updateOverrides(this.#headerEditors[index].name, this.#headerEditors[index].value || '', index);
    this.#render();
    const rows = this.#shadow.querySelectorAll('devtools-header-section-row');
    const [lastRow] = Array.from(rows).slice(-1);
    lastRow?.focus();
  }
  #render() {
    if (!this.#request) {
      return;
    }
    const headerDescriptors = this.#headerEditors.map((headerEditor, index) => ({
      ...this.#headerDetails[index],
      ...headerEditor,
    }));
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(
      html`
        ${headerDescriptors.map(
          (header, index) => html`
        <${HeaderSectionRow.litTagName} .data=${{
            header: header,
          }} @headeredited=${this.#onHeaderEdited} @headerremoved=${this.#onHeaderRemoved} data-index=${index}></${
            HeaderSectionRow.litTagName
          }>
      `,
        )}
        ${this.#headersAreOverrideable
          ? html`
        <${Buttons.Button.Button.litTagName}
          class="add-header-button"
          .variant=${'secondary' /* Buttons.Button.Variant.SECONDARY */}
          .iconUrl=${plusIconUrl}
          .iconWidth=${'12px'}
          .iconHeight=${'12px'}
          @click=${this.#onAddHeaderClick}>
          ${i18nString(UIStrings.addHeader)}
        </${Buttons.Button.Button.litTagName}>
      `
          : LitHtml.nothing}
      `,
      this.#shadow,
      { host: this },
    );
    // clang-format on
  }
}
ComponentHelpers.CustomElements.defineComponent('devtools-response-header-section', ResponseHeaderSection);
const BlockedReasonDetails = new Map([
  [
    'coep-frame-resource-needs-coep-header' /* Protocol.Network.BlockedReason.CoepFrameResourceNeedsCoepHeader */,
    {
      name: Platform.StringUtilities.toLowerCaseString('cross-origin-embedder-policy'),
      value: null,
      blockedDetails: {
        explanation: i18nLazyString(UIStrings.toEmbedThisFrameInYourDocument),
        examples: [{ codeSnippet: 'Cross-Origin-Embedder-Policy: require-corp', comment: undefined }],
        link: { url: 'https://web.dev/coop-coep/' },
      },
    },
  ],
  [
    'corp-not-same-origin-after-defaulted-to-same-origin-by-coep' /* Protocol.Network.BlockedReason.CorpNotSameOriginAfterDefaultedToSameOriginByCoep */,
    {
      name: Platform.StringUtilities.toLowerCaseString('cross-origin-resource-policy'),
      value: null,
      blockedDetails: {
        explanation: i18nLazyString(UIStrings.toUseThisResourceFromADifferent),
        examples: [
          {
            codeSnippet: 'Cross-Origin-Resource-Policy: same-site',
            comment: i18nLazyString(UIStrings.chooseThisOptionIfTheResourceAnd),
          },
          {
            codeSnippet: 'Cross-Origin-Resource-Policy: cross-origin',
            comment: i18nLazyString(UIStrings.onlyChooseThisOptionIfAn),
          },
        ],
        link: { url: 'https://web.dev/coop-coep/' },
      },
    },
  ],
  [
    'coop-sandboxed-iframe-cannot-navigate-to-coop-page' /* Protocol.Network.BlockedReason.CoopSandboxedIframeCannotNavigateToCoopPage */,
    {
      name: Platform.StringUtilities.toLowerCaseString('cross-origin-opener-policy'),
      value: null,
      headerValueIncorrect: false,
      blockedDetails: {
        explanation: i18nLazyString(UIStrings.thisDocumentWasBlockedFrom),
        examples: [],
        link: { url: 'https://web.dev/coop-coep/' },
      },
    },
  ],
  [
    'corp-not-same-site' /* Protocol.Network.BlockedReason.CorpNotSameSite */,
    {
      name: Platform.StringUtilities.toLowerCaseString('cross-origin-resource-policy'),
      value: null,
      headerValueIncorrect: true,
      blockedDetails: {
        explanation: i18nLazyString(UIStrings.toUseThisResourceFromADifferentSite),
        examples: [
          {
            codeSnippet: 'Cross-Origin-Resource-Policy: cross-origin',
            comment: i18nLazyString(UIStrings.onlyChooseThisOptionIfAn),
          },
        ],
        link: null,
      },
    },
  ],
  [
    'corp-not-same-origin' /* Protocol.Network.BlockedReason.CorpNotSameOrigin */,
    {
      name: Platform.StringUtilities.toLowerCaseString('cross-origin-resource-policy'),
      value: null,
      headerValueIncorrect: true,
      blockedDetails: {
        explanation: i18nLazyString(UIStrings.toUseThisResourceFromADifferentOrigin),
        examples: [
          {
            codeSnippet: 'Cross-Origin-Resource-Policy: same-site',
            comment: i18nLazyString(UIStrings.chooseThisOptionIfTheResourceAnd),
          },
          {
            codeSnippet: 'Cross-Origin-Resource-Policy: cross-origin',
            comment: i18nLazyString(UIStrings.onlyChooseThisOptionIfAn),
          },
        ],
        link: null,
      },
    },
  ],
]);
//# sourceMappingURL=ResponseHeaderSection.js.map
