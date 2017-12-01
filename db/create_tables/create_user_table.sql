CREATE TABLE users (
    user_id SERIAL UNIQUE,
    auth_id INT,
    user_name VARCHAR(280),
    email VARCHAR(280),
    img VARCHAR(280)
)