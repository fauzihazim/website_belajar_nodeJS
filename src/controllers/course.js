import mysql from 'mysql2';
import { config } from "dotenv";

config();

export const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

export const getCourses = async (req, res) => {
    const [course] = await pool.query("select * from course");
    res.status(200).json({Status: "success", course});
};

export const getCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    const [course] = await pool.query(`select * from course where courseId = ?`, [id]);
    if (course.length !== 0) {
        res.status(200).json({Status: "success", course});
    } else {
        res.status(404).json({Status: "failed", message: "course is not found"});
    }
};

export const addCourse = async (req, res) => {
    const { courseName, price, tutorId } = req.body;
    if (courseName && price && tutorId) {
        await pool.query(`insert into course (courseName, price, tutorId) values (?, ?, ?)`, [courseName, price, tutorId])
        res.status(201).json({Status: "success", message: `Successfully added courseName: ${courseName}`});
    } else {
        res.status(424).json({Status: "failed", message: "Input courseName, price, and tutorId shouldn't be null"});
    }
};

export const editCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    const { courseName, price, tutorId } = req.body;
    if (courseName && price && tutorId) {
        await pool.query(`UPDATE course
        SET courseName = ?, price = ?, tutorId = ?
        WHERE courseId = ?`, [courseName, price, tutorId, id]);
        res.status(201).json({Status: "success", message: `Successfully edit courseName: ${courseName}`});
    } else {
        res.status(422).json({Status: "failed", message: "Failed to input"});
    }
};

export const deleteCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM course WHERE courseId = ?', [id]);
    res.status(201).json({Status: "success", message: "Succesfully delete the course"});
}