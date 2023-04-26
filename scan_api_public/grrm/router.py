# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the data router for the GRRM (Global Reaction Route Mapping) 
#              system of the scan-api-public parts of the Scan Platform Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: typing, 3rd party fastapi and sqlalchemy, and internal grrm schemas, Database and 
#             helpers
# =================================================================================================


# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.paginator import paginate as paginate_list
from fastapi_pagination import PaginationParams, using_params
from fastapi_limiter.depends import RateLimiter
from sqlalchemy.orm import Session

from grrm import schemas
from grrm.crud import Database
from service.database import session
from .helpers import CustomPaginationParams, ItemsPaginationParams

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables
# -------------------------------------------------------------------------------------------------
pagination_params = using_params(CustomPaginationParams)
items_pagination_params = using_params(ItemsPaginationParams)

router = APIRouter()


@router.get(
    "/maps",
    response_model=Page[schemas.GRRMMapAbr],
    dependencies=[
        Depends(pagination_params),
        Depends(RateLimiter(times=10, seconds=5)),
    ],
)
async def get_maps(
    atoms: Optional[str] = None,
    before: Optional[str] = None,
    after: Optional[str] = None,
    sort: Optional[str] = None,
    # orderby: Optional[str] = "updated_at",
    # order: Optional[str] = None,
    db: Session = Depends(session),
):
    """
    Maps

    :param db: DB Session
    :return: Maps
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    in_atoms = []
    if atoms:
        in_atoms = list(set(atoms.split(",")))

    maps = Database.get_maps(db, in_atoms, before, after, sort)

    #     def comp(map):
    #         a_names = set(map.atom_name)
    #         return in_atoms <= a_names

    #     maps = list(filter(comp, maps))

    if maps:
        return paginate(maps)
    raise HTTPException(status_code=404, detail=f"maps not found")


@router.get(
    "/maps/{map_id}",
    response_model=schemas.GRRMMap,
    dependencies=[Depends(RateLimiter(times=10, seconds=5))],
)
async def get_map(
    map_id: str,
    db: Session = Depends(session),
):
    """
    Map metadata
    :param map_id: grrm map id
    :param db: DB Session
    :return: Map metadata
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """

    map = Database.get_map(db, map_id)
    if map:
        return map
    raise HTTPException(status_code=404, detail=f"map not found: {map_id}")


@router.get(
    "/maps/{map_id}/eqs",
    response_model=Page[schemas.EqAbr],
    dependencies=[
        Depends(items_pagination_params),
        Depends(RateLimiter(times=10, seconds=5)),
    ],
)
async def get_eqs_in_map(
    map_id: str, sort: Optional[str] = None, db: Session = Depends(session)
):
    """
    Find Eqs in the specified map
    :param db: DB Session
    :return: Maps
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    eqs = Database.get_eqs(db, map_id, sort)
    if eqs:
        return paginate(eqs)
    raise HTTPException(status_code=404, detail=f"Eqs are not found on map: {map_id}")


@router.get(
    "/eqs/{eq_id}",
    response_model=schemas.Eq,
    dependencies=[Depends(RateLimiter(times=10, seconds=5))],
)
async def get_eq(eq_id: str, db: Session = Depends(session)):
    """
    Eq metadata
    :param eq_id: grrm eq id
    :param db: DB Session
    :return: Eq metadata
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    eq = Database.get_eq(db, eq_id)
    if eq:
        return eq
    raise HTTPException(status_code=404, detail=f"eq not found: {eq_id}")


@router.get(
    "/maps/{map_id}/edges",
    response_model=Page[schemas.EdgeAbr],
    dependencies=[
        Depends(items_pagination_params),
        Depends(RateLimiter(times=10, seconds=5)),
    ],
)
async def get_edges_in_map(
    map_id: str, sort: Optional[str] = None, db: Session = Depends(session)
):
    """
    Find Eqs in the specified map
    :param db: DB Session
    :return: Maps
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    eqs = Database.get_edges(db, map_id, sort)
    if eqs:
        return paginate(eqs)
    raise HTTPException(status_code=404, detail=f"Edges are not found on map: {map_id}")


@router.get(
    "/edges/{edge_id}",
    response_model=schemas.Edge,
    dependencies=[Depends(RateLimiter(times=10, seconds=5))],
)
async def get_edge(edge_id: str, db: Session = Depends(session)):
    """
    Edge metadata
    :param edge_id: grrm edge id
    :param db: DB Session
    :return: Edge metadata
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    edge = Database.get_edge(db, edge_id)
    if edge:
        return edge
    raise HTTPException(status_code=404, detail=f"edge not found: {edge_id}")


@router.get(
    "/edges/{edge_id}/pathnodes",
    response_model=Page[schemas.PathNodeAbr],
    dependencies=[
        Depends(items_pagination_params),
        Depends(RateLimiter(times=10, seconds=5)),
    ],
)
async def get_pathnodes(edge_id: str, db: Session = Depends(session)):
    """
    Pathnode list
    :param edge_id: grrm edge id
    :param db: DB Session
    :return: Pathnode list
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    pathnodes = Database.get_pathnodes(db, edge_id)
    if pathnodes:
        return paginate_list(pathnodes)
    raise HTTPException(status_code=404, detail=f"pathnodes not found on: {edge_id}")


@router.get(
    "/pathnodes/{pnode_id}",
    response_model=schemas.PathNode,
    dependencies=[Depends(RateLimiter(times=10, seconds=5))],
)
async def get_pathnode(pnode_id: str, db: Session = Depends(session)):
    """
    Pathnode metadata
    :param pnode_id: grrm pathnode id
    :param db: DB Session
    :return: Pathnode metadata
    :rtype: JSON or CSV
    :exception: HTTPException(404)
    """
    map = Database.get_pathnode(db, pnode_id)
    if map:
        return map
    raise HTTPException(status_code=404, detail=f"pathnode not found: {pnode_id}")