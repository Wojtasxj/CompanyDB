const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/employees', async (req, res) => {
  try {
    const employees = await req.db.collection('employees').find().toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: `Error fetching employees: ${err.message}` });
  }
});


router.get('/employees/random', async (req, res) => {
  try {
    const randomEmployee = await req.db.collection('employees').aggregate([{ $sample: { size: 1 } }]).toArray();
    res.json(randomEmployee[0]);
  } catch (err) {
    res.status(500).json({ message: `Error fetching random employee: ${err.message}` });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await req.db.collection('employees').findOne({ _id: ObjectId(req.params.id) });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error fetching employee: ${err.message}` });
  }
});

router.post('/employees', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }

  try {
    const result = await req.db.collection('employees').insertOne({ firstName, lastName });
    res.status(201).json({ message: 'Employee created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: `Error creating employee: ${err.message}` });
  }
});

router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }

  try {
    const result = await req.db.collection('employees').updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { firstName, lastName } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.json({ message: 'Employee updated' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error updating employee: ${err.message}` });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const result = await req.db.collection('employees').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.json({ message: 'Employee deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error deleting employee: ${err.message}` });
  }
});

module.exports = router;