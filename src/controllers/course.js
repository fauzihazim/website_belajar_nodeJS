import { pool } from '../config/db.js';
import Fuse from 'fuse.js';

export const getCourses = async (req, res) => {
    let [course] = await pool.query("select * from course");
    const inputs = req.query;
    const { search, price, name, sort } = inputs;
    if (search) {
        course = courseSearch(search, course);          // Search
    };
    if (price || name) {
        course = courseFilter(price, name, course);     // Filter
    };
    if (sort) {
        course = courseSort(sort, course);              // Sorting
    };
    course.length !== 0 ? res.status(200).json({Status: "success", course: course}) : res.status(404).json({Status: "failed", message: "course is not found"});
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
    try {
        if (courseName && price && tutorId) {
            await pool.query(`insert into course (courseName, price, tutorId) values (?, ?, ?)`, [courseName, price, tutorId])
            return res.status(201).json({Status: "success", message: `Successfully added courseName: ${courseName}`});
        } else {
            return res.status(424).json({Status: "failed", message: "Input courseName, price, and tutorId shouldn't be null"});
        }
    } catch (error) {
        return res.status(500).json({Status: "failed", message: error.message})
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

export const editCourses = async (req, res) => {
    const id = parseInt(req.params.id);
    // const { courseName, price, tutorId } = {"courseNameEdited", 0, 1};
    const courseName = "courseNameEdited1";
    const price = 0;
    const tutorId = 90;
    try {
        await pool.query(`UPDATE course
        SET courseName = ?, price = ?, tutorId = ?
        WHERE courseId = ?`, [courseName, price, tutorId, id]);
        res.status(201).json({Status: "success", message: `Successfully edit courseName: ${courseName}`});
    } catch (error) {
        res.status(422).json({Status: "failed", message: error.message});
    }
    // if (courseName && price && tutorId) {
    //     await pool.query(`UPDATE course
    //     SET courseName = ?, price = ?, tutorId = ?
    //     WHERE courseId = ?`, [courseName, price, tutorId, id]);
    //     res.status(201).json({Status: "success", message: `Successfully edit courseName: ${courseName}`});
    // } else {
    //     res.status(422).json({Status: "failed", message: "Failed to input"});
    // }
};

export const deleteCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM course WHERE courseId = ?', [id]);
    res.status(201).json({Status: "success", message: "Succesfully delete the course"});
}