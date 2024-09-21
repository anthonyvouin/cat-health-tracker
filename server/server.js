const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'petData.json');

async function initializeDataFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({ pets: [] }));
  }
}

app.get('/api/pets', async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  res.json(data.pets);
});

app.post('/api/pets', async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
    const newPet = {
      id: Date.now().toString(),
      ...req.body,
      imageUrl: req.body.imageUrl || null
    };
    data.pets.push(newPet);
    await fs.writeFile(dataFile, JSON.stringify(data));
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new pet' });
  }
});

app.get('/api/pets/:petId', async (req, res) => {
  const { petId } = req.params;
  const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  const pet = data.pets.find(p => p.id === petId);
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ error: 'Pet not found' });
  }
});

app.post('/api/pets/:petId', async (req, res) => {
  const { petId } = req.params;
  const petData = req.body;
  const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  const petIndex = data.pets.findIndex(p => p.id === petId);
  if (petIndex !== -1) {
    data.pets[petIndex] = { ...data.pets[petIndex], ...petData };
    await fs.writeFile(dataFile, JSON.stringify(data));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Pet not found' });
  }
});

app.get('/api/pets/:petId/weight-history', async (req, res) => {
  const { petId } = req.params;
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
    const pet = data.pets.find(p => String(p.id) === String(petId));
    if (pet) {
      res.json(pet.weightHistory || []);
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/pets/:petId/weight-history', async (req, res) => {
  const { petId } = req.params;
  const { date, weight } = req.body;
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
    const petIndex = data.pets.findIndex(p => String(p.id) === String(petId));
    if (petIndex !== -1) {
      if (!data.pets[petIndex].weightHistory) {
        data.pets[petIndex].weightHistory = [];
      }
      data.pets[petIndex].weightHistory.push({ date, weight });
      await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/pets/:petId', async (req, res) => {
  const { petId } = req.params;
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
    const petIndex = data.pets.findIndex(p => p.id === petId);
    if (petIndex !== -1) {
      const deletedPet = data.pets.splice(petIndex, 1)[0];
      if (deletedPet.imageUrl) {
        const imagePath = path.join(__dirname, deletedPet.imageUrl);
        await fs.unlink(imagePath).catch(() => {});
      }
      await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
      res.json({ success: true, message: 'Pet deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

initializeDataFile().then(() => {
  app.listen(port, () => {});
});