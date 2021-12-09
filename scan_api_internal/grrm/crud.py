import ulid
from sqlalchemy import desc, func
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import quoted_name
from sqlalchemy.sql.expression import asc
from sqlalchemy import distinct
from sqlalchemy.dialects import mysql

from grrm import models


class Database:
    @staticmethod
    def get_maps(
        db: Session,
        atoms=[],
        before=None,
        after=None,
        sort="updated_at",
    ):
        """
        Get Maps
        :param db: SQLAlchemy Session
        :param atoms: str included atoms (comma-separated)
        :param before: datetime filter datetime
        :param after: datetime filter datetime
        :param sort: sort results by a specified column (comma-separated)
        :return: Maps
        """
        q = db.query(models.GRRMMap)

        if len(atoms) > 0:
            atoms_str = str(atoms).replace("'", '"')
            # q = q.filter(func.json_contains(models.GRRMMap.atom_name, f'["H", "C"]'))
            q = q.filter(func.json_contains(models.GRRMMap.atom_name, f"{atoms_str}"))

        if sort:
            sorts = sort.split(",")
            print(sorts)
            for s in sorts:
                if s.startswith("-"):
                    q = q.order_by(desc(models.GRRMMap.__dict__[s.lstrip("-")]))
                else:
                    q = q.order_by(asc(models.GRRMMap.__dict__[s.lstrip("+")]))

        # print(str(q.statement.compile()))

        if before:
            q = q.filter(models.GRRMMap.updated_at <= before)

        if after:
            q = q.filter(models.GRRMMap.updated_at >= after)

        return q


    @staticmethod
    def get_accessible_maps(
        db: Session,
        atoms=[],
        before=None,
        after=None,
        sort="updated_at",
    ):
        """
        Get accessible maps
        :param db: SQLAlchemy Session
        :param atoms: str included atoms (comma-separated)
        :param before: datetime filter datetime
        :param after: datetime filter datetime
        :param sort: sort results by a specified column (comma-separated)
        :return: Maps
        """

        # only access the public maps
        q = db.query(models.GRRMMap).filter(models.GRRMMap.accessibility == 0)

        if len(atoms) > 0:
            atoms_str = str(atoms).replace("'", '"')
            # q = q.filter(func.json_contains(models.GRRMMap.atom_name, f'["H", "C"]'))
            q = q.filter(func.json_contains(models.GRRMMap.atom_name, f"{atoms_str}"))

        if sort:
            sorts = sort.split(",")
            print(sorts)
            for s in sorts:
                if s.startswith("-"):
                    q = q.order_by(desc(models.GRRMMap.__dict__[s.lstrip("-")]))
                else:
                    q = q.order_by(asc(models.GRRMMap.__dict__[s.lstrip("+")]))

        # print(str(q.statement.compile()))

        if before:
            q = q.filter(models.GRRMMap.updated_at <= before)

        if after:
            q = q.filter(models.GRRMMap.updated_at >= after)

        return q


    @staticmethod
    def get_maps_with_smiles(
        db: Session,
        smiles="",
        sort="updated_at",
    ):
        """
        Get Maps
        :param db: SQLAlchemy Session
        :param atoms: str included atoms (comma-separated)
        :param before: datetime filter datetime
        :param after: datetime filter datetime
        :param sort: sort results by a specified column (comma-separated)
        :return: Maps
        """

        accessible_maps = Database.get_accessible_maps(db)

        print("smiles:", smiles)
        q = db.query(models.EQStructures.map_id).filter(models.EQStructures.map_id.in_(m.id for m in accessible_maps.all()))
        q = q.filter(
            func.match_substruct(
                smiles, func.molecule_to_serializedOBMol(models.EQStructures.mol)
            )
        )

        q = q.distinct()
        l = list(q.all())
        map_ids = list(map(lambda x: ulid.from_bytes(x[0]), l))
        print(len(map_ids), "items found.")

        qdummy = db.query(models.GRRMMap).filter(models.GRRMMap.id.in_(map_ids))

        print("----")

        return qdummy

    @staticmethod
    def get_map(
        db: Session,
        map_id: str,
    ):
        """
        Get Map
        :param db: SQLAlchemy Session
        :param map_id: scan db map id
        :return: Map metadata
        """
        id = ulid.parse(map_id)
        return db.query(models.GRRMMap).filter(models.GRRMMap.id == id).first()

    @staticmethod
    def get_graph(
        db: Session,
        map_id: str,
    ):
        """
        Get Graph
        :param db: SQLAlchemy Session
        :param map_id: scan db map id
        :return: Graph CSV
        """
        id = ulid.parse(map_id)
        map = db.query(models.GRRMMap).filter(models.GRRMMap.id == id).first()
        csv = (
            db.query(models.MapGraph)
            .filter(models.MapGraph.map_id == id)
            .first()
            .graph_csv
        )
        # print("csv:", csv)
        return csv

    @staticmethod
    def get_eqs(
        db: Session,
        map_id: str,
        sort: str = "updated_at",
    ):
        """
        Get Eq list
        :param db: SQLAlchemy Session
        :param map_id: scan db map id
        :return: Eq list
        """
        id = ulid.parse(map_id)
        map = db.query(models.GRRMMap).filter(models.GRRMMap.id == id).first()

        q = db.query(models.Eq).filter(models.Eq.map == map)
        if sort:
            sorts = sort.split(",")
            print(sorts)
            for s in sorts:
                if s.startswith("-"):
                    q = q.order_by(desc(models.Eq.__dict__[s.lstrip("-")]))
                else:
                    q = q.order_by(asc(models.Eq.__dict__[s.lstrip("+")]))

        return q

    @staticmethod
    def get_eqs_with_smiles(
        db: Session,
        smiles="",
        sort="updated_at",
    ):

        print("smiles:", smiles)
        q = db.query(models.EQStructures)
        q = q.filter(
            func.match_substruct(
                smiles, func.molecule_to_serializedOBMol(models.EQStructures.mol)
            )
        )

        q = q.distinct()

        return q

    @staticmethod
    def get_eq(db: Session, eq_id: str):
        """
        Get Eq
        :param db: SQLAlchemy Session
        :param eq_id: scan db eq id
        :return: Eq metadata
        """
        id = ulid.parse(eq_id)
        return db.query(models.Eq).filter(models.Eq.id == id).first()

    @staticmethod
    def get_eq_measure(db: Session, eq_id: str):
        """
        Get Eq
        :param db: SQLAlchemy Session
        :param eq_id: scan db eq id
        :return: Eq metadata
        """
        id = ulid.parse(eq_id)

        return db.query(models.EQMeasure).filter(models.EQMeasure.eq_id == id).first()


    @staticmethod
    def get_eq_measures(db: Session, map_id: str):
        """
        Get Eq measures
        :param db: SQLAlchemy Session
        :param eq_id: scan db eq id
        :return: Eq measures
        """

        id = ulid.parse(map_id)
        map = db.query(models.GRRMMap).filter(models.GRRMMap.id == id).first()

        q = db.query(models.EQMeasure).filter(models.EQMeasure.map == map)

        return q


    @staticmethod
    def get_edges(
        db: Session,
        map_id: str,
        sort: str = "updated_at",
    ):
        """
        Get Edge list
        :param db: SQLAlchemy Session
        :param map_id: scan db map id
        :return: Eq metadata
        """
        id = ulid.parse(map_id)
        map = db.query(models.GRRMMap).filter(models.GRRMMap.id == id).first()

        q = db.query(models.Edge).filter(models.Edge.map == map)
        if sort:
            sorts = sort.split(",")
            print(sorts)
            for s in sorts:
                if s.startswith("-"):
                    q = q.order_by(desc(models.Edge.__dict__[s.lstrip("-")]))
                else:
                    q = q.order_by(asc(models.Edge.__dict__[s.lstrip("+")]))

        return q

    @staticmethod
    def get_edge(db: Session, edge_id: str):
        """
        Get Edge
        :param db: SQLAlchemy Session
        :param edge_id: scan db edge id
        :return: Edge metadata
        """
        id = ulid.parse(edge_id)
        return db.query(models.Edge).filter(models.Edge.id == id).first()

    @staticmethod
    def get_pathnodes(
        db: Session,
        edge_id: str,
    ):
        """
        Get pathnodes
        :param db: SQLAlchemy Session
        :param edge_id: scan db edge id
        :return: Eq metadata
        """
        id = ulid.parse(edge_id)
        edge = db.query(models.Edge).filter(models.Edge.id == id).first()

        pathnodes = []

        for p_id_str in edge.pathdata:
            p_id = ulid.parse(p_id_str)
            p_node = db.query(models.PNode).filter(models.PNode.id == p_id).first()
            if p_node:
                pathnodes.append(p_node)

        return pathnodes

    @staticmethod
    def get_pathnode(db: Session, pnode_id: str):
        """
        Get Pathnode
        :param db: SQLAlchemy Session
        :param pnode_id: scan db edge id
        :return: Edge metadata
        """
        id = ulid.parse(pnode_id)
        return db.query(models.PNode).filter(models.PNode.id == id).first()
