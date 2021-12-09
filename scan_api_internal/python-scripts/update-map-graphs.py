import os
import sys
import datetime

import ulid
from openbabel import pybel

from tqdm import tqdm

from sqlalchemy import orm
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv

load_dotenv()

sys.path += [os.path.dirname(os.path.dirname(__file__))]


from grrm.models import GRRMMap, MapGraph
from grrm.utils import get_graph


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
    # maps = maps[:20]

    for map in tqdm(maps):

        map_graph = session.query(MapGraph).filter(MapGraph.map == map).first()

        if map_graph and map.updated_at < map_graph.updated_at:
            print("found:", ulid.parse(map_graph.id).str)
            continue
        elif map_graph:
            print("update:", ulid.parse(map_graph.id).str)
            csv = get_graph(
                session,
                map.id,
                "csv",
            )
            map_graph.graph_csv = csv
            session.commit()
            continue

        print("map: ", ulid.parse(map.id).str)
        csv = get_graph(
            session,
            map.id,
            "csv",
        )
        g = {}
        g_id = ulid.new()
        # s["id"] = s_id.bytes
        g["id"] = g_id
        g["map"] = map
        print(csv)
        g["graph_csv"] = csv

        g_obj = MapGraph(**g)
        session.add(g_obj)

        session.commit()

    print("end.")
