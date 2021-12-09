import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';

import { DefaultButton } from '@fluentui/react';

// import ChemDoodle from '../lib/chem-doodle/ChemDoodleWeb';
// console.log(ChemDoodle);

const fetcher = (url) => fetch(url).then((r) => r.text());

const draw2DMol = (id, molecule, width, height) => {
  // if (molString.startsWith('{')) {
  //   return;
  // }

  // const molecule = ChemDoodle.readMOL(molString);
  const canvas = new ChemDoodle.TransformCanvas(id, width, height);

  canvas.styles.atoms_implicitHydrogens_2D = false;

  //the width of the bonds should be .6 pixels
  // canvas.styles.bonds_width_2D = 0.6;
  //the spacing between higher order bond lines should be 18% of the length of the bond
  // canvas.styles.bonds_saturationWidthAbs_2D = 2.6;
  //the hashed wedge spacing should be 2.5 pixels
  canvas.styles.bonds_hashSpacing_2D = 2.5;
  //the atom label font size should be 10
  canvas.styles.atoms_font_size_2D = 10;
  //we define a cascade of acceptable font families
  //if Helvetica is not found, Arial will be used
  canvas.styles.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
  //display carbons labels if they are terminal
  // canvas.styles.atoms_displayTerminalCarbonLabels_2D = true;
  //add some color by using JMol colors for elements
  canvas.styles.atoms_useJMOLColors = true;
  canvas.emptyMessage = 'No Data Loaded!';
  canvas.rotate3D = true;

  canvas.dragPath = [];
  //save the old handler
  console.log(canvas.drag);
  canvas.oldDrag = canvas.drag;
  canvas.drag = function (e) {
    e.preventDefault();
    //notice that you can use the "this" keyword in an object's function to access its variables
    this.dragPath[canvas.dragPath.length] = e.p;
    //call the old handler
    this.oldDrag(e);
  };
  canvas.loadMolecule(molecule);

  if (molecule) {
    canvas.loadMolecule(molecule);
  }
};

const draw3DMol = (id, molecule, width, height) => {
  // const molecule = ChemDoodle.readMOL(molString);
  const canvas = new ChemDoodle.TransformCanvas(id, width, height, true);
  //a little styling
  canvas.styles.atoms_useJMOLColors = true;
  canvas.styles.atoms_circles_2D = true;
  canvas.styles.atoms_HBlack_2D = false;
  canvas.styles.bonds_symmetrical_2D = true;
  canvas.styles.backgroundColor = '#E4FFC2';
  //an array of Point that will keep track of the path
  canvas.dragPath = [];
  //save the old handler
  console.log(canvas.drag);
  canvas.oldDrag = canvas.drag;
  //define the new handler
  canvas.drag = function (e) {
    e.preventDefault();
    //notice that you can use the "this" keyword in an object's function to access its variables
    this.dragPath[canvas.dragPath.length] = e.p;
    //call the old handler
    this.oldDrag(e);
  };
  canvas.loadMolecule(molecule);
  window.c = canvas;
};

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
      console.log('mode is true!!!');
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
    console.log(e);
    e.preventDefault();

    setMode((value) => !value);
    // console.log(ChemDoodle);
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

export default MolViewer;
