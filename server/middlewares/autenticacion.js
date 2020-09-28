const jwt = require('jsonwebtoken');

let verificaToken = (req, res,next) => {
  let token = req.get('Authorization');

  jwt.verify(token,process.env.SEED, (err,decoded) => {
    if(err){
      return res.status(401).json({
        ok : false,
        err
      });
    }

    req.usuario = decoded.usuario;
    next();
  });

};

let verificaAdminRole = (req, res, next) => {
  let usuario = req.usuario;

  if(usuario.role == 'ADMIN_ROLE'){
    next();
  }else{
    return res.status(401).json({
      ok : false,
      err : "El usuario no es administrador"
    });
  }

}

let verificaTokenImg = (req, res, next) => {
  const token  = req.query.token;
  jwt.verify(token,process.env.SEED, (err,decoded) => {
    if(err){
      return res.status(401).json({
        ok : false,
        err
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
}

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
}
