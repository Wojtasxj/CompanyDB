const Employee = require('../models/employees.model');
const mongoose = require('mongoose');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name');
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching employees: ${err.message}` });
  }
};

exports.getRandomEmployee = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    const rand = Math.floor(Math.random() * count);
    const employee = await Employee.findOne().populate('department', 'name').skip(rand);
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching random employee: ${err.message}` });
  }
};

exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findById(id).populate('department', 'name');
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching employee: ${err.message}` });
  }
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  if (!firstName || !lastName || !department) {
    return res.status(400).json({ message: 'First name, last name, and department are required' });
  }

  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created', id: newEmployee._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating employee: ${err.message}` });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, department } = req.body;
  if (!firstName || !lastName || !department) {
    return res.status(400).json({ message: 'First name, last name, and department are required' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findById(id);
    if (employee) {
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.department = department;
      await employee.save();
      res.status(200).json({ message: 'Employee updated' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error updating employee: ${err.message}` });
  }
};

exports.deleteEmployee = async (req, res) => {
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
};
