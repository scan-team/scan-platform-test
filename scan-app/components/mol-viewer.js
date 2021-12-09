import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Kekule } from 'kekule';
import * as THREE from 'three/build/three.module.js';

window.Kekule = Kekule;
window.THREE = THREE;
Kekule.Render.registerExternalModule('three.js', THREE);

const testStyle = {
  // backgroundColor: 'blue',
  width: '800px',
  height: '600px',
};
const MolViewerOrg = ({ history, nodeId, mapId }) => {
  const container = useRef(null);
  console.log(nodeId, mapId);

  useEffect(() => {
    console.log('init');

    const readData = async () => {
      const data = await d3.csv('/data/' + mapId + '/out1.csv');
      console.log(data);

      const path = '/data/' + mapId + '/mol/eq' + nodeId + '.mol';
      console.log(path);
      const molData = await (await fetch(path)).text();
      console.log(molData);
      const molecule = Kekule.IO.loadFormatData(molData, 'mol');

      const chemViewer = new Kekule.ChemWidget.Viewer(window.document);
      chemViewer.setRenderType(Kekule.Render.RendererType.R3D);

      chemViewer.setDimension('500px', '400px');

      // chemViewer.setMoleculeDisplayType(
      //   Kekule.Render.Molecule3DDisplayType.SPACE_FILL
      // );

      chemViewer.appendToElem(container.current).setChemObj(molecule);

      // chemViewer.setChemObj(myMolecule);

      console.log('init end');
    };
    readData();
  }, [mapId, nodeId]);

  return (
    <div>
      <div style={testStyle} ref={container}></div>
    </div>
  );
};

// const GraphViewerStyled = Styled(GraphViewerOrg)`
//   background-color: blue;
// `;

// export const GraphViewer = GraphViewerStyled;
export const MolViewer = MolViewerOrg;
