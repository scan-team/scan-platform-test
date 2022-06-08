/*=================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the sql script that drops all SCAN-related tables in the SCAN database, 
#              used for initiation setup.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
=================================================================================================*/


---------------------------------------------------------------------------------------------
---- drop ----
---------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS `path_nodes`;
DROP TABLE IF EXISTS `eq_structures`;
DROP TABLE IF EXISTS `edge_structures`;
DROP TABLE IF EXISTS `eq_measures`;
DROP TABLE IF EXISTS `map_graphs`;
DROP TABLE IF EXISTS `edges`;
DROP TABLE IF EXISTS `eqs`;
DROP TABLE IF EXISTS `maps`;
DROP TABLE IF EXISTS `ttokens`;
