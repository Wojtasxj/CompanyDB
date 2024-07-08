const Department = require('../models/department.model');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandomDepartment = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(dep);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(dep);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'OK', department: newDepartment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const { name } = req.body;

  try {
    const updatedDep = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedDep) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK', department: updatedDep });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const deletedDep = await Department.findByIdAndRemove(req.params.id);
    if (!deletedDep) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK', department: deletedDep });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};