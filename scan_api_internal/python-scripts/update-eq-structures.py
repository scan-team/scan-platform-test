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


from grrm.models import Eq, EQStructures
from grrm.utils import get_structure


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

    eqs = session.query(Eq).all()
    # eqs = eqs[:20]

    for eq in tqdm(eqs):

        eq_structures = (
            session.query(EQStructures).filter(EQStructures.eq == eq).first()
        )

        if eq_structures and eq.updated_at < eq_structures.updated_at:
            print("found:", ulid.parse(eq_structures.id).str)
            continue
        elif eq_structures:
            print("update:", ulid.parse(eq_structures.id).str)
            smiles = get_structure(eq.map.atom_name, eq.xyz, "can")
            eq_structures.smiles = smiles
            session.commit()
            continue

        # print("eq: ", ulid.parse(eq.id).str)
        smiles = get_structure(eq.map.atom_name, eq.xyz, "can")
        mol = get_structure(eq.map.atom_name, eq.xyz, "mol")
        s = {}
        s_id = ulid.new()
        # s["id"] = s_id.bytes
        s["id"] = s_id.bytes
        s["eq"] = eq
        s["map"] = eq.map

        s["smiles"] = smiles
        s["mol"] = mol

        s_obj = EQStructures(**s)
        session.add(s_obj)

        session.commit()

    print(len(eqs))

    print("end.")
