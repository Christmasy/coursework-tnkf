import pg from 'pg';

export const dbClient = new pg.Client('postgresql://coursework:coursework@localhost:5433/coursework?sslmode=disable');
