from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

# from service.database import Base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.types import BINARY, JSON, TEXT, VARCHAR
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql.functions import current_timestamp

Base = declarative_base()


class GRRMMap(Base):
    __tablename__ = u"maps"

    id = Column(BINARY(16), primary_key=True)

    atom_name = Column(JSON)
    initxyz = Column(JSON)
    fname_top_abs = Column(VARCHAR(1024))
    fname_top_rel = Column(VARCHAR(256))
    natoms = Column(Integer)
    lowest_energy = Column(Float)
    highest_energy = Column(Float)
    neq = Column(Integer)
    nts = Column(Integer)
    npt = Column(Integer)
    jobtime = Column(DateTime)
    universal_gamma = Column(Float)
    infile = Column(VARCHAR(256))
    scpathpara = Column(VARCHAR(256))
    jobtype = Column(VARCHAR(20))
    pathtype = Column(VARCHAR(20))
    nobondrearrange = Column(Integer)
    siml_temperature_kelvin = Column(JSON)
    siml_pressure_atm = Column(Float)
    energyshiftvalue_au = Column(Float)
    level = Column(VARCHAR(256))
    spinmulti = Column(Integer)
    totalcharge = Column(Float)
    jobstatus = Column(VARCHAR(20))
    ngradient = Column(Integer)
    nhessian = Column(Integer)
    elapsedtime_sec = Column(Float)

    registrant = Column(VARCHAR(256))
    creator = Column(VARCHAR(256))

    accessibility = Column(Integer)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())


class Eq(Base):
    __tablename__ = u"eqs"

    id = Column(BINARY(16), primary_key=True)
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))

    nid = Column(Integer)
    category = Column(VARCHAR(20))
    symmetry = Column(VARCHAR(20))
    xyz = Column(JSON)
    energy = Column(JSON)
    gradient = Column(JSON)
    s2_value = Column(Float)
    dipole = Column(JSON)
    comment = Column(TEXT)
    hess_eigenvalue_au = Column(JSON)

    trafficvolume = Column(JSON)
    population = Column(JSON)
    reactionyield = Column(JSON)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    map = relationship("GRRMMap")


class Edge(Base):
    __tablename__ = u"edges"

    id = Column(BINARY(16), primary_key=True)
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))

    edge_id = Column(Integer)
    category = Column(VARCHAR(20))
    symmetry = Column(VARCHAR(20))
    xyz = Column(JSON)
    energy = Column(JSON)
    gradient = Column(JSON)
    s2_value = Column(Float)
    dipole = Column(JSON)
    comment = Column(TEXT)
    hess_eigenvalue_au = Column(JSON)

    connection0 = Column(Integer)
    connection1 = Column(Integer)
    pathdata = Column(JSON)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    map = relationship("GRRMMap")


class PNode(Base):
    __tablename__ = u"path_nodes"

    id = Column(BINARY(16), primary_key=True)
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))
    edge_id = Column("edge_id", BINARY(16), ForeignKey("edges.id"))

    nid = Column(Integer)
    category = Column(VARCHAR(20))
    symmetry = Column(VARCHAR(20))
    xyz = Column(JSON)
    energy = Column(JSON)
    gradient = Column(JSON)
    s2_value = Column(Float)
    dipole = Column(JSON)
    comment = Column(TEXT)
    hess_eigenvalue_au = Column(JSON)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    map = relationship("GRRMMap")
    edge = relationship("Edge")


class EQStructures(Base):
    __tablename__ = u"eq_structures"

    id = Column(BINARY(16), primary_key=True)
    eq_id = Column("eq_id", BINARY(16), ForeignKey("eqs.id"))
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))

    mol = Column(TEXT)
    smiles = Column(TEXT)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    eq = relationship("Eq")
    map = relationship("GRRMMap")


class EdgeStructures(Base):
    __tablename__ = u"edge_structures"

    id = Column(BINARY(16), primary_key=True)
    edge_id = Column("edge_id", BINARY(16), ForeignKey("edges.id"))
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))

    mol = Column(TEXT)
    smiles = Column(TEXT)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    edge = relationship("Edge")
    map = relationship("GRRMMap")


class MapGraph(Base):
    __tablename__ = u"map_graphs"

    id = Column(BINARY(16), primary_key=True)
    map_id = Column("map_id", BINARY(16), ForeignKey("maps.id"))

    graph_csv = Column(MEDIUMTEXT)

    created_at = Column(DateTime, server_default=current_timestamp())
    updated_at = Column(DateTime, server_default=current_timestamp())

    map = relationship("GRRMMap")
