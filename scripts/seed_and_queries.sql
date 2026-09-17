INSERT INTO teams(name)
VALUES("Finance"), ("Operations"), ("Engineering");

INSERT INTO users(first_name, last_name, email, team_id)
VALUES
("Samy", "Oullaf", "samy.oullaf@paconsulting.com", 3),
("Benedek", "Toth", "benedek.toth@paconsulting.com", 3),
("Felita", "Benoy", "felita.benoy@paconsulting.com", 3),
("Aaron", "Furnell", "aaron.furnell@paconsulting.com", 3),
("Charlie", "Smith", "charlie.smith@paconsulting.com", 2),
("Aidan", "Rose", "aidan.rose@paconsulting.com", 1),
("Reece", "James", "reece.james@paconsulting.com", 2),
("Tilly", "Cohen", "tilly.cohen@paconsulting.com", 1);

INSERT INTO rooms(name, floor, capacity)
VALUES("London 1", 6, 12), ("London 2", 2, 20), ("London 3", 3, 10);

INSERT INTO desks(name, floor)
VALUES("North", 6), ("South", 2), ("East", 3), ("West", 3);

INSERT INTO bookings(user_id, desk_id, booking_date) VALUES
(1, 1, "2026-09-18"),
(3, 2, "2026-09-18"),
(2, 1, "2026-09-19"),
(4, 3, "2026-09-19"),
(5, 4, "2026-09-19"),
(6, 1, "2026-09-20"),
(2, 3, "2026-09-20"),
(7, 2, "2026-09-20");

SELECT
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    t.name AS department,
    COUNT(b.id) AS desks_booked
FROM users u
LEFT JOIN teams t
    ON u.team_id = t.id
LEFT JOIN bookings b
    ON b.user_id = u.id
GROUP BY
    u.id,
    u.first_name,
    u.last_name,
    t.name;

UPDATE users
SET team_id = 1
WHERE id = 1;

DELETE FROM desks WHERE desks.id = 1;