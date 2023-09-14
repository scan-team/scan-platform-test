//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is a Graph-Viewer Display Component that takes data map input (from the DB) 
//              and returns a html block using the Viva-graph library to display an interactive 
//              node graph as requested. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: React components, 3rd-party libraries; Viva, d3, CircularProgress, Popper
//             and internal mol-viewer-cd-3d
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import React, { useEffect, useState, useRef } from 'react';

import Viva from 'vivagraphjs';
import * as d3 from 'd3';
import { render } from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from '@material-ui/core/Popper';
import MolViewer from './mol-viewer-cd-3d';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import styles from './graph-viewer.module.css';

import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

//----------------------------------------------


//------------------------------------------------------------------------------------------------
// Init global constants and variables
//------------------------------------------------------------------------------------------------
const apiRoot = publicRuntimeConfig.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;

const options = [
  { key: 'energy', text: 'energy' },
  { key: 'energyinverted', text: 'energy Inverted' },
  { key: 'frequency', text: 'Frequency' },
  { key: 'betweenness', text: 'Betweenness centrality' },
  { key: 'closeness', text: 'Closeness centrality' },
  { key: 'pagerank', text: 'Pagerank' },
  { key: 'reactionyield', text: 'Reaction Yield' },
  { key: 'clustering', text: 'Clustering' },
];

// const paletteColdHot = ['#6ba6f6', '#00c1ff', '#00d6ef', '#00e6c5', '#79f090', '#a6e566', '#ced742', '#f4c52c', '#f2a403', '#ee8100', '#e85a00', '#de2608'];

const stylePack = {
  // backgroundColor: '#f7f5b7', //light yellowish
  width: '100%',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const graphStyles = {
  nodeDefault: 10,
  nodeSelected: 20,
  selectedNodeColor: Viva.Graph.View._webglUtil.parseColor("#FFFF00"),
  lineDefaultColor: Viva.Graph.View._webglUtil.parseColor("#999999")
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

let selectedPath = [];
let spMemData = [];
var spEdgeMem = [];
let domLabels = {};
let measuresMem = [];

var selectedNodes = [];
var hideEdgeRequestList = [];
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Clear Child Nodes
//------------------------------------------------------------------------------------------------
const clearChildNodes = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }  
};

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Generate DOM Labels
// This will map node id into DOM element
//------------------------------------------------------------------------------------------------
function generateDOMLabels(graph, container, labeledNodes) {   
  const labels = Object.create(null);  
  graph.forEachNode(function (node) {    
    if (labeledNodes.includes(node.id)) {      
      const label = document.createElement('span');
      label.classList.add(styles.nodeLabel);
      // label.innerText = node.id;
      labels[node.id] = label;      
      container.appendChild(label);
    }
  });

  return labels;
}

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Get Shortest Path
// This will contact the server for calculating the shortest path between two nodes and return it
//------------------------------------------------------------------------------------------------
const getShortestPath = async (ctx, graphics, graph, container, sm) => {
  const url = encodeURI(`${apiRoot}/shortest_path/${ctx[0]}/${ctx[1]}/${ctx[2]}`);

  const response = await fetch(url);        
  const spData = await response.json();
  
  if(spData == "FAIL"){
    resetPathSelection(graphics, container, true);    
    sm[0]("Invalid Nodes Selected");
    sm[1]("An exception occurred, probably because one of the nodes were not connected to anything");
    sm[2](true);
  }
  else{    
    domLabels = generateDOMLabels(        
      graph.current,
      container.current,
      spData
    );  
    
    spEdgeMem = [];
    var indexLabelTxt = 1; 
    spData.forEach((n, index) => {
      var nUI = graphics.current.getNodeUI(n);
      spMemData.push([n, nUI.color, nUI.size, index+1])
      nUI.color = Viva.Graph.View._webglUtil.parseColor("#FF00FF");
      nUI.size = 20;
      domLabels[n].innerText = indexLabelTxt++; 
      
      var thisNode = graph.current.getNode(n);
      for (let i = 0; i < thisNode.links.length; i++) {
        for (let j = 0; j < spData.length; j++) {
          if((n == thisNode.links[i].fromId && spData[j] == thisNode.links[i].toId) || (n == thisNode.links[i].toId && spData[j] == thisNode.links[i].fromId)){
            var alreadyExist = false;
            for(let k = 0; k < spEdgeMem.length; k++){
              if(spEdgeMem[k] == thisNode.links[i].id){
                alreadyExist = true;
                break;
              }
            }
            if(!alreadyExist){
              spEdgeMem.push(thisNode.links[i].id);
            }
          }
        }            
      }          
    });        
    spEdgeMem.forEach((l, index) => {
      var linkUI = graphics.current.getLinkUI(l);
      if (linkUI) {        
        linkUI.color = Viva.Graph.View._webglUtil.parseColor("#ff00ff");
      }
    });   
  }

  return;
};
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Get NetworkX Data
// This will contact the server for getting NetworkX data
//------------------------------------------------------------------------------------------------
const getClustering = async (mapId, graphics, graph, container, sm) => {
  const url = encodeURI(`${apiRoot}/clustering/${mapId}/`);

  const response = await fetch(url);        
  const spData = await response.json();
  
  if(spData == "FAIL"){
    resetPathSelection(graphics, container, true);    
    sm[0]("Invalid Nodes Selected");
    sm[1]("An exception occurred, probably because one of the nodes were not connected to anything");
    sm[2](true);
  }
  else{        
    const cluColPal = ["#bfffff", "#0e40f3", "#386ec3", "#7ab579", "#b2f23a", "#ffd500", "#f69f08", "#ef720e", "#e84415", "#e21b1b", "#ff0000"];
    setTimeout(() => {
      for (let [key, value] of Object.entries(spData)) {        
        var nUI = graphics.current.getNodeUI(key);
        const whatColor = cluColPal[Math.round(value*10)];
        nUI.color = Viva.Graph.View._webglUtil.parseColor(whatColor);
        
        if(value > 0.9){ nUI.size = 20; }
        else{ nUI.size = 10; }
      }
    },4000);
  }

  return;
};
//------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------
// Reset Path Selection
// This will reset the selections of nodes and paths
//------------------------------------------------------------------------------------------------
const resetPathSelection = async (graphics, container, forceReset) => {
  if(spEdgeMem.length !== 0){
    spEdgeMem.forEach((l) => {
      var linkUI = graphics.current.getLinkUI(l);
      if (linkUI) {        
        linkUI.color = Viva.Graph.View._webglUtil.parseColor("#999999");
      }
    });
    spEdgeMem = [];
  }

  if(spMemData.length !== 0){
    spMemData.forEach((n) => {
      var nUI = graphics.current.getNodeUI(n[0]);
      nUI.color = n[1]
      nUI.size = n[2];
      try {
        container.removeChild(domLabels[n[0]]);  
      } catch (error) {
        // Do nothing
      }      
    });
    spMemData = [];
    domLabels = {};
  }

  if(selectedPath.length == 2 || forceReset){
    selectedPath.forEach((n) => {
      var nUI = graphics.current.getNodeUI(n[0]);
      nUI.color = n[1]
      nUI.size = n[2];
    });
    selectedPath = [];
  }        
};
//------------------------------------------------------------------------------------------------


//===* WHEN USING CUSTOM WEBGL *===========================================================================================================

//------------------------------------------------------------------------------------------------
// WebGL Circle
// A Custom Node (In this example a circle)
//------------------------------------------------------------------------------------------------ 
function WebglCircle(size, color) {
  // this.size = size;
  // this.color = Viva.Graph.View._webglUtil.parseColor(color);
}
//------------------------------------------------------------------------------------------------ 


//------------------------------------------------------------------------------------------------
// Build Circle Node Shader
// Custom WebGL Shader for drawing nodes (In this example a circle)
//------------------------------------------------------------------------------------------------ 
function buildCircleNodeShader() {  
  // For each primitive we need 4 attributes: x, y, color and size.
  // var ATTRIBUTES_PER_PRIMITIVE = 4,
  //     nodesFS = [
  //     'precision mediump float;',
  //     'varying vec4 color;',

  //     'void main(void) {',
  //     '   if ((gl_PointCoord.x - 0.5) * (gl_PointCoord.x - 0.5) + (gl_PointCoord.y - 0.5) * (gl_PointCoord.y - 0.5) < 0.25) {',
  //     '     gl_FragColor = color;',
  //     '   } else {',
  //     '     gl_FragColor = vec4(0);',
  //     '   }',
  //     '}'].join('\n'),
  //     nodesVS = [
  //     'attribute vec2 a_vertexPos;',
  //     // Pack color and size into vector. First elemnt is color, second - size.
  //     // Since it's floating point we can only use 24 bit to pack colors...
  //     // thus alpha channel is dropped, and is always assumed to be 1.
  //     'attribute vec2 a_customAttributes;',
  //     'uniform vec2 u_screenSize;',
  //     'uniform mat4 u_transform;',
  //     'varying vec4 color;',

  //     'void main(void) {',
  //     '   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0, 1);',
  //     '   gl_PointSize = a_customAttributes[1] * u_transform[0][0];',
  //     '   float c = a_customAttributes[0];',
  //     '   color.b = mod(c, 256.0); c = floor(c/256.0);',
  //     '   color.g = mod(c, 256.0); c = floor(c/256.0);',
  //     '   color.r = mod(c, 256.0); c = floor(c/256.0); color /= 255.0;',
  //     '   color.a = 1.0;',
  //     '}'].join('\n');

  // var program,
  //     gl,
  //     buffer,
  //     locations,
  //     webglUtils,
  //     nodes = new Float32Array(64),
  //     nodesCount = 0,
  //     canvasWidth, canvasHeight, transform,
  //     isCanvasDirty;

  // return {
  //     /**
  //      * Called by webgl renderer to load the shader into gl context.
  //      */
  //     load : function (glContext) {
  //         gl = glContext;

  //         webglUtils = Viva.Graph.webgl(glContext);

  //         program = webglUtils.createProgram(nodesVS, nodesFS);
  //         gl.useProgram(program);
  //         locations = webglUtils.getLocations(program, ['a_vertexPos', 'a_customAttributes', 'u_screenSize', 'u_transform']);

  //         gl.enableVertexAttribArray(locations.vertexPos);
  //         gl.enableVertexAttribArray(locations.customAttributes);

  //         buffer = gl.createBuffer();
  //     },

  //     /**
  //      * Called by webgl renderer to update node position in the buffer array
  //      *
  //      * @param nodeUI - data model for the rendered node (WebGLCircle in this case)
  //      * @param pos - {x, y} coordinates of the node.
  //      */
  //     position : function (nodeUI, pos) {
  //         var idx = nodeUI.id;
  //         nodes[idx * ATTRIBUTES_PER_PRIMITIVE] = pos.x;
  //         nodes[idx * ATTRIBUTES_PER_PRIMITIVE + 1] = -pos.y;
  //         nodes[idx * ATTRIBUTES_PER_PRIMITIVE + 2] = nodeUI.color;
  //         nodes[idx * ATTRIBUTES_PER_PRIMITIVE + 3] = nodeUI.size;
  //     },

  //     /**
  //      * Request from webgl renderer to actually draw our stuff into the
  //      * gl context. This is the core of our shader.
  //      */
  //     render : function() {
  //         gl.useProgram(program);
  //         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  //         gl.bufferData(gl.ARRAY_BUFFER, nodes, gl.DYNAMIC_DRAW);

  //         if (isCanvasDirty) {
  //             isCanvasDirty = false;
  //             gl.uniformMatrix4fv(locations.transform, false, transform);
  //             gl.uniform2f(locations.screenSize, canvasWidth, canvasHeight);
  //         }

  //         gl.vertexAttribPointer(locations.vertexPos, 2, gl.FLOAT, false, ATTRIBUTES_PER_PRIMITIVE * Float32Array.BYTES_PER_ELEMENT, 0);
  //         gl.vertexAttribPointer(locations.customAttributes, 2, gl.FLOAT, false, ATTRIBUTES_PER_PRIMITIVE * Float32Array.BYTES_PER_ELEMENT, 2 * 4);

  //         gl.drawArrays(gl.POINTS, 0, nodesCount);
  //     },

  //     /**
  //      * Called by webgl renderer when user scales/pans the canvas with nodes.
  //      */
  //     updateTransform : function (newTransform) {
  //         transform = newTransform;
  //         isCanvasDirty = true;
  //     },

  //     /**
  //      * Called by webgl renderer when user resizes the canvas with nodes.
  //      */
  //     updateSize : function (newCanvasWidth, newCanvasHeight) {
  //         canvasWidth = newCanvasWidth;
  //         canvasHeight = newCanvasHeight;
  //         isCanvasDirty = true;
  //     },

  //     /**
  //      * Called by webgl renderer to notify us that the new node was created in the graph
  //      */
  //     createNode : function (node) {
  //         nodes = webglUtils.extendArray(nodes, nodesCount, ATTRIBUTES_PER_PRIMITIVE);
  //         nodesCount += 1;
  //     },

  //     /**
  //      * Called by webgl renderer to notify us that the node was removed from the graph
  //      */
  //     removeNode : function (node) {
  //         if (nodesCount > 0) { nodesCount -=1; }

  //         if (node.id < nodesCount && nodesCount > 0) {
  //             // we do not really delete anything from the buffer.
  //             // Instead we swap deleted node with the "last" node in the
  //             // buffer and decrease marker of the "last" node. Gives nice O(1)
  //             // performance, but make code slightly harder than it could be:
  //             webglUtils.copyArrayPart(nodes, node.id*ATTRIBUTES_PER_PRIMITIVE, nodesCount*ATTRIBUTES_PER_PRIMITIVE, ATTRIBUTES_PER_PRIMITIVE);
  //         }
  //     },

  //     /**
  //      * This method is called by webgl renderer when it changes parts of its
  //      * buffers. We don't use it here, but it's needed by API (see the comment
  //      * in the removeNode() method)
  //      */
  //     replaceProperties : function(replacedNode, newNode) {},
  // };
}
//------------------------------------------------------------------------------------------------

// ========================================================================================================================================



//------------------------------------------------------------------------------------------------
// Graph Viewer (React) Component
//------------------------------------------------------------------------------------------------
const GraphViewerOrg = ({ graphUrl, mapId, highlightedNodes = [] }) => {
  // highlightedNodes will not have any effect at the moment... if ever used it will be implemnted later
  const container = useRef(null);
  const graphics = useRef(null);

  const [isWaitingResults, setIsWaitingResults] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [measure, setMeasure] = useState('energy');
  const [ryTemp, setRYTemp] = useState('200');

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [targetNode, setTargetNode] = useState({ id: null });
  const [popupOffset, setPopupOffset] = useState('100,0');
  const [tempIndex, setTempIndex] = useState(0);

  const r = useRef();
  const r2 = useRef();
  const g = useRef();
  const l = useRef();  
  const gs = useRef();
  
  const pinnedRef = useRef(pinned);

  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {    
    setIsWaitingResults(true);
    
    const handleNodeDblClick = (node) => {
      window.open('/eqs/' + node.id);
    };

    const handleMouseEnter = (node, link) => {
      if (pinnedRef.current == false) {
        return;
      }
      setTargetNode(node);
      setAnchorEl(container.current);
      setOpen((prev) => true);

      window.n = node;
    };

    const handleMouseLeave = (node) => {      
      setOpen((prev) => false);      
    };

    const resetSelection = function(){
      for(var i = 0; i < selectedNodes.length; i++){
        var nodeUI = gs.current.getNodeUI(selectedNodes[i]);
        nodeUI.color = nodeUI.node.data["memory"].color;
        nodeUI.size = nodeUI.node.data["memory"].size;
      }
      selectedNodes = [];
      r2.current.rerender();
    };
    
    const handleNodeSnglClick = (node, event) => {
      if(event.ctrlKey || event.metaKey){
        event.preventDefault();

        resetPathSelection(graphics, container.current);
        resetSelection();

        var nodeUI = graphics.current.getNodeUI(node.id);
        var thisNode = [node.id, nodeUI.color, nodeUI.size];        
        selectedPath.push(thisNode);        
        nodeUI.color = graphStyles.selectedNodeColor
        nodeUI.size = 20;

        if(selectedPath.length == 2){
          getShortestPath(([mapId]).concat([selectedPath[0][0], selectedPath[1][0]]), graphics, g, container, [setModalTitle, setModalBody, setOpenModal]);
        }
      } 
      else if(event.shiftKey){
        event.preventDefault();
        resetPathSelection(graphics, container.current);
        resetSelection();
        selectedNodes.push(node.id);
        var nodeUI = gs.current.getNodeUI(node.id);        
        for(var i = 0; i < nodeUI.node.links.length; i++){
          var relatedNodeId = nodeUI.node.links[i].fromId != node.id ? nodeUI.node.links[i].fromId : nodeUI.node.links[i].toId
          selectedNodes.push(relatedNodeId);
          var relNodeUI = gs.current.getNodeUI(relatedNodeId);
          relNodeUI.color = 0xff00ffff;
          relNodeUI.size = 20;
        }
        nodeUI.color = graphStyles.selectedNodeColor
        nodeUI.size = 20;
      }
    };
    
    const readData = async () => {            
      const data = await d3.csv(graphUrl);

      clearChildNodes(container.current);

      const graph = Viva.Graph.graph();
      const layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength: 30,
        springCoeff: 0.0008,
        dragCoeff: 0.02,
        gravity: -1.2,
        theta: 1,
      });

      data.forEach((d) => {
        if (d['n0'] && d['n1']) {
          graph.addLink(d['n0'], d['n1']);
        }
      });
      
      let measuresUrl = `${apiRoot}/maps/${mapId}/eqs/measures`;    
      const measures = (await d3.json(measuresUrl)).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.eq_id === value.eq_id
        ))
      )
      const hNodeIds = [];

      let eqsReactYieldsUrl = `${apiRoot}/maps/${mapId}/eqs/reayie`;
      const eqsReactYields = await d3.json(eqsReactYieldsUrl);
      
      measures.forEach((msr) => {
        for(var i = 0; i < eqsReactYields.length; i++){
          if(msr.eq_id == eqsReactYields[i].id){
            msr["reactionyield200"] = eqsReactYields[i].reactionyield[0];
            msr["reactionyield300"] = eqsReactYields[i].reactionyield[1];
            msr["reactionyield400"] = eqsReactYields[i].reactionyield[2];      
          }
        }        
      });
      measuresMem = [...measures];

      if (measure != 'energy') {
        measures.sort((a, b) => {
          if (a[measure] > b[measure]) return -1;
          if (a[measure] < b[measure]) return 1;
          return 0;
        });
      }

      let noh = 20;
      for (let i = 0; i < noh; i++) {
        const m = measures[i];
        if (m) {
          hNodeIds.push(m.eq_id);
        }
      }

      measures.forEach((s) => {
        const d = { ...s };

        graph.addNode(s.eq_id, d);
      });

      graphics.current = Viva.Graph.View.webglGraphics();  
      
      //===* WHEN USING CUSTOM WEBGL *===========================================================================================================
      // var circleNode = buildCircleNodeShader();
      // graphics.current.setNodeProgram(circleNode);
      // ========================================================================================================================================

      const mValues = measures.map((m) => {
        if (measure === 'energy' || measure === 'energyinverted') {          
          return m['energy'][tempIndex];
        } 
        else if (measure.indexOf("reactionyield") !== -1) {
          return m[measure+ryTemp];
        } 
        else {
          return m[measure];
        }
      });

      var color = d3
        .scaleSequential(d3.interpolateSpectral)
        .domain([Math.max(...mValues), Math.min(...mValues)]);
            
      graphics.current.node((node) => {  
        if (highlightedNodes.includes(node.id)) {          
          //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
          return Viva.Graph.View.webglSquare(graphStyles.nodeSelected, graphStyles.selectedNodeColor);
          //===* WHEN USING CUSTOM WEBGL *===========================================================================================================        
          // return new WebglCircle(graphStyles.nodeSelected, graphStyles.selectedNodeColor);
          // ========================================================================================================================================
        }

        if (measure != 'energy' && measure != 'energyinverted') {
          if (measure.indexOf("reactionyield") !== -1) {
            var c = d3.rgb(color(node.data[measure+ryTemp])).formatHex();              
            if(node.data[measure+'200'] <= 0.5){ node.data['isPotentiallyHidden200'] = true; }
            if(node.data[measure+'300'] <= 0.5){ node.data['isPotentiallyHidden300'] = true; }
            if(node.data[measure+'400'] <= 0.5){ node.data['isPotentiallyHidden400'] = true; }
            
            //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
            return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, c);
            //===* WHEN USING CUSTOM WEBGL *===========================================================================================================        
            // return new WebglCircle(graphStyles.nodeSelected, c);
            // ========================================================================================================================================            
          }

          if (hNodeIds.includes(node.id)) {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
            return Viva.Graph.View.webglSquare(graphStyles.nodeSelected, c);
            //===* WHEN USING CUSTOM WEBGL *===========================================================================================================        
            // return new WebglCircle(graphStyles.nodeSelected, c);
            // ========================================================================================================================================
          } else {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
            return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, c);
            //===* WHEN USING CUSTOM WEBGL *===========================================================================================================        
            // return new WebglCircle(graphStyles.nodeDefault, c);
            // ========================================================================================================================================
          }
        }

        if (node.data?.energy) {        
          if(measure == 'energyinverted'){
            color = d3.scaleSequential(d3.interpolateSpectral).domain([Math.min(...mValues), Math.max(...mValues)]);
          }
          const c = d3.rgb(color(node.data.energy[0])).formatHex();
          //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
          return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, c);
          //===* WHEN USING CUSTOM WEBGL *===========================================================================================================           
          // return new WebglCircle(graphStyles.nodeDefault, c);          
          // ========================================================================================================================================
        }

        //===* WHEN -->NOT<-- USING CUSTOM WEBGL *=================================================================================================
        return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, 10414335);
        //===* WHEN USING CUSTOM WEBGL *===========================================================================================================        
        // return new WebglCircle(graphStyles.nodeDefault, 10414335);
        // ========================================================================================================================================
      });

      
      //--- IF DIFFERENT COLOR OF THE EDGES (Lines) ARE REQUESTED --------------------------------            
      graphics.current.link((link) => {               
        if(measure=='reactionyield'){
          return Viva.Graph.View.webglLine(Viva.Graph.View._webglUtil.parseColor("#00000000"));
        }
        else{
          return Viva.Graph.View.webglLine(graphStyles.lineDefaultColor);
        }
      });
      //------------------------------------------------------------------------------------------
      

      graphics.current.placeNode((ui, pos) => {        
        // This callback is called by the renderer before it updates 
        // node coordinate. We can use it to update corresponding DOM
        // label position;

        // we create a copy of layout position
        const domPos = {
          x: pos.x,
          y: pos.y,
        };
        // And ask graphics to transform it to DOM coordinates:
        graphics.current.transformGraphToClientCoordinates(domPos);

        const nodeId = ui.node.id;
        // then move corresponding dom label to its own position:        
        if (domLabels[nodeId]) {                    
          const labelStyle = domLabels[nodeId].style;
          labelStyle.left = domPos.x - parseInt((graphStyles.nodeSelected/2)) + 'px';
          labelStyle.top = domPos.y - parseInt((graphStyles.nodeSelected/2)) + 'px';    
        }
      });
            
      const events = Viva.Graph.webglInputEvents(graphics.current, graph);
      events.dblClick(handleNodeDblClick);
      events.mouseEnter(handleMouseEnter);
      events.mouseLeave(handleMouseLeave);
      events.click(handleNodeSnglClick)

      const renderer = Viva.Graph.View.renderer(graph, {
        layout: layout,
        container: container.current,
        graphics: graphics.current,
      });
      renderer.run();

      // Store graphic data in the node for memory purpose
      graph.forEachNode((n) => {
        var nodeUI = graphics.current.getNodeUI(n.id);
        n.data["memory"] = {size: nodeUI.size, color: nodeUI.color};
      });
      
      r.current = render;
      r2.current = renderer;
      g.current = graph;
      l.current = layout;
      gs.current = graphics.current;
      
      setIsWaitingResults(false);
      window.graph = graph;
      window.graphics = graphics.current;
      window.layout = layout;
      window.renderer = renderer;

      const clearSelections = function (e) {
        resetSelection();
      }

      const componentResetBtn = document.getElementById("resetSelectionBtn");      
      componentResetBtn.removeEventListener("click", clearSelections);
      componentResetBtn.addEventListener("click", clearSelections);      
      
    };
    readData();
  }, [measure]);

  useEffect(async () => {
    if (!graphics.current) {
      return;
    }
  }, [measure]);

  const coloringOptionChange = (e) => {
    pinnedRef.current = false;
    resetPathSelection(graphics, container.current, true);
    setPinned(false);
    setMeasure(e.target.value);

    if(e.target.value == "clustering"){
      getClustering(mapId, graphics, g, container, [setModalTitle, setModalBody, setOpenModal]);                
    }

    if(e.target.value == "reactionyield"){
      setTimeout(() => {
        g.current.forEachLink((l) => {   
          var linkUI = graphics.current.getLinkUI(l.id); 
          linkUI.color = graphStyles.lineDefaultColor;
        });   
      }, 1000);      
    }
  };

  const ryTempChange = (e) => {   
    var newTemp = e.target.value;
    const mValues = measuresMem.map((m) => {
      return m[measure+newTemp];
    });    
    var color = d3.scaleSequential(d3.interpolateSpectral).domain([Math.max(...mValues), Math.min(...mValues)]);
    g.current.forEachNode((n) => {
      var nUI = graphics.current.getNodeUI(n.id);      
      nUI.color = Viva.Graph.View._webglUtil.parseColor(d3.rgb(color(n.data[measure+newTemp])).formatHex());
    });   
    setRYTemp(newTemp); 
  };

  const hideLowYieldChange = (e) => {     
    g.current.forEachNode((n) => {      
      if(n.data['isPotentiallyHidden'+ryTemp]){
        var nUI = graphics.current.getNodeUI(n.id); 
        if (e.target.checked) {
          nUI.color = Viva.Graph.View._webglUtil.parseColor("#00000000");
        } else {
          const mValues = measuresMem.map((m) => {
            return m[measure+ryTemp];
          });    
          var color = d3.scaleSequential(d3.interpolateSpectral).domain([Math.max(...mValues), Math.min(...mValues)]);
          nUI.color = Viva.Graph.View._webglUtil.parseColor(d3.rgb(color(n.data[measure+ryTemp])).formatHex());
        } 
        
        if(n.links){
          for (let i = 0; i < n.links.length; i++) {  
            var linkUI = graphics.current.getLinkUI(n.links[i].id);
            if (e.target.checked) {
              linkUI.color = Viva.Graph.View._webglUtil.parseColor("#00000000");
            } else {
              linkUI.color = graphStyles.lineDefaultColor;
            }             
          }          
        }
      }
    }); 
  };
  
  const onClick = (e) => {
    if (pinned) {
      g.current.forEachNode((n) => {
        l.current.pinNode(n, false);
      });
      setPinned(false);
      pinnedRef.current = false;
      setOpen(false);
      return;
    }
    
    // pin all node
    g.current.forEachNode((n) => {
      l.current.pinNode(n, true);
    });
    setPinned(true);
    pinnedRef.current = true;
  };
  
  const onResetRequestClick = (e) => {
    resetPathSelection(graphics, container.current, true);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPopupOffset(`${x + 5},${-(y + 5)}`);
  };

  return (
    <div>      
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: 'bold', color: "red", paddingBottom: "10px" }}>
            {modalTitle}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalBody}
          </Typography>
        </Box>
      </Modal>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        modifiers={{
          offset: {
            enabled: true,
            offset: popupOffset,
          },
        }}
      >
        <MolViewer
          item={targetNode}
          width={200}
          height={200}
          href={`${apiRoot}/eqs/${targetNode.id}/structure?format=mol`}
        ></MolViewer>
      </Popper>

      <div>
        <select
          placeholder="Select an option"
          onChange={coloringOptionChange}
          value={measure}
        >
          {options.map((o) => {
            return (
              <option key={o.key} value={o.key}>
                {o.text}
              </option>
            );
          })}
        </select>
        {measure=='reactionyield' && (
          <div style={{display: 'inline-block', marginLeft: "10px", fontSize: "13px", marginRight: "15px"}}>
            <label style={{fontWeight: "bold"}}>Temperature</label>
            <div>              
              <label style={{marginTop: "5px"}}>
                <input type="radio" name="reyitemp" style={{height: '15px', width: '15px', marginRight: "3px"}} value="200" onChange={ryTempChange} checked={ryTemp == '200'} /> 
                200K
              </label>
            </div>
            <div >              
              <label>
                <input type="radio" name="reyitemp" style={{height: '15px', width: '15px', marginRight: "3px"}} value="300" onChange={ryTempChange}  checked={ryTemp == '300'} />
                300K
              </label>
            </div>
            <div >              
              <label>
                <input type="radio" name="reyitemp" style={{height: '15px', width: '15px', marginRight: "3px"}} value="400" onChange={ryTempChange}  checked={ryTemp == '400'} />
                400K
              </label>
            </div>
          </div>          
        )}
        {measure=='reactionyield' && (
          <div style={{display: 'inline-block', marginLeft: "10px", fontSize: "13px", marginRight: "15px"}}>
              <label style={{marginTop: "5px"}}>
                <input type="checkbox" name="hidelowyield" style={{height: '15px', width: '15px', marginRight: "3px"}} onChange={hideLowYieldChange} /> 
                Hide Low Yield Nodes
              </label>
          </div>          
        )}
        <input
          style={{
            border: 'darkgreen solid 2px',
            marginLeft: "10px",
            padding: "4px",
            fontWeight: 'bold',
            backgroundColor: "#04AA6D",
            color: "white",
            cursor: "pointer"
          }}
          type="button"
          onClick={onClick}
          value={pinnedRef.current ? 'RESUME' : 'STOP'}
        ></input>
        <span
          style={{            
            marginLeft: "30px",        
            fontSize: "11px",
            color: "black",
          }}
        >
          Hold CTRL (or ⌘ on Mac) + mouse-click for Node selection (Shortest Path Calculation) / Hold SHIFT for just highlighting single node and its neighbours
        </span>
        
        <input
          style={{
            border: 'darkblue solid 1px',
            marginLeft: "5px",
            padding: "2px",
            backgroundColor: "lightblue",
            fontSize: "11px",
            color: "dimgray",
            cursor: "pointer"
          }}
          type="button"
          id="resetSelectionBtn"
          onClick={onResetRequestClick}
          value={'RESET SELECTION'}
          size="sm"
        ></input>
      </div>

      {isWaitingResults && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      )}

      <div
        style={stylePack}
        ref={container}
        onMouseMove={handleMouseMove}
      ></div>
    </div>
  );
};

export const GraphViewer = GraphViewerOrg;
