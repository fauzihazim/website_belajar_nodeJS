create database videoBelajar;

use videoBelajar;

create table course (
	courseId int not null,
	courseName varchar(255) not null,
	price int not null,
	tutorId int not null,
	unique (courseName),
	primary key (courseId)
);

ALTER TABLE course
modify courseId INT auto_increment;

INSERT INTO course (courseName, price, tutorId)
VALUES ('course 1', 10000, 1), ('course 2', 20000, 2);

INSERT INTO course (courseName, price, tutorId)
VALUES ('course 2', 20000, 2);

-- Select all course
select * from course;
-- Select course by id
select * from course where courseId = 2;
-- edit data course
UPDATE course SET courseName = 'course 2 edit', price = 200000
WHERE courseId = 2;
-- delete data
DELETE FROM course WHERE courseId = 2;
