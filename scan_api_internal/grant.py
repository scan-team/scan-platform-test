
from service.database import session
from grrm import models
import ulid


# --------------------------------------------
# set default map level
# --------------------------------------------
def set_default_map_level(user_access_level:int,user_quarity_level:int):
    ss = session()
    s = next(ss)
    s.execute(f"ALTER TABLE `maps` CHANGE `user_access_level` `user_access_level` INT(10) NOT NULL DEFAULT '{user_access_level}'")
    s.execute(f"ALTER TABLE `maps` CHANGE `user_quarity_level` `user_quarity_level` INT(10) NOT NULL DEFAULT '{user_quarity_level}'")
    

# --------------------------------------------
#  set map level
#
def set_map_level(mapid:int,user_access_level:int,user_quarity_level:int):
    ss = session()
    s = next(ss)
    id = ulid.parse(mapid)
    s.query(models.GRRMMap).filter(models.GRRMMap.id == id).update({
        models.GRRMMap.user_access_level: user_access_level,
        models.GRRMMap.user_quarity_level: user_quarity_level
    })
    s.commit()

# --------------------------------------------
#  set map level
#
def show_map_level():
    ss = session()
    s = next(ss)
    for s in s.query(models.GRRMMap):
        print(ulid.from_bytes(s.id),s.atom_name, s.user_access_level, s.user_quarity_level)

# --------------------------------------------
#  parse arguments
#
if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='set map access level')
    subparsers = parser.add_subparsers()

    map_default = subparsers.add_parser('map_default', help='see `map_default -h`')
    map_default.add_argument('user_access_level', help='set default map user access level')
    map_default.add_argument('user_quarity_level', help='set default map user quarity level')
    map_default.set_defaults(handler=lambda args:set_default_map_level(args.user_access_level, args.user_quarity_level))

    map_level = subparsers.add_parser('map',help='see `map -h`')
    map_level.add_argument('mapid', help='set map id')
    map_level.add_argument('user_access_level', help='set map user access level')
    map_level.add_argument('user_quarity_level', help='set map user quarity level')
    map_level.set_defaults(handler=lambda args: set_map_level(args.mapid, args.user_access_level, args.user_quarity_level))

    map_level = subparsers.add_parser('show',help='see `show -h`')
    map_level.set_defaults(handler=lambda args: show_map_level())

    args = parser.parse_args()
    if hasattr(args, 'handler'):
        args.handler(args)
    else:
        parser.print_help()
