//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Molecule Viewer display component that takes needed input in order to 
//              draw a molecule (2D or 3D properly) and returns a html snippet for showing it. 
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: React library, 3rd party swr and fluentui Default Button
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';

import { DefaultButton } from '@fluentui/react';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Init global constants and variables
//------------------------------------------------------------------------------------------------
const fetcher = (url) => fetch(url).then((r) => r.text());

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Draw 2D Molecule
//------------------------------------------------------------------------------------------------
const draw2DMol = (id, molecule, width, height) => {
  const canvas = new ChemDoodle.TransformCanvas(id, width, height);
  
  canvas.styles.atoms_implicitHydrogens_2D = false;
  canvas.styles.bonds_hashSpacing_2D = 2.5;
  canvas.styles.atoms_font_size_2D = 10;
  canvas.styles.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
  canvas.styles.atoms_useJMOLColors = true;
  canvas.emptyMessage = 'No Data Loaded!';
  canvas.rotate3D = true;
  canvas.dragPath = [];
  canvas.oldDrag = canvas.drag;
  canvas.drag = function (e) {
    e.preventDefault();
    this.dragPath[canvas.dragPath.length] = e.p;
    this.oldDrag(e);
  };
  
  canvas.loadMolecule(molecule);
};

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Draw 3D Molecule
//------------------------------------------------------------------------------------------------
const draw3DMol = (id, molecule, width, height) => {
  const canvas = new ChemDoodle.TransformCanvas(id, width, height, true);
  
  canvas.styles.atoms_useJMOLColors = true;
  canvas.styles.atoms_circles_2D = true;
  canvas.styles.atoms_HBlack_2D = false;
  canvas.styles.bonds_symmetrical_2D = true;
  canvas.styles.backgroundColor = '#E4FFC2';
  canvas.dragPath = [];
  canvas.oldDrag = canvas.drag;
  canvas.drag = function (e) {
    e.preventDefault();
    this.dragPath[canvas.dragPath.length] = e.p;
    this.oldDrag(e);
  };
  
  canvas.loadMolecule(molecule);
};
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Molecule Viewer Component
//------------------------------------------------------------------------------------------------
const MolViewer = ({
  item,
  href,
  width = 200,
  height = 200,
  buttonEnable = true,
  default3d = false,
}) => {
  const canvasRef = useRef();
  const [mode, setMode] = useState(default3d);
  const { data, error } = useSWR(href, fetcher);

  const handleData = (molString) => {
    const molecule = ChemDoodle.readMOL(molString);
    if (mode == false) {
      draw2DMol(item.id, molecule, width, height);
    } else {
      draw3DMol(item.id, molecule, width, height);
    }
  };

  useEffect(() => {
    if (data) {
      handleData(data);
    }
  }, [canvasRef, data, mode]);

  if (error) {
    console.error('failed to load');
    return <div>failed to load</div>;
  }
  if (!data) return <div>loading...</div>;

  const handleClick = (e) => {
    e.preventDefault();

    setMode((value) => !value);
  };

  return (
    <div>
      {buttonEnable && (
        <DefaultButton onClick={handleClick}>switch view</DefaultButton>
      )}
      <canvas id={item.id} ref={canvasRef}></canvas>
    </div>
  );
};
//------------------------------------------------------------------------------------------------

export default MolViewer;
