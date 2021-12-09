import React, { useEffect, useState, useRef } from 'react';
import Viva from 'vivagraphjs';
import * as d3 from 'd3';
import { render } from 'react-dom';
import { map } from 'd3';
import { startOfSecond } from 'date-fns';
import { SuggestionsController } from '@fluentui/react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from '@material-ui/core/Popper';

import MolViewer from './mol-viewer-cd-3d';

console.log(Viva);
// window.Viva = Viva;
// window.d3 = d3;

const apiRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;

const options = [
  { key: 'energy', text: 'energy' },
  { key: 'frequency', text: 'Frequency' },
  { key: 'betweenness', text: 'Betweenness centrality' },
  { key: 'closeness', text: 'Closeness centrality' },
  { key: 'pagerank', text: 'Pagerank' },
];

const testStyle = {
  // backgroundColor: 'blue',
  // width: '800px',
  width: '100%',
  // height: '600px',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const clearChildNodes = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

function generateDOMLabels(graph, container, labeledNodes) {
  // this will map node id into DOM element
  console.log(labeledNodes);
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

  // NOTE: If your graph changes over time you will need to
  // monitor graph changes and update DOM elements accordingly
  return labels;
}

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

  const r = useRef();
  const g = useRef();
  const l = useRef();

  const pinnedRef = useRef(pinned);

  // console.log('highlightedNodes', highlightedNodes);

  useEffect(() => {
    console.log('init');
    setIsWaitingResults(true);

    const handleNodeClick = (node) => {
      console.log('click node', node);
      // history.push('./node/' + node.id);
      window.open('/eqs/' + node.id);
    };

    const handleMouseEnter = (node) => {
      if (pinnedRef.current == false) {
        return;
      }
      // console.log(l.current.getNodePosition(node.id));
      console.log('mouse enter', node);
      setTargetNode(node);
      setAnchorEl(container.current);
      setOpen((prev) => true);

      window.n = node;
    };

    const handleMouseLeave = (node) => {
      // console.log('mouse leave', node);
      setOpen((prev) => false);
    };

    const readData = async () => {
      let mapUrl = `${apiRoot}/maps/${mapId}`;

      const map = await d3.json(mapUrl);

      console.log('read data from ', graphUrl);
      const data = await d3.csv(graphUrl);
      console.log(data);

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

      console.log('The total number of EQs: ', data.length);

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

      console.log(hNodeIds);

      measures.forEach((s) => {
        const d = { ...s };

        graph.addNode(s.eq_id, d);
      });

      const graphicsOptions = {
        // clearColor: true, // we want to avoid rendering artifacts
        clearColorValue: {
          // use black color to erase background
          r: 0,
          g: 0,
          b: 0,
          a: 1,
        },
      };

      graphics.current = Viva.Graph.View.webglGraphics(graphicsOptions);
      // const graphics = Viva.Graph.View.svgGraphics(graphicsOptions);

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
      console.log(mValues);
      var color = d3
        .scaleSequential(d3.interpolateSpectral)
        .domain([Math.max(...mValues), Math.min(...mValues)]);
      // var rainbow = d3.scaleSequential(d3.interpolateInferno);
      // console.log(rainbow);

      graphics.current.node((node) => {
        // console.log(node.id);
        if (highlightedNodes.includes(node.id)) {
          console.log(node);
          console.log(Viva.Graph.View.webglSquare());
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

        // return Viva.Graph.View.webglSquare(10, 10414335);

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

      // const graphics = Viva.Graph.View.svgGraphics();
      const events = Viva.Graph.webglInputEvents(graphics.current, graph);
      events.dblClick(handleNodeClick);
      events.mouseEnter(handleMouseEnter);
      events.mouseLeave(handleMouseLeave);

      const renderer = Viva.Graph.View.renderer(graph, {
        layout: layout,
        container: container.current,
        graphics: graphics.current,
      });
      renderer.run();
      r.current = render;
      g.current = graph;
      l.current = layout;

      console.log('init end', graph);
      setIsWaitingResults(false);
      window.graph = graph;
      window.graphics = graphics.current;
      window.layout = layout;
      window.renderer = renderer;
    };
    readData();
  }, [measure]);

  useEffect(async () => {
    console.log('measure changed.');

    if (!graphics.current) {
      return;
    }
    console.log(measure);
  }, [measure]);

  const coloringOptionChange = (e) => {
    console.log('option changed', e);
    console.log(e.target.value);
    pinnedRef.current = false;
    setPinned(false);
    setMeasure(e.target.value);
  };

  const onClick = (e) => {
    if (pinned) {
      console.log('resume');

      g.current.forEachNode((n) => {
        l.current.pinNode(n, false);
      });
      setPinned(false);
      pinnedRef.current = false;
      setOpen(false);
      return;
    }

    console.log('stop');
    // pin all node
    g.current.forEachNode((n) => {
      l.current.pinNode(n, true);
    });
    setPinned(true);
    pinnedRef.current = true;
  };

  const handleMouseMove = (e) => {
    // console.log(e);
    // console.log(e.clientX, e.clientY);
    // console.log(e.screenX, e.screenY);

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // console.log(x, y);
    // console.log(`${x},${-y}`);
    setPopupOffset(`${x + 3},${-(y + 3)}`);
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
            // offset: '200, 0',
            offset: popupOffset,
          },
        }}
      >
        <MolViewer
          item={targetNode}
          width={200}
          height={200}
          href={`${apiRoot}/eqs/${targetNode.id}/structure?format=mol`}
          // buttonEnable={false}
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
          type="button"
          onClick={onClick}
          value={pinnedRef.current ? 'resume' : 'stop'}
        ></input>
        {/* <select
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
        </select> */}
      </div>

      {isWaitingResults && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // height: '100vh',
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      )}

      <div
        style={testStyle}
        ref={container}
        onMouseMove={handleMouseMove}
      ></div>
    </div>
  );
};

// const GraphViewerStyled = Styled(GraphViewerOrg)`
//   background-color: blue;
// `;

// export const GraphViewer = GraphViewerStyled;
export const GraphViewer = GraphViewerOrg;
