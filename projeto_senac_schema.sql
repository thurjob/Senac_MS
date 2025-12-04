PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL, 
    category VARCHAR(100),     -- categoria do provider (ex: Pedreiro, Eletricista)
    location VARCHAR(200),
    hourly_rate NUMERIC(10,2),
    rating NUMERIC(3,2),
    review_count INTEGER DEFAULT 0,
    bio TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id VARCHAR(50) PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    provider_id VARCHAR(50),
    title VARCHAR(250),
    description TEXT,
    status VARCHAR(30) DEFAULT 'OPEN', 
    price NUMERIC(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATETIME,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id)
);

CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    text TEXT,
    timestamp INTEGER
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE INDEX idx_requests_client ON requests(client_id);
CREATE INDEX idx_requests_provider ON requests(provider_id);
CREATE INDEX idx_messages_request ON messages(request_id);
