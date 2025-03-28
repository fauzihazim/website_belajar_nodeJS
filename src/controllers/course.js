import { pool } from '../config/db.js';
import { validationResult } from 'express-validator';
import Fuse from 'fuse.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const getCourses = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            message: error.array()[0].msg 
        });
    }
    const inputs = req.query;
    const { search, price, name, sort } = inputs;
    console.log("The Sort is ", sort);
    
    try {
        let [course] = await pool.query("select * from course");
        if (search) {
            course = courseSearch(search, course);          // Search
        };
        if (price || name) {
            course = courseFilter(price, name, course);     // Filter
        };
        if (sort) {
            course = courseSort(sort, course);              // Sorting
        };
        course.length !== 0
        ? res.status(200).json({
            status: "success",
            data: course
        })
        : res.status(404).json({
            status: "failed",
            message: "course is not found"
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};


const courseSearch = (search, courses) => {
    console.log("Search key is: ", search);
    const fuseOptions = {
        keys: [
            "courseName"
        ]
    };
    const fuse = new Fuse(courses, fuseOptions);
    courses = fuse.search(search);
    return courses.map(x => x.item);
}

const courseFilter = (price, name, courses) => {
    let filters = {};
    price ? filters.price = price : null;
    name ? filters.courseName = name : null;
    courses = courses.filter(user => {
        let isValid = true;
        for (let key in filters) {
            isValid = isValid && user[key] == filters[key];
        }
        return isValid;
    });
    return courses;
}

const courseSort = (sort, courses) => {
    const sortArray = sort.split(" ");
    const sortBy = {};
    for (let i = 0; i < sortArray.length; i += 2) {
        sortBy[sortArray[i]] = sortArray[i + 1];
    }
    Array.prototype.keySort = function(keys) {
        keys = keys || {};
        var obLen = function(obj) {
            var size = 0, key;
            for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
            }
            return size;
        };
        var obIx = function(obj, ix) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (size === ix) return key;
                    size++;
                }
            }
            return false;
        };
        var keySort = function(a, b, d) {
            d = d !== null ? d : 1;
            if (a === b) return 0;
            return a > b ? 1 * d : -1 * d;
        };
        
        var KL = obLen(keys);
        
        if (!KL) return this.sort(keySort);
        
        for ( var k in keys) {
            // asc unless desc or skip
            keys[k] = keys[k] === 'desc' || keys[k] === -1  ? -1 : (keys[k] === 'skip' || keys[k] === 0 ? 0 : 1);
        }
        
        this.sort(function(a, b) {
            var sorted = 0, ix = 0;
            while (sorted === 0 && ix < KL) {
                var k = obIx(keys, ix);
                if (k) {
                    var dir = keys[k];
                    sorted = keySort(a[k], b[k], dir);
                    ix++;
                }
            }
            return sorted;
        });
        return this;
    };
    const print = (obj, delp, delo, ind) => {
        delp = delp!=null ? delp : "\t"; // property delimeter
        delo = delo!=null ? delo : "\n"; // object delimeter
        ind = ind!=null ? ind : " "; // indent; ind+ind geometric addition not great for deep objects
        var str='';
    
        for(var prop in obj){
            if(typeof obj[prop] === 'string' || typeof obj[prop] === 'number')  {
                var q = typeof obj[prop] === 'string' ? "" : ""; // make this "'" to quote strings
                str += ind + prop + ': ' + q + obj[prop] + q + '; ' + delp;
            } else  {
                str += ind + prop + ': {'+ delp + print(obj[prop],delp,delo,ind+ind) + ind + '}' + delo;
            }
        }
        return str;
    };
    return courses.keySort(sortBy);
}

export const getCourse = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            message: error.array()[0].msg 
        });
    };
    const id = parseInt(req.params.id);
    try {
        const [course] = await pool.query(`select * from course where courseId = ?`, [id]);
        if (course.length !== 0) {
            res.status(200).json({
                status: "success",
                data: course
            });
        } else {
            res.status(404).json({
                status: "failed",
                message: "course is not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};

const __filename = "src/uploads";
console.log("Filename ", __filename);
const __dirname = path.dirname(__filename);

export const addCourse = async (req, res) => {
    const error = validationResult(req);
    const image = req.files;

    const __filename = "src/uploads";
    console.log("Filename ", __filename);
    const __dirname = path.dirname(__filename);
    
    if (!error.isEmpty()) {
        if (image && image.length > 0) {
            const filePath = path.join(__dirname, 'uploads', req.files[0].filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete uploaded file:", err);
                } else {
                    console.log("Delete Success");
                }
            });
        }
        return res.status(400).json({
            status: "failed",
            message: error.array()[0].msg 
        });
    };
    const { courseName, price, tutorId } = req.body;
    
    console.log("IMG");
    
    console.log("The Image ", image);
    
    console.log("Course name ", courseName, " Price ", price, " tutor Id ", tutorId, " req file ", req.files);
    
    try {
        if (courseName && price && tutorId && req.files.length === 1) {
            await pool.query(`insert into course (courseName, price, tutorId, imageLink) values (?, ?, ?, ?)`, [courseName, price, tutorId, req.files[0].path])
            res.status(201).json({
                status: "success",
                message: `Successfully added courseName: ${courseName}`
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: "Input courseName, price, and tutorId shouldn't be null"
            });
        }
    } catch (error) {
        // Delete image if failed to add in DB
        const filePath = path.join(__dirname, 'uploads', req.files[0].filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delete uploaded file:", err);
            } else {
                console.log("Delete Success");
            }
        });
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "failed",
                message: "Course already exists"
            });
        };
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};

export const editCourse = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            message: error.array()[0].msg 
        });
    };
    const id = parseInt(req.params.id);
    const { courseName, price, tutorId } = req.body;
    try {
        if (courseName && price && tutorId) {
            const [result] = await pool.query(`UPDATE course
            SET courseName = ?, price = ?, tutorId = ?
            WHERE courseId = ?`, [courseName, price, tutorId, id]);
            result.affectedRows
            ? res.status(201).json({
                status: "success",
                message: `Successfully edit courseName: ${courseName}`
            })
            : res.status(404).json({
                status: "failed",
                message: "Resource to update doesn't exists"
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: "Input courseName, price, and tutorId shouldn't be null"
            });
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "failed",
                message: "Course already exists"
            });
        }
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};

export const deleteCourse = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            message: error.array()[0].msg 
        });
    };
    const id = parseInt(req.params.id);
    try {
        const [result] = await pool.query('DELETE FROM course WHERE courseId = ?', [id]);
        result.affectedRows
        ? res.status(201).json({
            status: "success",
            message: "Succesfully delete the course"
        })
        : res.status(404).json({
            status: "failed",
            message: "course is not found"
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};

export const cobaMulter = (req, res) => {
    console.log("Req File", req.file.destination, "Req Body", req.body)
    res.send("Upload successfully");
}