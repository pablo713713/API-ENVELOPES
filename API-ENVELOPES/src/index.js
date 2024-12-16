import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { envelopesRouter } from './routes/envelopes.routes.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/envelopes', envelopesRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
