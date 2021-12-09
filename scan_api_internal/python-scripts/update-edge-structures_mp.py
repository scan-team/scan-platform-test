import os
import sys
import datetime

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

sys.path += [os.path.dirname(os.path.dirname(__file__))]


from grrm.models import Edge, EdgeStructures
from grrm.utils import get_structure
from dotenv import load_dotenv

load_dotenv()


@contextlib.contextmanager
def tqdm_joblib(tqdm_object, interval):
    """Context manager to patch joblib to report into tqdm progress bar given as argument"""

    class TqdmBatchCompletionCallback(joblib.parallel.BatchCompletionCallBack):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

        def __call__(self, *args, **kwargs):
            tqdm_object.update(n=self.batch_size)

            # i = tqdm_object.n
            # if i != 0 and i % interval == 0:
            #     match = re.search(r"\[(.+)\]", str(tqdm_object))

            #     text = str(i) + " items processed. " + match.group(0)
            # send_slack_notification(text)

            return super().__call__(*args, **kwargs)

    old_batch_callback = joblib.parallel.BatchCompletionCallBack
    joblib.parallel.BatchCompletionCallBack = TqdmBatchCompletionCallback
    try:
        yield tqdm_object
    finally:
        joblib.parallel.BatchCompletionCallBack = old_batch_callback
        tqdm_object.close()


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
            print("found:", ulid.parse(edge_structures.id).str)

        elif edge_structures:
            print("update:", ulid.parse(edge_structures.id).str)
            smiles = get_structure(edge.map.atom_name, edge.xyz, "can")
            mol = get_structure(edge.map.atom_name, edge.xyz, "mol")
            edge_structures.smiles = smiles
            edge_structures.mol = mol
            session.commit()

        else:
            # print("eq: ", ulid.parse(eq.id).str)
            smiles = get_structure(edge.map.atom_name, edge.xyz, "can")
            mol = get_structure(edge.map.atom_name, edge.xyz, "mol")
            s = {}
            s_id = ulid.new()
            # s["id"] = s_id.bytes
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
    print(CONNECT_INFO)
    engine = create_engine(CONNECT_INFO)

    noc = multi.cpu_count()
    if int(args.core) <= noc:
        noc = int(args.core)
    print("noc: ", noc)

    Session = orm.sessionmaker(bind=engine)
    session = Session()

    edges = session.query(Edge).all()
    edge_ids = [edge.id for edge in edges]
    # edges = edges[:20]

    print(f"{len(edges)} edges are found.")

    with tqdm_joblib(
        tqdm(desc="reg:", total=len(edge_ids)), interval=100
    ) as progress_bar:
        Parallel(n_jobs=noc)(delayed(register_structures)(i) for i in edge_ids)

    print(f"{len(edges)} edges are processed.")

    print("end.")
