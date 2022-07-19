# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Update the Edge Structures Script for the 
#              scan-api-internal parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, sys, ulid, dotenv 
#             3rd party openbabel, tqdm and sqlalchemy
#             internal grrm support-functions models and utils
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

sys.path += [os.path.dirname(os.path.dirname(__file__))]

from grrm.models import GRRMMap, MapGraph
from grrm.utils import get_graph

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables + Initiations
# -------------------------------------------------------------------------------------------------
load_dotenv()

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Generate and update Map Graphs. (Global)
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

    maps = session.query(GRRMMap).all()

    for map in tqdm(maps):
        map_graph = session.query(MapGraph).filter(MapGraph.map == map).first()

        if map_graph and map.updated_at < map_graph.updated_at:
            print("Map Graph Found:", ulid.parse(map_graph.id).str)
            continue
        elif map_graph:
            print("Map Graph Update:", ulid.parse(map_graph.id).str)
            csv = get_graph(
                session,
                map.id,
                "csv",
            )
            map_graph.graph_csv = csv
            session.commit()
            continue
        
        csv = get_graph(
            session,
            map.id,
            "csv",
        )
        g = {}
        g_id = ulid.new()
        g["id"] = g_id
        g["map"] = map
        g["graph_csv"] = csv
        g_obj = MapGraph(**g)
        session.add(g_obj)
        session.commit()

# -------------------------------------------------------------------------------------------------
