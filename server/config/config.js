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
process.env.CADUCIDAD_TOKEN = 60 * 60* 24 * 30;

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
