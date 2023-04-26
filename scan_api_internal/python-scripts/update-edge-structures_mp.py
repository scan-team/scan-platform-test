# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Update the Edge Structures Script for the 
#              scan-api-internal parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, sys, ulid, joblib, contextlib, multiprocessing, argparse, dotenv 
#             3rd party openbabel, tqdm and internal grrm support-functions models and utils
# =================================================================================================

# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
import os
import sys
import ulid
from openbabel import pybel
from tqdm import tqdm
from joblib import Parallel, delayed
import contextlib
import joblib
import multiprocessing as multi
from sqlalchemy import orm
from sqlalchemy.engine import create_engine
import argparse

from dotenv import load_dotenv

sys.path += [os.path.dirname(os.path.dirname(__file__))]

from grrm.models import Edge, EdgeStructures
from grrm.utils import get_structure

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables + Initiations
# -------------------------------------------------------------------------------------------------
load_dotenv()

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Context manager to patch joblib to report into tqdm progress bar given as argument
# -------------------------------------------------------------------------------------------------
@contextlib.contextmanager
def tqdm_joblib(tqdm_object, interval):
    """Context manager to patch joblib to report into tqdm progress bar given as argument"""

    class TqdmBatchCompletionCallback(joblib.parallel.BatchCompletionCallBack):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

        def __call__(self, *args, **kwargs):
            tqdm_object.update(n=self.batch_size)

            return super().__call__(*args, **kwargs)

    old_batch_callback = joblib.parallel.BatchCompletionCallBack
    joblib.parallel.BatchCompletionCallBack = TqdmBatchCompletionCallback
    try:
        yield tqdm_object
    finally:
        joblib.parallel.BatchCompletionCallBack = old_batch_callback
        tqdm_object.close()

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Register Structures (param: Edge Id)
# -------------------------------------------------------------------------------------------------
def register_structures(edge_id):

    mysql_host = os.environ["DB_HOST"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DATABASE"]

    CONNECT_INFO = f"mysql+pymysql://{user}:{password}@{mysql_host}/{db_name}"
    engine = create_engine(CONNECT_INFO)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    try:
        edge = session.query(Edge).filter(Edge.id == edge_id).first()
        edge_structures = (
            session.query(EdgeStructures).filter(EdgeStructures.edge == edge).first()
        )

        if edge_structures and edge.updated_at < edge_structures.updated_at:
            print("Edge Structures Found:", ulid.parse(edge_structures.id).str, flush=True)

        elif edge_structures:
            print("Edge Structures Update:", ulid.parse(edge_structures.id).str, flush=True)
            smiles = get_structure(edge.map.atom_name, edge.xyz, "can")
            mol = get_structure(edge.map.atom_name, edge.xyz, "mol")
            edge_structures.smiles = smiles
            edge_structures.mol = mol
            session.commit()

        else:
            smiles = get_structure(edge.map.atom_name, edge.xyz, "can")
            mol = get_structure(edge.map.atom_name, edge.xyz, "mol")
            s = {}
            s_id = ulid.new()
            s["id"] = s_id.bytes
            s["edge"] = edge
            s["map"] = edge.map
            s["smiles"] = smiles
            s["mol"] = mol
            s_obj = EdgeStructures(**s)
            session.add(s_obj)
            session.commit()
    except:
        raise
    finally:
        session.close()

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Generate and update Edge Structures. (Global)
# -------------------------------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate and update edge_structures.")

    parser.add_argument(
        "-c", "--core", help="the number of used cores", default=multi.cpu_count()
    )
    args = parser.parse_args()

    mysql_host = os.environ["DB_HOST"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DATABASE"]

    CONNECT_INFO = f"mysql+pymysql://{user}:{password}@{mysql_host}/{db_name}"
    engine = create_engine(CONNECT_INFO)

    noc = multi.cpu_count()
    if int(args.core) <= noc:
        noc = int(args.core)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    edges = session.query(Edge).all()
    edge_ids = [edge.id for edge in edges]

    with tqdm_joblib(
        tqdm(desc="reg:", total=len(edge_ids)), interval=100
    ) as progress_bar:
        Parallel(n_jobs=noc)(delayed(register_structures)(i) for i in edge_ids)

# -------------------------------------------------------------------------------------------------
