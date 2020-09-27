// ====================
//  Puerto
// ====================
process.env.PORT = process.env.PORT || 3000

// =====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// Vencimiento del Token
// ====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// =====================
// SEED Autenticacion
// ====================
process.env.SEED = process.env.SEED || "seed-desarrollo";

// ====================
// Base de datos
// ====================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
  urlBD = 'mongodb://localhost:27017/cafe';
}else{
  urlBD = process.env.MONGO_URL_BD;
}

process.env.URLBD = urlBD;

// ====================
// Google cliente id
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '115158203960-0vv3cj1qgv8atmf0o0gc0bike8e30u14.apps.googleusercontent.com';
