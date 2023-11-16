const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');


const seasonRoutes = require('./modules/Routes/seasonRoutes');
const tarifRoutes = require('./modules/Routes/tarifRoutes');
const fasilitasTambahanRoutes = require('./modules/Routes/fasilitasTambahanRoutes');
const kamarRoutes = require('./modules/Routes/kamarRoutes');
const authRoutes = require('./modules/Routes/authRoutes');
const customerRoutes = require('./modules/Routes/customerRoutes');
const perhitunganRoutes = require('./modules/Routes/perhitunganRoutes');
const reservasiRoutes = require('./modules/Routes/reservasiRoutes');
const transaksiFasilitas = require ('./modules/Routes/transaksiFasilitasRoutes');
const transaksiKamarRoutes = require ('./modules/Routes/transaksiKamarRoutes');
const pegawaiRoutes = require ('./modules/Routes/pegawaiRoutes');
const app = express();

// dotenv.config();
// require("./modules/Database/db");

// Enable CORS
app.use(cors());

// Parse JSON bodies for this app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes

app.use('/seasons', seasonRoutes);
app.use('/tarifs', tarifRoutes);
app.use('/fasilitasTambahans', fasilitasTambahanRoutes);
app.use('/kamars', kamarRoutes);
app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/perhitungans', perhitunganRoutes);
app.use('/reservasis', reservasiRoutes);
app.use('/transaksiFasilitas', transaksiFasilitas);
app.use('/transaksiKamars', transaksiKamarRoutes);
app.use('/pegawais', pegawaiRoutes);

// Start the server
app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!!!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})
