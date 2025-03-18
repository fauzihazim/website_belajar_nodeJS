import { param, query, body } from 'express-validator';

export const validateGetCourses = [
    query('search')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('Invalid Search'),
    query('price')
        .optional()
        .isInt()
        .trim()
        .escape()
        .withMessage('Invalid Price'),
    query('name')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('Invalid Name'),
    query('sort')
        .optional()
        .isIn([
            'courseId desc',
            'courseId asc',
            'courseName desc',
            'courseName asc',
            'price desc',
            'price asc'
        ])
        .trim()
        .escape()
        .withMessage('Invalid Sort')
];

export const validateGetCourse = [
    param('id')
        .trim()
        .notEmpty().withMessage('Id is required')
        .isInt().withMessage('Invalid Id')
        .escape()
]

export const validatePostCourse = [
    body('courseName')
        .notEmpty().withMessage('courseName is required')
        .isString().withMessage('Invalid courseName')
        .escape()
        .trim(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isInt({ min: 0 }).withMessage("Price has to be minimal 0")
        .escape()
        .trim(),
    body('tutorId')
        .notEmpty().withMessage("tutorId is required")
        .isInt({ gt: 0 }).withMessage("tutorId has to be greater than 0")
        .escape()
        .trim()
]

export const validateEditCourse = [
    
]