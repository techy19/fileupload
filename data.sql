CREATE DATABASE excercises;
\c excercises
CREATE TABLE dictionary (
    word varchar(50) UNIQUE NOT NULL PRIMARY KEY
);