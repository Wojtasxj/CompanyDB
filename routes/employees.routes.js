const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees.controller');

router.get('/employees', employeesController.getAllEmployees);
router.get('/employees/random', employeesController.getRandomEmployee);
router.get('/employees/:id', employeesController.getEmployeeById);
router.post('/employees', employeesController.createEmployee);
router.put('/employees/:id', employeesController.updateEmployee);
router.delete('/employees/:id', employeesController.deleteEmployee);

module.exports = router;