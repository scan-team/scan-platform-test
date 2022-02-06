from typing import Any

from fastapi_pagination.params import LimitOffsetPaginationParams, PaginationParams
from pydantic import BaseModel
from pydantic.dataclasses import dataclass

from fastapi import Query, params

limit_size = 1000


def _get_value(val: Any) -> Any:
    if isinstance(val, params.Query):
        return val.default

    return val


@dataclass
class CustomPaginationParams(PaginationParams):
    page: int = Query(0, ge=0, description="Page number")
    size: int = Query(100, gt=0, le=limit_size, description="Page size")

    def __post_init__(self) -> None:
        self.page = _get_value(self.page)
        self.size = _get_value(self.size)

    def to_limit_offset(self) -> LimitOffsetPaginationParams:
        return CustomLimitOffsetPaginationParams(
            limit=self.size,
            offset=self.size * self.page,
        )


@dataclass
class ItemsPaginationParams(PaginationParams):
    page: int = Query(0, ge=0, description="Page number")
    size: int = Query(1000, gt=0, le=limit_size, description="Page size")

    def __post_init__(self) -> None:
        self.page = _get_value(self.page)
        self.size = _get_value(self.size)

    def to_limit_offset(self) -> LimitOffsetPaginationParams:
        return CustomLimitOffsetPaginationParams(
            limit=self.size,
            offset=self.size * self.page,
        )


@dataclass
class CustomLimitOffsetPaginationParams:
    limit: int = Query(50, gt=0, le=limit_size, description="Page size limit")
    offset: int = Query(0, ge=0, description="Page offset")

    def __post_init__(self) -> None:
        self.limit = _get_value(self.limit)
        self.offset = _get_value(self.offset)

    def to_limit_offset(self) -> LimitOffsetPaginationParams:
        return self
