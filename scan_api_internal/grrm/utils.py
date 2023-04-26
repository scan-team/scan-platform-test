# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is a set of utils functions for the GRRM (Global Reaction Route Mapping) 
#              system of the scan-api-internal parts of the Scan Platform Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: openlabel, pandas, ulid, numpy, io, 3rd party scipy, sqlalchemy
#             and internal grrm support-functions from models
# =================================================================================================


# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
import openbabel as ob
from openbabel import pybel
import pandas as pd
import ulid
import numpy as np
from scipy.constants import constants as cc
from scipy.constants import physical_constants as pc
from sqlalchemy import func
import io
from .models import GRRMMap, Eq, Edge

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Get Molecule Structure 
# -------------------------------------------------------------------------------------------------
def get_structure(atoms, xyz_array, format="xyz") -> str:
    contents = []
    np_array = np.array(xyz_array)

    # convert unit
    np_array_converted = np_array * pc["Bohr radius"][0] / cc.angstrom
    xyz_array = np_array_converted

    contents.append(str(len(atoms)) + "\n")
    contents.append("\n")
    for i, atom in enumerate(atoms):
        contents.append(
            "%2s  %20.14f%20.14f%20.14f\n"
            % (atom, xyz_array[i][0], xyz_array[i][1], xyz_array[i][2])
        )

    xyz = "".join(contents)
    result = xyz

    if format == "mol":
        molecule = pybel.readstring("xyz", xyz)
        result = molecule.write("mol")

    if format == "can":
        molecule = pybel.readstring("xyz", xyz)
        smiles = molecule.write("can")
        result = smiles.split("\t")[0]

    return result
# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Get Graph (as cvs)
# -------------------------------------------------------------------------------------------------
def get_graph(db, map_id, format):
    id = ulid.parse(map_id)
    map = (
        db.query(GRRMMap)
        .filter(GRRMMap.id == id)
        .first()
    )
    
    eds = db.query(Edge).filter(Edge.map == map)

    rows = []
    for edge in eds:
        row = {}

        row["edge_id"] = ulid.parse(edge.id).str
        row["energy"] = edge.energy

        n0 = db.query(Eq).filter(Eq.nid == edge.connection0, Eq.map == map).first()
        n1 = db.query(Eq).filter(Eq.nid == edge.connection1, Eq.map == map).first()
        
        row["n0"] = ulid.parse(n0.id).str if n0 else None
        row["n0_energy"] = n0.energy if n0 else None
        row["n1"] = ulid.parse(n1.id).str if n1 else None
        row["n1_energy"] = n1.energy if n1 else None

        rows.append(row)

    df = pd.DataFrame(rows)
    buffer = io.StringIO()
    df.to_csv(buffer)
    return buffer.getvalue()
# -------------------------------------------------------------------------------------------------
