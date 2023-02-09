CREATE TABLE journal_entry (
    journal_entry_id SERIAL PRIMARY KEY, 
    full_name CHAR(100),
    title CHAR(100),
    journal_entry VARCHAR(1000)
);