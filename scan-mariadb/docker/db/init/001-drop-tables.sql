/*=================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
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
