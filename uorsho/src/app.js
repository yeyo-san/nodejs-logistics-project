import express  from 'express';
import errorHandler from './middlewares/errorHandler.js'; 
import routerWarehouse from './routes/warehouses.js';
import routerShipments from './routes/shipments.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(errorHandler)

app.use('/warehouses', routerWarehouse);
app.use('/shipments', routerShipments);

app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}/`);
})