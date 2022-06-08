# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Update the EQ Structures (mp version) Script for the 
#              scan-api-internal parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, sys, ulid, joblib, contextlib, multiprocessing, argparse, dotenv 
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
from joblib import Parallel, delayed
import contextlib
import joblib
import multiprocessing as multi
from sqlalchemy import orm
from sqlalchemy.engine import create_engine
import argparse
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
# Register Structures (param: EQ Id)
# -------------------------------------------------------------------------------------------------
def register_structures(eq_id):

    mysql_host = os.environ["DB_HOST"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DATABASE"]

    CONNECT_INFO = f"mysql+pymysql://{user}:{password}@{mysql_host}/{db_name}"
    engine = create_engine(CONNECT_INFO)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    try:

        eq = session.query(Eq).filter(Eq.id == eq_id).first()
        eq_structures = (
            session.query(EQStructures).filter(EQStructures.eq == eq).first()
        )

        if eq_structures and eq.updated_at < eq_structures.updated_at:
            print("EQ Structure Found:", ulid.parse(eq_structures.id).str)

        elif eq_structures:
            print("EQ Structure Update:", ulid.parse(eq_structures.id).str)
            smiles = get_structure(eq.map.atom_name, eq.xyz, "can")
            eq_structures.smiles = smiles
            session.commit()

        else:
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

    except:
        raise
    finally:
        session.close()

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Generate and update EQ Structures. (Global)
# -------------------------------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate and update eq_structures.")

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

    eqs = session.query(Eq).all()
    eq_ids = [eq.id for eq in eqs]

    with tqdm_joblib(
        tqdm(desc="reg:", total=len(eq_ids)), interval=100
    ) as progress_bar:
        Parallel(n_jobs=noc)(delayed(register_structures)(i) for i in eq_ids)

# -------------------------------------------------------------------------------------------------
