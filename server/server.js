import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import ConnectDb from "./configs/Db.js"
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 5000


app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

ConnectDb()

app.get('/', (req,res) => 
    res.send("hello backend")
)

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});



app.listen(PORT ,() => {
    console.log(`server running on http://localhost:${PORT}/`);  
})


