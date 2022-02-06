# coding: utf-8

from datetime import datetime
from typing import List, Optional

import pydantic
import ulid
from pydantic import BaseModel


class GRRMMapAbr(BaseModel):
    id: str

    atom_name: List[str] = []
    # initxyz: List
    fname_top_abs: str
    fname_top_rel: str
    natoms: int
    lowest_energy: float
    highest_energy: float
    neq: int
    nts: int
    npt: int
    jobtime: datetime
    universal_gamma: float
    infile: str
    scpathpara: str
    jobtype: str
    pathtype: str
    nobondrearrange: int
    # siml_temperature_kelvin: List[float]
    siml_pressure_atm: float
    energyshiftvalue_au: float
    level: str
    spinmulti: int
    totalcharge: float
    jobstatus: str
    # ngradient: int
    # nhessian: int
    # elapsedtime_sec: float

    registrant: str = None
    creator: str = None

    # accessibility: int

    created_at: datetime
    updated_at: datetime

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):

        # uid = ulid.from_bytes(v)
        # uid = ulid.new()
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True


class GRRMMap(BaseModel):
    id: str

    atom_name: List[str] = []
    initxyz: List
    fname_top_abs: str
    fname_top_rel: str
    natoms: int
    lowest_energy: float
    highest_energy: float
    neq: int
    nts: int
    npt: int
    jobtime: datetime
    universal_gamma: float
    infile: str
    scpathpara: str
    jobtype: str
    pathtype: str
    nobondrearrange: int
    siml_temperature_kelvin: List[float]
    siml_pressure_atm: float
    energyshiftvalue_au: float
    level: str
    spinmulti: int
    totalcharge: float
    jobstatus: str
    ngradient: int
    nhessian: int
    elapsedtime_sec: float

    registrant: str = None
    creator: str = None

    accessibility: int

    created_at: datetime
    updated_at: datetime

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True


class EqAbr(BaseModel):
    id: str

    nid: int
    category: str
    # symmetry: str
    # xyz : List
    energy: float
    # gradient: List
    # s2_value: float
    # dipole: List
    comment: str
    # hess_eigenvalue_au: List[float]
    # created_at: datetime
    # updated_at: datetime

    # trafficvolume: List[float]
    # population: List[float]
    # reactionyield: List[float]

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("energy", pre=True, always=True)
    def parse_energy(cls, v, *, values, **kwargs):
        if type(v) is float:
            return v
        return v[0]

    class Config:
        orm_mode = True


class EqStats(BaseModel):
    id: str

    nid: int
    category: str
    energy: float
    comment: str

    frequency: Optional[int]
    measure: Optional[float]

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("energy", pre=True, always=True)
    def parse_energy(cls, v, *, values, **kwargs):
        if type(v) is float:
            return v
        return v[0]

    class Config:
        orm_mode = True


class Eq(BaseModel):
    id: str

    nid: int
    category: str
    symmetry: str
    xyz: List
    energy: List
    gradient: List
    s2_value: float
    dipole: List
    comment: str
    hess_eigenvalue_au: List[float]

    trafficvolume: List
    population: List
    reactionyield: List

    created_at: datetime
    updated_at: datetime

    map_id: str

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("map_id", pre=True, always=True)
    def parse_map_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True


class EdgeAbr(BaseModel):
    id: str

    edge_id: int
    category: str
    # symmetry: str
    # xyz : List
    energy: float
    # gradient: List
    # s2_value: float
    # dipole: List
    comment: str
    # electronic_energy_au: List[float]
    # hess_eigenvalue_au: List[float]

    connection0: int
    connection1: int
    # pathdata: List[str]

    # created_at: datetime
    # updated_at: datetime

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("energy", pre=True, always=True)
    def parse_energy(cls, v, *, values, **kwargs):
        if type(v) is float:
            return v
        return v[0]

    class Config:
        orm_mode = True


class Edge(BaseModel):
    id: str

    edge_id: int
    category: str
    symmetry: str
    xyz: List
    energy: List[float]
    # energy: float
    gradient: List
    s2_value: float
    dipole: List
    comment: str
    hess_eigenvalue_au: List[float]

    connection0: int
    connection1: int
    # pathdata: List[str]

    created_at: datetime
    updated_at: datetime

    map_id: str

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("map_id", pre=True, always=True)
    def parse_map_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True


class PathNodeAbr(BaseModel):
    id: str

    nid: int
    category: str
    # symmetry: str
    # xyz: List
    energy: float
    # gradient: List
    # s2_value: float
    # dipole: List
    comment: str
    # hess_eigenvalue_au: List[float]
    # created_at: datetime
    # updated_at: datetime

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("energy", pre=True, always=True)
    def parse_energy(cls, v, *, values, **kwargs):
        if type(v) is float:
            return v
        return v[0]

    class Config:
        orm_mode = True


class PathNode(BaseModel):
    id: str

    nid: int
    category: str
    symmetry: str
    xyz: List
    energy: List
    gradient: List
    s2_value: float
    dipole: List
    comment: str
    hess_eigenvalue_au: List[float]
    created_at: datetime
    updated_at: datetime

    map_id: str
    edge_id: str

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("map_id", pre=True, always=True)
    def parse_map_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("edge_id", pre=True, always=True)
    def parse_edge_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True


class EqMeasure(BaseModel):
    id: str

    eq_id: str
    map_id: str

    energy: List[float]
    frequency: int
    betweenness: float
    closeness: float
    pagerank: float

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("eq_id", pre=True, always=True)
    def parse_eq_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str

    @pydantic.validator("map_id", pre=True, always=True)
    def parse_map_id(cls, v, *, values, **kwargs):
        uid = ulid.parse(v)
        return uid.str


    class Config:
        orm_mode = True
