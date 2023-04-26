# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: These are the Database Schema Classes for the GRRM (Global Reaction Route Mapping) 
#              system of the scan-api-internal parts of the Scan Platform Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: ulid, datetime and typing, 3rd party pydantic
# =================================================================================================


# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
from datetime import datetime
from typing import List, Optional
import pydantic
import ulid
from pydantic import BaseModel

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Map Abr Schema Class
# -------------------------------------------------------------------------------------------------
class GRRMMapAbr(BaseModel):
    id: str
    atom_name: List[str] = []
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
    siml_pressure_atm: float
    energyshiftvalue_au: float
    level: str
    spinmulti: int
    totalcharge: float
    jobstatus: str
    registrant: str = None
    creator: str = None
    created_at: datetime
    updated_at: datetime

    @pydantic.validator("id", pre=True, always=True)
    def parse_id(cls, v, *, values, **kwargs):
        
        uid = ulid.parse(v)
        return uid.str

    class Config:
        orm_mode = True

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Map Schema Class
# -------------------------------------------------------------------------------------------------
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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Eq Abr Schema Class
# -------------------------------------------------------------------------------------------------
class EqAbr(BaseModel):
    id: str
    nid: int
    category: str
    energy: float
    comment: str

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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Eq Stats Schema Class
# -------------------------------------------------------------------------------------------------
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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Eq Schema Class
# -------------------------------------------------------------------------------------------------
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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Edge Abr Schema Class
# -------------------------------------------------------------------------------------------------
class EdgeAbr(BaseModel):
    id: str
    edge_id: int
    category: str
    energy: float
    comment: str
    connection0: int
    connection1: int

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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Edge Schema Class
# -------------------------------------------------------------------------------------------------
class Edge(BaseModel):
    id: str
    edge_id: int
    category: str
    symmetry: str
    xyz: List
    energy: List[float]
    gradient: List
    s2_value: float
    dipole: List
    comment: str
    hess_eigenvalue_au: List[float]
    connection0: int
    connection1: int
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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Path Node Abr Schema Class
# -------------------------------------------------------------------------------------------------
class PathNodeAbr(BaseModel):
    id: str

    nid: int
    category: str
    energy: float
    comment: str

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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Path Node Schema Class
# -------------------------------------------------------------------------------------------------
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

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# GRRM Eq Measure Schema Class
# -------------------------------------------------------------------------------------------------
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

# -------------------------------------------------------------------------------------------------
