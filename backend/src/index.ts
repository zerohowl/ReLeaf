import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ---------- Register ----------
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).send('Missing fields');

  try {
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash: hash } });
    return res.status(201).send({ id: user.id });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).send('User already exists');
    console.error(err);
    return res.status(500).send('Server error');
  }
});

// ---------- Login ----------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).send('Missing fields');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return res.send({ token });
});

// ---------- Auth middleware ----------
function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  const token = header?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).send('Invalid token');
  }
}

app.get('/api/profile', auth, async (req, res) => {
  const userId = (req as any).userId as number;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } });
  return res.send(user);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
