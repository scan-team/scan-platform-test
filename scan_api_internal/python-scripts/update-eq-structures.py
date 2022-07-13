# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Update the EQ Structures Script for the 
#              scan-api-internal parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, sys, ulid, dotenv 
#             3rd party openbabel, tqdm sqlalchemy 
#             and internal grrm support-functions models and utils
# =================================================================================================

# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
import os
import sys
import ulid
from openbabel import pybel
from tqdm import tqdm
from sqlalchemy import orm
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv

from grrm.models import Eq, EQStructures
from grrm.utils import get_structure

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables + Initiations
# -------------------------------------------------------------------------------------------------
load_dotenv()

sys.path += [os.path.dirname(os.path.dirname(__file__))]

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Generate and update EQ Structures. (Global)
# -------------------------------------------------------------------------------------------------
if __name__ == "__main__":

    mysql_host = os.environ["DB_HOST"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DATABASE"]

    CONNECT_INFO = f"mysql+pymysql://{user}:{password}@{mysql_host}/{db_name}"
    engine = create_engine(CONNECT_INFO)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    eqs = session.query(Eq).all()

    for eq in tqdm(eqs):

        eq_structures = (
            session.query(EQStructures).filter(EQStructures.eq == eq).first()
        )

        if eq_structures and eq.updated_at < eq_structures.updated_at:
            print("EQ Structures Found:", ulid.parse(eq_structures.id).str)
            continue
        elif eq_structures:
            print("EQ Structures Update:", ulid.parse(eq_structures.id).str)
            smiles = get_structure(eq.map.atom_name, eq.xyz, "can")
            eq_structures.smiles = smiles
            session.commit()
            continue

        smiles = get_structure(eq.map.atom_name, eq.xyz, "can")
        mol = get_structure(eq.map.atom_name, eq.xyz, "mol")
        s = {}
        s_id = ulid.new()
        s["id"] = s_id.bytes
        s["eq"] = eq
        s["map"] = eq.map
        s["smiles"] = smiles
        s["mol"] = mol
        s_obj = EQStructures(**s)
        session.add(s_obj)
        session.commit()

# -------------------------------------------------------------------------------------------------
