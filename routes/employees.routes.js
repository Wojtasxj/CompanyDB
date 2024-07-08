const express = require('express');
const router = express.Router();

const Employee = require('../models/employees.model');

router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching employees: ${err.message}` });
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const employee = await Employee.findOne().skip(rand);
    res.status(200).json(employee || { message: 'No employees found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching random employee: ${err.message}` });
  }
});

router.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findById(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching employee: ${err.message}` });
  }
});

router.post('/employees', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }

  try {
    const newEmployee = new Employee({ firstName, lastName });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created', id: newEmployee._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating employee: ${err.message}` });
  }
});

router.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findById(id);
    if (employee) {
      employee.firstName = firstName;
      employee.lastName = lastName;
      await employee.save();
      res.status(200).json({ message: 'Employee updated' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error updating employee: ${err.message}` });
  }
});

router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (employee) {
      res.status(200).json({ message: 'Employee deleted' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error deleting employee: ${err.message}` });
  }
});

module.exports = router;
