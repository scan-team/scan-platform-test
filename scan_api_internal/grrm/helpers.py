# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is a set of help classes for the GRRM (Global Reaction Route Mapping) 
#              system of the scan-api-internal parts of the Scan Platform Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: __future__, typing, 3rd party fastapi
# =================================================================================================


# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
from __future__ import annotations
from typing import TypeVar, Generic, Sequence
from fastapi_pagination.default import Page as BasePage, Params as BaseParams
from fastapi import Query

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Global constants and variables
# -------------------------------------------------------------------------------------------------
limit_size = 1000
T = TypeVar("T")

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# Various Support Classes
# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
class CustomPaginationParams(BaseParams):
    page: int = Query(1, gt=0, description="Page number")
    size: int = Query(100, gt=0, le=limit_size, description="Page size")

# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
class ItemsPaginationParams(BaseParams):
    page: int = Query(1, gt=0, description="Page number")
    size: int = Query(1000, gt=0, le=limit_size, description="Page size")

# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
class CustomLimitOffsetPaginationParams(BaseParams):
    limit: int = Query(50, gt=0, le=limit_size, description="Page size limit")
    offset: int = Query(0, ge=0, description="Page offset")

# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
class MapPage(BasePage[T], Generic[T]):
    __params_type__ = CustomPaginationParams

# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
class ItemsPage(BasePage[T], Generic[T]):
    __params_type__ = ItemsPaginationParams

# -------------------------------------------------------------------------------------------------
