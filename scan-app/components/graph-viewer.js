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

//------------------------------------------------------------------------------------------------


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
      label.classList.add('node-label');
      label.innerText = node.id;
      labels[node.id] = label;
      container.appendChild(label);
    }
  });
  
  return labels;
}

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Graph Viewer (React) Component
//------------------------------------------------------------------------------------------------
const GraphViewerOrg = ({ graphUrl, mapId, highlightedNodes = [] }) => {
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
  
  const [shortestPathParams, setShortestPathParams] = useState([-1, -1]);

  const [serverResult, setServerResult] = useState("No Reply Yet");

  const r = useRef();
  const g = useRef();
  const l = useRef();

  const pinnedRef = useRef(pinned);

  useEffect(() => {    
    setIsWaitingResults(true);

    
    const getShortestPath = async (ctx) => {
      const url = encodeURI(`${apiRoot}/shortest_path/${ctx[0]}/${ctx[1]}`);
      const response = await fetch(url);        
      const newData = await response.json();

      
      return setServerResult(JSON.stringify(newData));
    };


    const handleNodeDblClick = (node) => {
      window.open('/eqs/' + node.id);
    };

    const handleMouseEnter = (node) => {
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

    // *** WTF ***
    const handleNodeSnglClick = (node, event) => {
      if(event.ctrlKey){
        event.preventDefault();
        console.warn(node);

        let spp = shortestPathParams;
        if(spp[0] == -1){
          spp[0] = node.id;
        }
        else{
          spp[1] = node.id;
        }

        setShortestPathParams(spp);
        if(spp[1] !== -1){
          getShortestPath(spp);
        }
      }      
    };


    const readData = async () => {
      let mapUrl = `${apiRoot}/maps/${mapId}`;
      const map = await d3.json(mapUrl);
      const data = await d3.csv(graphUrl);

      // *** WTF ***
      console.warn(data);

      clearChildNodes(container.current);

      const graph = Viva.Graph.graph();
      const layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength: 30,
        springCoeff: 0.0008,
        dragCoeff: 0.02,
        gravity: -1.2,
        theta: 1,
      });

      const selectedNodes = [];

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

      var domLabels = generateDOMLabels(
        graph,
        container.current,
        highlightedNodes
      );

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
          return Viva.Graph.View.webglSquare(20, 0xff0000ff);
        }

        if (measure != 'energy') {
          if (hNodeIds.includes(node.id)) {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            return Viva.Graph.View.webglSquare(20, c);
          } else {
            const c = d3.rgb(color(node.data[measure])).formatHex();
            return Viva.Graph.View.webglSquare(10, c);
          }
        }

        if (node.data?.energy) {
          const c = d3.rgb(color(node.data.energy[0])).formatHex();
          return Viva.Graph.View.webglSquare(10, c);
        }

        return Viva.Graph.View.webglSquare(10, 10414335);
      });

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
          labelStyle.left = domPos.x + 'px';
          labelStyle.top = domPos.y + 'px';
        }
      });
      
      const events = Viva.Graph.webglInputEvents(graphics.current, graph);
      events.dblClick(handleNodeDblClick);
      events.mouseEnter(handleMouseEnter);
      events.mouseLeave(handleMouseLeave);
      events.mouseDown(handleNodeSnglClick)

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
        
        {/* *** WTF *** */}
        <span style={{            
            marginLeft: "20px"
          }}>{shortestPathParams}
        </span>
        <span style={{            
            marginLeft: "20px"
          }}>{serverResult}
        </span>
        

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
