# # =================================================================================================
# # Project: SCAN - Searching Chemical Actions and Networks
# #          Hokkaido University (2021)
# # ________________________________________________________________________________________________
# # Authors: Jun Fujima (Former Lead Developer) [2021]
# #          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# # ________________________________________________________________________________________________
# # Description: This is                for the 
# #              scan-api-internal parts of the Scan Platform Project 
# # ------------------------------------------------------------------------------------------------
# # Notes: 
# # ------------------------------------------------------------------------------------------------
# # References: os, 3rd party FastApi and openbabel
# # =================================================================================================

# # TODO: Is this File acually used and/or needed??

# # -------------------------------------------------------------------------------------------------
# # Load required libraries
# # -------------------------------------------------------------------------------------------------
# import openbabel as ob 
# from openbabel import pybel
# from fastapi_pagination.paginator import paginate as paginate_list
# import os

# # -------------------------------------------------------------------------------------------------


# # -------------------------------------------------------------------------------------------------
# # Global constants and variables
# # -------------------------------------------------------------------------------------------------
# root_path = os.path.dirname(__file__)
# file_path = os.path.join(os.path.dirname(__file__), "./testdata/eq0.xyz")

# print("---input---")
# print(pybel.informats)
# print("---output---")
# print(pybel.outformats)

# m = [
#     x
#     for x in pybel.readfile(
#         "xyz",
#         file_path,
#     )
# ]

# print(len(m))

# outfile_path = os.path.join(os.path.dirname(__file__), "./testdata/out.mol")

# result = m[0].write("xyz")
# print(result)

# s = m[0].write("can")
# print(s.split(" "))
# print(s.split("\t"))
# print("out:", s.split("\t")[0])


# s = m[0].write("smiles")
# print(s)