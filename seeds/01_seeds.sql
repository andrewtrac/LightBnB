INSERT INTO users (name, email, password)
VALUES ('John Harson', 'email1234@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jane Caros', 'dfhasdfa@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Anne Tran', 'afa@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sheena Wayson', 'fsdfa@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, parking_spaces, number_of_bathrooms, number_of_bedrooms, 
country, street, city, province, post_code, active)
VALUES (1, 'big house with pool', 'description', 'http//:www.google.com/image/123', 
'http//:www.google.com/image/13423', 2, 4, 4, 'Canada', '31 Big Street', 'Toronto', 'Ontario', 'M9L 3V9', true),
(2, 'small house with pool', 'description', 'http//:www.google.com/image/123', 
'http//:www.google.com/image/13423', 1, 3, 3, 'Canada', '31 Slow Street', 'Toronto', 'Ontario', 'M7L 3V9', true),
(3, 'big mansion with pool', 'description', 'http//:www.google.com/image/123', 
'http//:www.google.com/image/13423', 1, 4, 2, 'Canada', '31 Tired Street', 'Toronto', 'Ontario', 'M8L 3V9', true),
(4, 'big condo without pool', 'description', 'http//:www.google.com/image/12323', 
'http//:www.google.com/image/143213423', 1, 4, 4, 'Canada', '32 Small Street', 'Mississauga', 'Ontario', 'M1L 3VN', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-04-11', '2020-04-15', 1, 2),
('2010-04-11', '2010-04-15', 2, 3),
('2014-04-13', '2014-04-15', 3, 4),
('2015-01-11', '2015-01-15', 4, 1);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 2, 'description'),
(2, 3, 2, 3, 'description'),
(3, 4, 3, 4, 'description'),
(4, 1, 4, 1, 'description');

