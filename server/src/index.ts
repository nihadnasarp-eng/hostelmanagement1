import express, { Request, Response } from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hostel Management System API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
