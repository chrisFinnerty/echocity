\c postgres

\echo 'Delete and recreate echocity db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE IF EXISTS echocity;
CREATE DATABASE echocity;
\c echocity

\i echocity-schema.sql

\echo 'Delete and recreate echocity_test db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE IF EXISTS echocity_test;
CREATE DATABASE echocity_test;
\c echocity_test

\i echocity-schema.sql