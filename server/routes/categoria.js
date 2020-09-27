const express = require('express');
const _ = require('underscore');
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// lista todas las categorias
app.get('/categoria',verificaToken,(req, res) => {
  Categoria.find()
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec((err, categorias) => {
    if (err){
      return res.status(400).json({
        ok : false,
        err
      });
    }

    Categoria.count((err, conteo) => {
      res.json({
        ok : true,
        categorias,
        cantidad : conteo
      });
    });
  });
});

//lista  categoria por id
app.get('/categoria/:id',verificaToken,(req, res) => {
  let id = req.params.id;
  Categoria.findById(id,(err, categoriaBD) => {
    if (err){
      return res.status(400).json({
        ok : false,
        err
      });
    }

    res.json({
      ok : true,
      categoria : categoriaBD
    });
  });

});

//crear nueva categoria
app.post('/categoria',verificaToken,(req, res)=> {
  let body = req.body;

  let categoria = new Categoria({
      descripcion : body.descripcion,
      usuario : req.usuario._id
  });

  categoria.save((err,categoriaBD) => {
    if (err){
      return res.status(500).json({
        ok : false,
        err
      });
    }

    if (!categoriaBD){
      return res.status(400).json({
        ok : false,
        err
      });
    }

    res.json({
      ok : true,
      categoria : categoriaBD
    });
  });
});

// Actualizar la categoria
app.put('/categoria/:id',verificaToken,(req, res) => {
  let id = req.params.id;
  let body = req.body;

  let desCategoria = {
    descripcion : body.descripcion
  }

  Categoria.findByIdAndUpdate(id,desCategoria,{new : true, runValidators : true},(err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
          ok : false,
          err
      });
    }

    if (!categoriaBD){
      return res.status(400).json({
        ok : false,
        err
      });
    }

    res.json({
      ok : true,
      categoria : categoriaBD
    })
  });
});

//Eliminar la categoria
app.delete('/categoria/:id',[ verificaToken, verificaAdminRole],(req, res)=> {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err, categoriaBorrada) => {
      if (err) {
        return res.status(400).json({
            ok : false,
            err
        });
      }
      res.json({
        ok : true,
        categoria : categoriaBorrada
      });
    });

});

module.exports = app;
