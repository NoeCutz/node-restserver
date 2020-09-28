const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const extensionesPermitidas = ['png','jpg','gif','jpeg']
const tiposValidos = ['productos', 'usuarios']


// default options
app.use(fileUpload());
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

app.put('/upload/:tipo/:id', function(req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id

  if (!req.files) {
     return res.status(400).json({
       ok : false,
       err : {
         message : 'No se ha seleccionado ningun archivo'
          }
        });
  }

  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok : false,
      err : {message : 'Los tipos validos son: ' + tiposValidos.join()}
    })
  }

  let archivo = req.files.archivo;
  const nombreSplit = archivo.name.split('.')
  const extension = nombreSplit[nombreSplit.length-1]
  if(extensionesPermitidas.indexOf(extension) < 0){
    return res.status(400).json({
      ok : false,
      err : {message : 'La extensiones validas son: ' + extensionesPermitidas.join()}
    })
  }
  const nuevoNombreArchivo = `${id}-${new Date().getTime()}.${extension}`
  archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, (err) => {
   if (err)
     return res.status(500).json({
       ok: false,
       err
     });
     if(tipo=== 'usuarios'){
        actualizarImagenUsuario(id, res, nuevoNombreArchivo)
     }else{
       actualizarImagenProducto(id, res, nuevoNombreArchivo)
     }

   //res.json({ok: true , message : 'Archivo subido exitosamente'});
 });
});

function actualizarImagenUsuario(id, res, nombreArchivo){
  Usuario.findById(id, (err,usuarioBD) => {
      if(err){
        borrarArchivo(nombreArchivo,'usuarios')
        return res.status(500).json({
          ok : false,
          err
        });
      }

      if(!usuarioBD){
        borrarArchivo(nombreArchivo,'usuarios')
        return res.status(400).json({
          ok : false,
          err : {message : 'Usuario no existe'}
        });
      }

      borrarArchivo(usuarioBD.img,'usuarios')
      usuarioBD.img = nombreArchivo

      usuarioBD.save((err, usuarioGuardado) => {
        res.json({
          ok : true,
          usuario : usuarioGuardado,
          img : nombreArchivo
        });
      })
  });
}

function actualizarImagenProducto(id, res, nombreArchivo){
  Producto.findById(id, (err,productoBD) => {
      if(err){
        borrarArchivo(nombreArchivo,'productos')
        return res.status(500).json({
          ok : false,
          err
        });
      }

      if(!productoBD){
        borrarArchivo(nombreArchivo,'productos')
        return res.status(400).json({
          ok : false,
          err : {message : 'Producto no existe'}
        });
      }

      borrarArchivo(productoBD.img,'productos')
      productoBD.img = nombreArchivo

      productoBD.save((err, productoGuardado) => {
        res.json({
          ok : true,
          producto : productoGuardado,
          img : nombreArchivo
        });
      })
  });
}

function borrarArchivo(nombreImagen, tipo){
  let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
  if(fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen)
  }
}

module.exports = app
