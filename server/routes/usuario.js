const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken,function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({estado : true},'nombre email role estado google img')
          .skip(desde)
          .limit(limite)
          .exec((err,usuarios) => {
            if (err){
              return res.status(400).json({
                ok : false,
                err
              });
            }

            Usuario.count({estado : true}, (err, conteo) => {
              res.json({
                ok : true,
                usuarios,
                cantidad : conteo
              });
            });
          });
});

app.post('/usuario',[verificaToken,verificaAdminRole], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
      nombre : body.nombre,
      email : body.email,
      password : bcrypt.hashSync(body.password,10),
      role : body.role
  });

  usuario.save((err, usuarioBD) => {
    if (err){
      return res.status(400).json({
        ok : false,
        err
      });
    }

    res.json({
      ok : true,
      usuario : usuarioBD
    });

  });

});

app.put('/usuario/:id', [verificaToken,verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body,['nombre','email','img','role','estado']);

  Usuario.findByIdAndUpdate(id, body,{new : true, runValidators : true} ,(err, usuarioBD) => {

    if (err) {
      return res.status(400).json({
          ok : false,
          err
      });
    }

    res.json({
      ok : true,
      usuario : usuarioBD
    })

  });


});

app.delete('/usuario/:id',[verificaToken,verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let cambiaEstado = {
    'estado' : false
  }
  //Usuario.findByIdAndRemove(id,(err, usuarioBorrado) => {
  Usuario.findByIdAndUpdate(id,cambiaEstado,{new : true},(err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
          ok : false,
          err
      });
    }
    if(!usuarioBorrado){
      return res.status(400).json({
          ok : false,
          err : {
            message : 'Usuario no encontrado'
          }
      });
    }

    res.json({
      ok : true,
      usuario : usuarioBorrado
    });

  });
});

module.exports = app;
