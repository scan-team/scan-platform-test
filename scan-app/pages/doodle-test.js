import { useRef } from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

import utilStyles from '../styles/utils.module.css';

// import { ChemDoodle } from '../../lib/chem-doodle/ChemDoodleWeb';
// console.log(ChemDoodle);

const pyridineMolFile =
  'Molecule Name\n  CHEMDOOD01011121543D 0   0.00000     0.00000     0\n[Insert Comment Here]\n  6  6  0  0  0  0  0  0  0  0  1 V2000\n    0.0000    1.0000    0.0000   N 0  0  0  0  0  0  0  0  0  0  0  0\n   -0.8660    0.5000    0.0000   C 0  0  0  0  0  0  0  0  0  0  0  0\n   -0.8660   -0.5000    0.0000   C 0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -1.0000    0.0000   C 0  0  0  0  0  0  0  0  0  0  0  0\n    0.8660   -0.5000    0.0000   C 0  0  0  0  0  0  0  0  0  0  0  0\n    0.8660    0.5000    0.0000   C 0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  2  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  2  0  0  0  0\n  6  1  1  0  0  0  0\nM  END';

function alertMolecule(mol) {
  let message =
    'This molecule contains ' +
    mol.atoms.length +
    ' atoms and ' +
    mol.bonds.length +
    ' bonds.';
  alert(message);
}

const testXYZ =
  '4\n\nP     -1.94320772761340    3.76380805105058    0.09145823734384\nP      0.44005839062064   -0.27823432647990    0.99614257003706\n P     -1.23971246406892    0.78832520626373   -2.79759850090418\n P      2.74286180106545   -4.27389893084009    1.70999769352707\n';

async function fetchData(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log(text);
  return text;
}

export default function Post() {
  const ref = useRef(null);

  const handleClick = async (e) => {
    const mol = ChemDoodle.readMOL(pyridineMolFile);

    const mol2 = ChemDoodle.readXYZ(testXYZ);
    alertMolecule(mol2);

    const res = await fetch('/testdata/eq0.xyz');
    const mol3Text = await res.text();
    console.log(mol3Text);
    const mol3 = ChemDoodle.readXYZ(mol3Text);

    const res2 = await fetch('/testdata/eq0.mol');
    const mol4Text = await res2.text();
    console.log(mol4Text);
    const mol4 = ChemDoodle.readMOL(mol4Text);
    alertMolecule(mol2);

    const res3 = await fetch('/testdata/test2.xyz');
    const mol5Text = await res3.text();
    console.log(mol5Text);
    const mol5 = ChemDoodle.readXYZ(mol5Text);
    alertMolecule(mol5);

    const outtext = await fetchData('/testdata/out.xyz');
    const outMol = ChemDoodle.readXYZ(outtext);

    const outtext7 = await fetchData('/testdata/out.mol');
    const outMol7 = ChemDoodle.readMOL(outtext7);

    const outtext8 = await fetchData('/testdata/test2.mol');
    const outMol8 = ChemDoodle.readMOL(outtext8);

    const cif01text = fetchData('/testdata/test.cif');

    const eq1text = await fetchData('/testdata/eq1.xyz');
    const eq1Mol = ChemDoodle.readXYZ(eq1text);
    // const cif01 = ChemDoodle.readCIF(cif01text);

    let myCanvas = new ChemDoodle.ViewerCanvas('test', 150, 150);
    //the width of the bonds should be .6 pixels
    myCanvas.styles.bonds_width_2D = 0.6;
    //the spacing between higher order bond lines should be 18% of the length of the bond
    myCanvas.styles.bonds_saturationWidthAbs_2D = 2.6;
    //the hashed wedge spacing should be 2.5 pixels
    myCanvas.styles.bonds_hashSpacing_2D = 2.5;
    //the atom label font size should be 10
    myCanvas.styles.atoms_font_size_2D = 10;
    //we define a cascade of acceptable font families
    //if Helvetica is not found, Arial will be used
    myCanvas.styles.atoms_font_families_2D = [
      'Helvetica',
      'Arial',
      'sans-serif',
    ];
    //display carbons labels if they are terminal
    myCanvas.styles.atoms_displayTerminalCarbonLabels_2D = true;
    //add some color by using JMol colors for elements
    myCanvas.styles.atoms_useJMOLColors = true;

    myCanvas.emptyMessage = 'No Data Loaded!';

    myCanvas.loadMolecule(eq1Mol);
  };

  const handleClick2 = async (e) => {
    let transformer = new ChemDoodle.TransformCanvas('test', 200, 200, true);
    //a little styling
    transformer.styles.atoms_useJMOLColors = true;
    transformer.styles.atoms_circles_2D = true;
    transformer.styles.atoms_HBlack_2D = false;
    transformer.styles.bonds_symmetrical_2D = true;
    transformer.styles.backgroundColor = '#E4FFC2';
    //an array of Point that will keep track of the path
    transformer.dragPath = [];
    //save the old handler
    transformer.oldDrag = transformer.drag;
    //define the new handler
    transformer.drag = function (e) {
      //notice that you can use the "this" keyword in an object's function to access its variables
      this.dragPath[transformer.dragPath.length] = e.p;
      //call the old handler
      this.oldDrag(e);
    };

    const res2 = await fetch('/testdata/eq0.mol');
    const mol4Text = await res2.text();
    console.log(mol4Text);
    const mol4 = ChemDoodle.readMOL(mol4Text);

    const res3 = await fetch('/testdata/test2.xyz');
    const mol5Text = await res3.text();
    console.log(mol5Text);
    const mol5 = ChemDoodle.readXYZ(mol5Text);

    const outtext8 = await fetchData('/testdata/test2.mol');
    const outMol8 = ChemDoodle.readMOL(outtext8);

    //draw on top of the canvas, covered on the next page
    // transformer.drawChildExtras = function (ctx) {
    //   if (this.dragPath.length != 0) {
    //     ctx.strokeStyle = 'red';
    //     ctx.lineWidth = 1;
    //     ctx.beginPath();
    //     ctx.moveTo(this.dragPath[0].x, this.dragPath[0].y);
    //     for (let i = 1, ii = this.dragPath.length; i < ii; i++) {
    //       ctx.lineTo(this.dragPath[i].x, this.dragPath[i].y);
    //     }
    //     ctx.stroke();
    //   }
    // };
    transformer.loadMolecule(
      // ChemDoodle.readMOL(
      //   'Molecule Name\n  CHEMDOOD12250908183D 0   0.00000     0.00000     0\n[Insert Comment Here]\n 40 44  0  0  0  0  0  0  0  0  1 V2000\n   -2.4201   -1.3169    0.4885   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -2.4007   -0.2197    0.6870   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -3.1630   -1.7585    0.5832   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.4920   -1.8472    0.1276   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -3.3129    0.2911    0.9878   O 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.4550    0.3261    0.5477   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.5339   -1.2844   -0.0016   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.5355   -2.6937   -0.0688   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -3.1138    1.0345    1.1162   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.5385   -0.2088    0.2615   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.3162    1.4114    0.6041   O 0  0  0  1  0  0  0  0  0  0  0  0\n    0.4574   -1.7528   -0.5024   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.3884    0.5420    0.1963   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.2569    1.5925    0.1057   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.6675   -2.4994   -0.0963   H 0  0  0  1  0  0  0  0  0  0  0  0\n    1.4380   -0.9689   -0.5556   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.2503   -1.9697   -1.3283   H 0  0  0  1  0  0  0  0  0  0  0  0\n    1.0495    0.4819    1.2355   C 0  0  0  1  0  0  0  0  0  0  0  0\n    1.0919    0.2175   -0.7577   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.1184    2.2301    0.5784   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.3921    2.0169   -1.0582   C 0  0  0  1  0  0  0  0  0  0  0  0\n    1.9358   -1.2202   -1.2354   H 0  0  0  1  0  0  0  0  0  0  0  0\n    2.1438   -0.9618    0.4030   N 0  0  0  1  0  0  0  0  0  0  0  0\n    1.6007   -0.6068    1.3817   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.5521    0.6440    1.9410   H 0  0  0  1  0  0  0  0  0  0  0  0\n    1.6648    1.1088    1.2152   H 0  0  0  1  0  0  0  0  0  0  0  0\n    0.5456    0.4220   -1.8161   C 0  0  0  1  0  0  0  0  0  0  0  0\n    1.8191    0.7140   -0.7698   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.4411    2.4257   -1.2400   O 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.1380    1.2410   -1.9394   C 0  0  0  1  0  0  0  0  0  0  0  0\n    0.1565    2.6937   -1.1652   H 0  0  0  1  0  0  0  0  0  0  0  0\n    2.6986   -1.9758    0.5733   C 0  0  0  1  0  0  0  0  0  0  0  0\n    2.1879   -0.5234    2.0289   H 0  0  0  1  0  0  0  0  0  0  0  0\n    1.0187   -1.2041    1.6545   H 0  0  0  1  0  0  0  0  0  0  0  0\n    0.7435   -0.0833   -2.4955   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.9229    1.9705   -0.8287   H 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.4917    1.3949   -2.7191   H 0  0  0  1  0  0  0  0  0  0  0  0\n    3.1158   -2.2288   -0.1548   H 0  0  0  1  0  0  0  0  0  0  0  0\n    3.3129   -1.8835    1.1918   H 0  0  0  1  0  0  0  0  0  0  0  0\n    2.1618   -2.6206    0.8240   H 0  0  0  1  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  2  5  1  0  0  0  0\n  2  6  1  0  0  0  0\n  7  4  2  0  0  0  0\n  4  8  1  0  0  0  0\n  5  9  1  0  0  0  0\n  6 10  2  0  0  0  0\n  6 11  1  0  0  0  0\n 10  7  1  0  0  0  0\n  7 12  1  0  0  0  0\n 10 13  1  0  0  0  0\n 14 11  1  0  0  0  0\n 12 15  1  0  0  0  0\n 16 12  1  0  0  0  0\n 12 17  1  0  0  0  0\n 13 18  1  0  0  0  0\n 13 14  1  0  0  0  0\n 13 19  1  0  0  0  0\n 14 20  1  0  0  0  0\n 21 14  1  0  0  0  0\n 16 22  1  0  0  0  0\n 19 16  1  0  0  0  0\n 16 23  1  0  0  0  0\n 18 24  1  0  0  0  0\n 18 25  1  0  0  0  0\n 18 26  1  0  0  0  0\n 19 27  1  0  0  0  0\n 19 28  1  0  0  0  0\n 21 29  1  0  0  0  0\n 30 21  1  0  0  0  0\n 21 31  1  0  0  0  0\n 23 32  1  0  0  0  0\n 23 24  1  0  0  0  0\n 24 33  1  0  0  0  0\n 24 34  1  0  0  0  0\n 27 35  1  0  0  0  0\n 27 30  2  0  0  0  0\n 29 36  1  0  0  0  0\n 30 37  1  0  0  0  0\n 32 38  1  0  0  0  0\n 32 39  1  0  0  0  0\n 32 40  1  0  0  0  0\nM  END'
      // )
      outMol8
    );
  };

  return (
    <Layout>
      <Head>
        <title>ChemDoodle test</title>
        <script type="text/javascript" src="/lib/ChemDoodleWeb.js"></script>
      </Head>
      <article>
        <div className={utilStyles.lightText}>
          {/* <Date dateString={postData.date} /> */}

          <button onClick={handleClick}>Test</button>
          <button onClick={handleClick2}>Test2</button>
          {/* <div id=ef={ref}></div> */}
          <canvas id="test"></canvas>
          <canvas id="transformer"></canvas>
        </div>
      </article>
    </Layout>
  );
}
