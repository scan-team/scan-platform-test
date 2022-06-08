/*=================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the sql script that creates and initiates all SCAN-related tables in the 
#              SCAN database, used for initiation setup.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
=================================================================================================*/


---------------------------------------------------------------------------------------------
--- create ----
---------------------------------------------------------------------------------------------

create table IF not exists `maps`
(
  `id`              binary(16) NOT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- map attributes
  `atom_name`       JSON,
  `initxyz`         JSON,
  `fname_top_abs`   VARCHAR(1024),
  `fname_top_rel`   VARCHAR(256),
  `natoms`          INT,
  `lowest_energy`   DOUBLE,
  `highest_energy`  DOUBLE,
  `neq`             INT,
  `nts`             INT,
  `npt`             INT,
  `jobtime`         DATETIME,
  `universal_gamma` DOUBLE,
  `infile`          VARCHAR(256),
  `scpathpara`      VARCHAR(256),
  `jobtype`         VARCHAR(20),
  `pathtype`        VARCHAR(20),
  `nobondrearrange` INT,
  `siml_temperature_kelvin` JSON,
  `siml_pressure_atm` DOUBLE,
  `energyshiftvalue_au` DOUBLE,
  `level`           VARCHAR(256),
  `spinmulti`       INT,
  `totalcharge`     DOUBLE,
  `jobstatus`       VARCHAR(20),
  `jobmessage`      VARCHAR(20),
  `ngradient`       INT,
  `nhessian`        INT,
  `elapsedtime_sec` DOUBLE,
  `registrant`      VARCHAR(256),
  `creator`         VARCHAR(256),

  `accessibility`   INT,


  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


create table IF not exists `eqs`
(
  `id`              binary(16) NOT NULL,
  `map_id`          binary(16),
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- eq attributes
  `nid`             INT,
  `category`        VARCHAR(20),
  `symmetry`        VARCHAR(20),
  `xyz`             JSON,
  `energy`          JSON,
  `gradient`        JSON,
  `s2_value`        DOUBLE,
  `dipole`          JSON,
  `comment`         TEXT,
  `hess_eigenvalue_au`  JSON,
  `trafficvolume`   JSON,
  `population`      JSON,
  `reactionyield`   JSON,


  PRIMARY KEY (`id`),
  CONSTRAINT fk_eqs_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


create table IF not exists `edges`
(
  `id`              binary(16) NOT NULL,
  `map_id`          binary(16),
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- eq attributes
  `edge_id`             INT,
  `category`        VARCHAR(20),
  `symmetry`        VARCHAR(20),
  `xyz`             JSON,
  `energy`          JSON,
  `gradient`        JSON,
  `s2_value`        DOUBLE,
  `dipole`          JSON,
  `comment`         TEXT,
  `hess_eigenvalue_au`  JSON,
  `connection0`         INT,
  `connection1`         INT,
  `pathdata`        JSON,


  PRIMARY KEY (`id`),
  CONSTRAINT fk_edge_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


create table IF not exists `path_nodes`
(
  `id`              binary(16) NOT NULL,
  `map_id`          binary(16),
  `edge_id`         binary(16),
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- eq attributes
  `nid`             INT,
  `category`        VARCHAR(20),
  `symmetry`        VARCHAR(20),
  `xyz`             JSON,
  `energy`          JSON,
  `gradient`        JSON,
  `s2_value`        DOUBLE,
  `dipole`          JSON,
  `comment`         TEXT,
  `hess_eigenvalue_au`  JSON,


  PRIMARY KEY (`id`),
  CONSTRAINT fk_pn_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pn_edge_id
    FOREIGN KEY (edge_id)
    REFERENCES edges (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


create table IF not exists `ttokens`
(
  `id`              INT(20) AUTO_INCREMENT,
  `email`           VARCHAR(40) NOT NULL,
  `token`           VARCHAR(256) NOT NULL,

  PRIMARY KEY (`id`)

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


---------------------------------------------------------------------------------------------
--- for searching ---
---------------------------------------------------------------------------------------------

create table IF not exists `eq_structures`
(
  `id`              binary(16) NOT NULL,
  `eq_id`           binary(16),
  `map_id`          binary(16),

  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  `mol`             TEXT NOT NULL,
  `smiles`          TEXT NOT NULL,

  PRIMARY KEY (`id`),
  CONSTRAINT fk_eq_structures_eq_id
    FOREIGN KEY (eq_id)
    REFERENCES eqs (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_eq_structures_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE FULLTEXT INDEX IF not exists `idx_eq_structures_smiles` ON `eq_structures` (`smiles`);


create table IF not exists `edge_structures`
(
  `id`              binary(16) NOT NULL,
  `edge_id`           binary(16),
  `map_id`          binary(16),

  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  `mol`             TEXT NOT NULL,
  `smiles`          TEXT NOT NULL,

  PRIMARY KEY (`id`),
  CONSTRAINT fk_edge_structures_eq_id
    FOREIGN KEY (edge_id)
    REFERENCES edges (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_edge_structures_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE FULLTEXT INDEX IF not exists  `idx_edge_structures_smiles` ON `edge_structures` (`smiles`);


---------------------------------------------------------------------------------------------
--- for analysis ---
---------------------------------------------------------------------------------------------

create table IF not exists `eq_measures`
(
  `id`              binary(16) NOT NULL,
  `eq_id`           binary(16),
  `map_id`          binary(16),

  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  `energy`          JSON,
  `frequency`       INT NOT NULL DEFAULT 0,
  `betweenness`     DOUBLE NOT NULL DEFAULT 0.0,
  `closeness`     DOUBLE NOT NULL DEFAULT 0.0,
  `pagerank`     DOUBLE NOT NULL DEFAULT 0.0,

  PRIMARY KEY (`id`),
  CONSTRAINT fk_eq_measures_eq_id
    FOREIGN KEY (eq_id)
    REFERENCES eqs (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_eq_measures_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


create table IF not exists `map_graphs`
(
  `id`              binary(16) NOT NULL,
  `map_id`          binary(16),
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  `graph_csv`      MEDIUMTEXT,

  PRIMARY KEY (`id`),
  CONSTRAINT fk_mapgraph_map_id
    FOREIGN KEY (map_id)
    REFERENCES maps (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
