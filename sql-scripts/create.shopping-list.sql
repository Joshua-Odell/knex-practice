DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery as ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);
DROP TABLE IF EXISTS shopping_list;
CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY NOT NULL,
    name PRIMARY KEY TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL, 
    date_added TIMESTAMP DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT FALSE NOT NULL,
    category grocery NOT NULL
);