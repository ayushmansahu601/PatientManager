const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// SQLite with Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'patients.db'
});

// Patient model
const Patient = sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    disease: { type: DataTypes.STRING, allowNull: false }
});
const glaucomaFamilymembers = sequelize.define('glaucomaFamilymembers', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientName: { type: DataTypes.STRING, allowNull: false },
  memberName: { type: DataTypes.STRING, allowNull: false },
  memberPhone: { type: DataTypes.STRING, allowNull: false },
});


// Routes
app.get('/patients', async (req, res) => {
    const patients = await Patient.findAll({ order: [['id', 'DESC']] });
    res.json(patients);
});

app.post('/patients', async (req, res) => {
    const { name, phone, date, disease } = req.body;
    const newPatient = await Patient.create({ name, phone, date, disease });
    res.json(newPatient);
});

app.put('/patients/:id', async (req, res) => {
    const { name, phone, date, disease } = req.body;
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).send('Patient not found');
    await patient.update({ name, phone, date, disease });
    res.json(patient);
});

app.delete('/patients/:id', async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).send('Patient not found');
    await patient.destroy();
    res.json({ success: true });
});
app.post('/family', async (req, res) => {
  const { patientName, family } = req.body;

  for (const member of family) {
    await glaucomaFamilymembers.create({
      patientName,
      memberName: member.name,
      memberPhone: member.phone,
    });

    // Send Twilio SMS here
    const message = `High Risk Alert: ${patientName} has been diagnosed with glaucoma. As a direct family member, you might be at risk too. Please consider a checkup.`;
    await sendTwilioMessage(member.phone, message);
  }

  res.json({ success: true });
});

// Sync DB and start server
sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
});
