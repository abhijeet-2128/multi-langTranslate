import express from 'express';
import connectDB from './db/connection';
import routes from './routes/routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
