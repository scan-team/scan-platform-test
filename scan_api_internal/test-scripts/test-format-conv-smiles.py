import openbabel as ob
from openbabel import pybel
from fastapi_pagination.paginator import paginate as paginate_list

import os

root_path = os.path.dirname(__file__)
file_path = os.path.join(os.path.dirname(__file__), "./testdata/eq0.xyz")

print("---input---")
print(pybel.informats)
print("---output---")
print(pybel.outformats)

m = [
    x
    for x in pybel.readfile(
        "xyz",
        file_path,
    )
]
# print(m)
print(len(m))

outfile_path = os.path.join(os.path.dirname(__file__), "./testdata/out.mol")
# m[0].write("mol", outfile_path)
result = m[0].write("xyz")
print(result)

s = m[0].write("can")
print(s.split(" "))
print(s.split("\t"))
print("out:", s.split("\t")[0])


s = m[0].write("smiles")
print(s)