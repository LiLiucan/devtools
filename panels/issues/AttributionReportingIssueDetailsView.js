// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
const UIStrings = {
  /**
   * @description Label for number of rows in the issue details table.
   */
  nViolations: '{n, plural, =1 {# violation} other {# violations}}',
  /**
   * @description Noun, label for the column showing the associated HTML element in the issue details table.
   */
  element: 'Element',
  /**
   * @description Noun, label for the column showing the invalid header value in the issue details table.
   */
  invalidHeaderValue: 'Invalid Header Value',
  /**
   * @description Noun, label for the column showing the maximum concurrent registrations header value in the issue details table.
   */
  maximumConcurrentRegistrations: 'Maximum Concurrent Registrations',
  /**
   * @description Noun, label for the column showing the associated network request in the issue details table.
   */
  request: 'Request',
  /**
   * @description Label for the column showing the invalid URL used in an HTML anchor element ("a link").
   * A origin is (roughly said) the front part of a URL.
   */
  untrustworthyOrigin: 'Untrustworthy origin',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AttributionReportingIssueDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AttributionReportingIssueDetailsView extends AffectedResourcesView {
  getResourceNameWithCount(count) {
    return i18nString(UIStrings.nViolations, { n: count });
  }
  update() {
    this.clear();
    const issues = this.issue.getAttributionReportingIssues();
    if (issues.size > 0) {
      this.#appendDetails(issues.values().next().value.code(), issues);
    } else {
      this.updateAffectedResourceCount(0);
    }
  }
  #appendDetails(issueCode, issues) {
    const header = document.createElement('tr');
    switch (issueCode) {
      case 'AttributionReportingIssue::InvalidRegisterSourceHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidRegisterSourceHeader */:
      case 'AttributionReportingIssue::InvalidRegisterTriggerHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidRegisterTriggerHeader */:
      case 'AttributionReportingIssue::InvalidEligibleHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidEligibleHeader */:
      case 'AttributionReportingIssue::SourceIgnored' /* IssuesManager.AttributionReportingIssue.IssueCode.SourceIgnored */:
      case 'AttributionReportingIssue::TriggerIgnored' /* IssuesManager.AttributionReportingIssue.IssueCode.TriggerIgnored */:
        this.appendColumnTitle(header, i18nString(UIStrings.request));
        this.appendColumnTitle(header, i18nString(UIStrings.invalidHeaderValue));
        break;
      case 'AttributionReportingIssue::InsecureContext' /* IssuesManager.AttributionReportingIssue.IssueCode.InsecureContext */:
      case 'AttributionReportingIssue::UntrustworthyReportingOrigin' /* IssuesManager.AttributionReportingIssue.IssueCode.UntrustworthyReportingOrigin */:
        this.appendColumnTitle(header, i18nString(UIStrings.element));
        this.appendColumnTitle(header, i18nString(UIStrings.request));
        this.appendColumnTitle(header, i18nString(UIStrings.untrustworthyOrigin));
        break;
      case 'AttributionReportingIssue::PermissionPolicyDisabled' /* IssuesManager.AttributionReportingIssue.IssueCode.PermissionPolicyDisabled */:
      case 'AttributionReportingIssue::PermissionPolicyNotDelegated' /* IssuesManager.AttributionReportingIssue.IssueCode.PermissionPolicyNotDelegated */:
        this.appendColumnTitle(header, i18nString(UIStrings.element));
        this.appendColumnTitle(header, i18nString(UIStrings.request));
        break;
      case 'AttributionReportingIssue::TooManyConcurrentRequests' /* IssuesManager.AttributionReportingIssue.IssueCode.TooManyConcurrentRequests */:
        this.appendColumnTitle(header, i18nString(UIStrings.element));
        this.appendColumnTitle(header, i18nString(UIStrings.maximumConcurrentRegistrations));
        break;
      case 'AttributionReportingIssue::SourceAndTriggerHeaders' /* IssuesManager.AttributionReportingIssue.IssueCode.SourceAndTriggerHeaders */:
        this.appendColumnTitle(header, i18nString(UIStrings.request));
        break;
    }
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const issue of issues) {
      count++;
      void this.#appendDetail(issueCode, issue);
    }
    this.updateAffectedResourceCount(count);
  }
  async #appendDetail(issueCode, issue) {
    const element = document.createElement('tr');
    element.classList.add('affected-resource-directive');
    const details = issue.issueDetails;
    switch (issueCode) {
      case 'AttributionReportingIssue::InvalidRegisterSourceHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidRegisterSourceHeader */:
      case 'AttributionReportingIssue::InvalidRegisterTriggerHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidRegisterTriggerHeader */:
      case 'AttributionReportingIssue::InvalidEligibleHeader' /* IssuesManager.AttributionReportingIssue.IssueCode.InvalidEligibleHeader */:
      case 'AttributionReportingIssue::SourceIgnored' /* IssuesManager.AttributionReportingIssue.IssueCode.SourceIgnored */:
      case 'AttributionReportingIssue::TriggerIgnored' /* IssuesManager.AttributionReportingIssue.IssueCode.TriggerIgnored */:
        this.#appendRequestOrEmptyCell(element, details.request);
        this.appendIssueDetailCell(element, details.invalidParameter || '');
        break;
      case 'AttributionReportingIssue::InsecureContext' /* IssuesManager.AttributionReportingIssue.IssueCode.InsecureContext */:
      case 'AttributionReportingIssue::UntrustworthyReportingOrigin' /* IssuesManager.AttributionReportingIssue.IssueCode.UntrustworthyReportingOrigin */:
        await this.#appendElementOrEmptyCell(element, issue);
        this.#appendRequestOrEmptyCell(element, details.request);
        this.appendIssueDetailCell(element, details.invalidParameter || '');
        break;
      case 'AttributionReportingIssue::PermissionPolicyDisabled' /* IssuesManager.AttributionReportingIssue.IssueCode.PermissionPolicyDisabled */:
      case 'AttributionReportingIssue::PermissionPolicyNotDelegated' /* IssuesManager.AttributionReportingIssue.IssueCode.PermissionPolicyNotDelegated */:
        await this.#appendElementOrEmptyCell(element, issue);
        this.#appendRequestOrEmptyCell(element, details.request);
        break;
      case 'AttributionReportingIssue::TooManyConcurrentRequests' /* IssuesManager.AttributionReportingIssue.IssueCode.TooManyConcurrentRequests */:
        await this.#appendElementOrEmptyCell(element, issue);
        this.appendIssueDetailCell(element, details.invalidParameter || '');
        break;
      case 'AttributionReportingIssue::SourceAndTriggerHeaders' /* IssuesManager.AttributionReportingIssue.IssueCode.SourceAndTriggerHeaders */:
        this.#appendRequestOrEmptyCell(element, details.request);
        break;
    }
    this.affectedResources.appendChild(element);
  }
  async #appendElementOrEmptyCell(parent, issue) {
    const details = issue.issueDetails;
    if (details.violatingNodeId !== undefined) {
      const target = issue.model()?.target() || null;
      parent.appendChild(
        await this.createElementCell(
          { backendNodeId: details.violatingNodeId, target, nodeName: 'Attribution source element' },
          issue.getCategory(),
        ),
      );
    } else {
      this.appendIssueDetailCell(parent, '');
    }
  }
  #appendRequestOrEmptyCell(parent, request) {
    if (!request) {
      this.appendIssueDetailCell(parent, '');
      return;
    }
    const opts = {
      additionalOnClickAction() {
        Host.userMetrics.issuesPanelResourceOpened(
          IssuesManager.Issue.IssueCategory.AttributionReporting,
          'Request' /* AffectedItem.Request */,
        );
      },
    };
    parent.appendChild(this.createRequestCell(request, opts));
  }
}
//# sourceMappingURL=AttributionReportingIssueDetailsView.js.map
