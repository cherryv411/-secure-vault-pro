import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, mobile, username, password, mfaMethod } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, email, mobile, username, password: hashedPassword, mfaMethod }
    });
    res.status(201).json({ message: "User registered" });
  } catch (e) {
    res.status(400).json({ error: "Registration failed" });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
