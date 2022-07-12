//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Graph-Viewer Display Component that takes data map input (from the DB) 
//              and returns a html block using the Viva-graph library to display a interactive 
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

import styles from './graph-viewer.module.css';

//----------------------------------------------


//------------------------------------------------------------------------------------------------
// Init global constants and variables
//------------------------------------------------------------------------------------------------
const apiRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;

const options = [
  { key: 'energy', text: 'energy' },
  { key: 'frequency', text: 'Frequency' },
  { key: 'betweenness', text: 'Betweenness centrality' },
  { key: 'closeness', text: 'Closeness centrality' },
  { key: 'pagerank', text: 'Pagerank' },
];

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

// let lastSelectIndex = 0;
let selectedPath = [];
let spMemData = [];
var spEdgeMem = [];
let domLabels = {};
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
const getShortestPath = async (ctx, graphics, graph, container) => {
  const url = encodeURI(`${apiRoot}/shortest_path/${ctx[0]}/${ctx[1]}/${ctx[2]}`);

  const response = await fetch(url);        
  const spData = await response.json();
  
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

  return;
};
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Get Shortest Path
// This will contact the server for calculating the shortest path between two nodes and return it
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
      container.removeChild(domLabels[n[0]]);
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [targetNode, setTargetNode] = useState({ id: null });
  const [popupOffset, setPopupOffset] = useState('100,0');

  const [tempOptions, setTempOptions] = useState([300]);
  const [tempIndex, setTempIndex] = useState(0);
  
  const r = useRef();
  const g = useRef();
  const l = useRef();

  const pinnedRef = useRef(pinned);

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
    
    const handleNodeSnglClick = (node, event) => {
      if(event.ctrlKey){
        event.preventDefault();
        
        resetPathSelection(graphics, container.current);

        var nodeUI = graphics.current.getNodeUI(node.id);
        var thisNode = [node.id, nodeUI.color, nodeUI.size];        
        selectedPath.push(thisNode);        
        nodeUI.color = graphStyles.selectedNodeColor
        nodeUI.size = 20;

        if(selectedPath.length == 2){
          getShortestPath(([mapId]).concat([selectedPath[0][0], selectedPath[1][0]]), graphics, g, container);
        }
      }      
    };

    const readData = async () => {      
      let mapUrl = `${apiRoot}/maps/${mapId}`;
      const map = await d3.json(mapUrl);
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
      const measures = await d3.json(measuresUrl);
      const hNodeIds = [];

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

      const mValues = measures.map((m) => {
        if (measure === 'energy') {
          return m['energy'][tempIndex];
        } else {
          return m[measure];
        }
      });

      var color = d3
        .scaleSequential(d3.interpolateSpectral)
        .domain([Math.max(...mValues), Math.min(...mValues)]);
            
      graphics.current.node((node) => {    
        if (highlightedNodes.includes(node.id)) {          
          return Viva.Graph.View.webglSquare(graphStyles.nodeSelected, graphStyles.selectedNodeColor);
        }

        if (measure != 'energy') {
          if (hNodeIds.includes(node.id)) {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            return Viva.Graph.View.webglSquare(graphStyles.nodeSelected, c);
          } else {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, c);
          }
        }

        if (node.data?.energy) {
          const c = d3.rgb(color(node.data.energy[0])).formatHex();
          return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, c);
        }

        return Viva.Graph.View.webglSquare(graphStyles.nodeDefault, 10414335);
      });

      //--- IF DIFFERENT COLOR OF THE EDGES (Lines) ARE REQUESTED --------------------------------
      // graphics.current.link((link) => {    
      //   return Viva.Graph.View.webglLine(graphStyles.lineDefaultColor);
      // });
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
      r.current = render;
      g.current = graph;
      l.current = layout;
      
      setIsWaitingResults(false);
      window.graph = graph;
      window.graphics = graphics.current;
      window.layout = layout;
      window.renderer = renderer;
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
    setPinned(false);
    setMeasure(e.target.value);
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
          Hold CTRL + mouse-click for Node selection (Shortest Path Calculation)
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
