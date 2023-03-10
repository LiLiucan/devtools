import * as SDK from '../../core/sdk/sdk.js';
import type * as TreeOutline from '../../ui/components/tree_outline/tree_outline.js';
import * as LitHtml from '../../ui/lit-html/lit-html.js';
import type * as Protocol from '../../generated/protocol.js';
export declare type AXTreeNodeData = SDK.AccessibilityModel.AccessibilityNode;
export declare type AXTreeNode = TreeOutline.TreeOutlineUtils.TreeNode<AXTreeNodeData>;
export declare function getRootNode(frameId: Protocol.Page.FrameId): Promise<SDK.AccessibilityModel.AccessibilityNode>;
export declare function getNodeAndAncestorsFromDOMNode(
  domNode: SDK.DOMModel.DOMNode,
): Promise<SDK.AccessibilityModel.AccessibilityNode[]>;
export declare function sdkNodeToAXTreeNodes(sdkNode: SDK.AccessibilityModel.AccessibilityNode): Promise<AXTreeNode[]>;
export declare function accessibilityNodeRenderer(node: AXTreeNode): LitHtml.TemplateResult;
export declare function getNodeId(node: SDK.AccessibilityModel.AccessibilityNode): string;
