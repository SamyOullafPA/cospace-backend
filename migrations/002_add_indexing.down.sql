ALTER TABLE bookings
DROP FOREIGN KEY bookings_ibfk_2;

DROP INDEX DUPLICATE_DESK_INDEX ON bookings;

ALTER TABLE bookings
ADD CONSTRAINT bookings_ibfk_2
FOREIGN KEY (desk_id)
REFERENCES desks(id);