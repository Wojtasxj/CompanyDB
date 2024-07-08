const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departments.controller');

router.get('/departments', departmentsController.getAllDepartments);
router.get('/departments/random', departmentsController.getRandomDepartment);
router.get('/departments/:id', departmentsController.getDepartmentById);
router.post('/departments', departmentsController.createDepartment);
router.put('/departments/:id', departmentsController.updateDepartment);
router.delete('/departments/:id', departmentsController.deleteDepartment);

module.exports = router;