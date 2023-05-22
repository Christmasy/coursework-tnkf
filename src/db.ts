import pg from 'pg';

export const db = new pg.Client('postgresql://coursework:coursework@localhost:5433/coursework?sslmode=disable');
