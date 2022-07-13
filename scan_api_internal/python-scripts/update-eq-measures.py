# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Update the EQ Measures Script for the 
#              scan-api-internal parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, sys, io, ulid, dotenv, 3rd party pandas, networkx, openbabel, tqdm
#             and internal grrm support-functions models and utils
# =================================================================================================

# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
import os
import sys
import io
import ulid
import pandas as pd
import networkx as nx
import networkx.algorithms.centrality as nxc
from openbabel import pybel
from tqdm import tqdm
from sqlalchemy import orm
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv

from grrm.models import Eq, GRRMMap, MapGraph, EQMeasure
from grrm.utils import get_graph

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables + Initiations
# -------------------------------------------------------------------------------------------------
load_dotenv()

sys.path += [os.path.dirname(os.path.dirname(__file__))]

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Generate and update EQ Measures. (Global)
# -------------------------------------------------------------------------------------------------
if __name__ == "__main__":

    mysql_host = os.environ["DB_HOST"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    db_name = os.environ["DATABASE"]

    CONNECT_INFO = f"mysql+pymysql://{user}:{password}@{mysql_host}/{db_name}"
    print(CONNECT_INFO)
    engine = create_engine(CONNECT_INFO)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    maps = session.query(GRRMMap).all()

    for map in tqdm(maps):

        map_graph = session.query(MapGraph).filter(MapGraph.map == map).first()

        if map_graph is None:
            print("map-graph is not found for:", ulid.parse(map.id).str)
            print("Please make map-graph first.")
            continue

        map_id = ulid.parse(map.id)

        eqs = session.query(Eq).filter(Eq.map == map)
        print(str(eqs.count()) + " eqs found.")

        csv = map_graph.graph_csv
        df = pd.read_csv(io.StringIO(csv), index_col=0)

        eq_list = eqs.all()

        # frequency
        fs = df["n0"].value_counts()

        G = nx.from_pandas_edgelist(df, source="n0", target="n1")
        # betweenness
        bc = nxc.betweenness_centrality(G)
        # closeness
        cc = nxc.closeness_centrality(G)
        # pagerank
        pr = nx.pagerank(G)

        for eq in tqdm(eq_list):
            eqm = {}

            eqm["energy"] = eq.energy
            eqm["frequency"] = (
                0
                if len(fs[fs.index == ulid.from_bytes(eq.id).str].values) == 0
                else fs[fs.index == ulid.from_bytes(eq.id).str].values[0]
            )
            eqm["betweenness"] = bc.get(ulid.from_bytes(eq.id).str, None)
            eqm["closeness"] = cc.get(ulid.from_bytes(eq.id).str, None)
            eqm["pagerank"] = pr.get(ulid.from_bytes(eq.id).str, None)

            eqm["id"] = ulid.new()
            eqm["eq"] = eq
            eqm["map"] = map

            eqm_obj = EQMeasure(**eqm)

            session.add(eqm_obj)
            session.commit()

    print("end.")

# -------------------------------------------------------------------------------------------------
