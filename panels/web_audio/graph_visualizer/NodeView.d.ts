import { PortTypes, type NodeCreationData, type Port } from './GraphStyle.js';
export declare class NodeView {
  id: string;
  type: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  label: string;
  size: {
    width: number;
    height: number;
  };
  position: Object | null;
  private layout;
  ports: Map<string, Port>;
  constructor(data: NodeCreationData, label: string);
  private initialize;
  /**
   * Add an AudioParam to this node.
   * Note for @method removeParamPort: removeParamPort is not necessary because it will only happen
   * when the parent NodeView is destroyed. So there is no need to remove port individually
   * when the whole NodeView will be gone.
   */
  addParamPort(paramId: string, paramType: string): void;
  getPortsByType(type: PortTypes): Port[];
  /**
   * Use number of inputs and outputs to compute the layout
   * for text and ports.
   * Credit: This function is mostly borrowed from Audion/
   *      `audion.entryPoints.handleNodeCreated_()`.
   *      https://github.com/google/audion/blob/master/js/entry-points/panel.js
   */
  private updateNodeLayoutAfterAddingNode;
  /**
   * After adding a param port, update the node layout based on the y value
   * and label length.
   */
  private updateNodeLayoutAfterAddingParam;
  private updateNodeSize;
  private setupInputPorts;
  private setupOutputPorts;
  private addPort;
}
/**
 * Generates the port id for the input of node.
 */
export declare const generateInputPortId: (nodeId: string, inputIndex: number | undefined) => string;
/**
 * Generates the port id for the output of node.
 */
export declare const generateOutputPortId: (nodeId: string, outputIndex: number | undefined) => string;
/**
 * Generates the port id for the param of node.
 */
export declare const generateParamPortId: (nodeId: string, paramId: string) => string;
export declare class NodeLabelGenerator {
  private totalNumberOfNodes;
  constructor();
  /**
   * Generates the label for a node of a graph.
   */
  generateLabel(nodeType: string): string;
}
/**
 * Get the text width using given font style.
 */
export declare const measureTextWidth: (text: string, fontStyle: string | null) => number;
