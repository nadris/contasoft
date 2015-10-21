var express = require('express');
var router = express.Router();
var  mysql=require('mysql');
var enigma=require('enigma-code');
var jsreport = require('jsreport');

var session   = require('express-session');
router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;
"use strict";
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rootmysql',
  database : 'contasoft'
});
connection.connect();

var DisplayAllRecords = require("../routes/DisplayAllRecords");
var AddRecord = require("../routes/AddRecord");
var SaveRecord = require("../routes/SaveRecord");
var EditRecord = require("../routes/EditRecord");
var SaveAfterEdit = require("../routes/SaveAfterEdit");
var DeleteCustomer = require("../routes/DeleteCustomer");

//Proyecto Taller III Contasoft routas de coneccion
var inicio=require("../routes/index/inicio");
var mresp=require("../routes/responsables/resp");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buscar',function(req,res){
connection.query('SELECT * from customer where name like "%'+req.query.key+'%"', function(err, rows, fields) {
	  if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].name);
      }
      res.end(JSON.stringify(data));
    
	});
});
/*
router.get('/customer',datos,DisplayAllRecords);//route customer list
router.get('/customer/add', AddRecord);
router.post('/customer/add', SaveRecord);//route delete customer
router.get('/customer/edit/:id', EditRecord);//edit customer route , get n post
router.post('/customer/edit/:id/:12', SaveAfterEdit);
router.get('/customer/delete/:id/:12', DeleteCustomer);
//router.get('/buscar/:key', Buscar);
*/

//Proyecto Taller III Contasoft
router.get('/contasoft',inicio);
router.get('/responsables',mresp);

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
 
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 
router.post('/validar',function(req,res){
var u=req.body.usuario;
var c=req.body.clave;
var u2 = encrypt(u);
var c2 = encrypt(c);
/*

console.log(">>"+decrypt(u2));
console.log(">2"+decrypt(c2));
console.log("yayi"+encrypt('marcela'));
*/
var num;
var ci2;
var ci3;
  connection.query("select cid_u as ci,count(*) as total from datos  where usuario=? and clave=? and e_d= 1 ",[u2,c2],function(error,data){
    //console.log(JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
         num=data[i].total;
         ci2=data[i].ci; 
       };
       // console.log(num);
        if(num===1){
          sess=req.session;
          sess.ci=ci2.toString();
          ci3=encrypt(ci2.toString());
           //res.redirect('/menu?datos='+ci3);
            res.redirect('/menu');
        }else{
         res.render('inicio',{titulo:"TallerIII Contasoft",titulo2:"Plataforma Desarrollada en NodeJS",vacio:" ", men:"Acceso Denegado"});
        }

      });

});

router.get('/menu',function(req,res){
  sess=req.session;
  if(sess.ci){
var cir=sess.ci;
connection.query(x,[cir],function(error, datau){
if (error)  console.log(error);

res.render('menu',{ciu:cir,u:datau});
})
}
else{
  res.redirect('/contasoft');
}

});



router.get('/reporte',function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('reporte',{u:datau,dato:90});
})
}
else{
  res.redirect('/contasoft');
}

});



router.get('/cerrarsesion',function(req,res){
    req.session.destroy(function(error){
      if (error) {
        console.log(error);

      }
      else{
        res.redirect('/contasoft');
      }

    });

});





/*
router.get('/darpdf',function(req,res){
  var udies;
  var data;
  var Report = require('../lib/fluentReports' ).Report;
    connection.query('select * from usuarios ',function(error,datas){
      for (var i = 0; i < datas.length; i++) {
    data = [
    {name:datas[i].ci_u, age: 421}, 
    ];
   };
  var rpt = new Report("Reporte_Usuarios_"+ sess.ci+".pdf")           
        .pageHeader( ["REPORTE DE USUARIOS \n SEDES-TARIJA  "] )           
        .data( data )                         
        .detail( [['name', 200],['age', 50]]) 
        .render();  

   })
res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Usuarios_'+ sess.ci+'.pdf');

})

*/


router.get('/darpdf',function(req,res){
  var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    connection.query('select * from usuarios where (e_u=1)',function(error,datas){  
    

    var rpt = new Report("Reporte_Usuarios_ac.pdf")

        .pageHeader( ["REPORTE DE USUARIOS ACTIVOS \n Sedes-Tarija \n Usuario CI :"+ sess.ci] )         
        .data( datas)                         
        .detail( " {{ci_u}}       {{nomb_u}}      {{apellp_u}}     {{apellm_u}}") 
        .render();  
   })

res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Usuarios_ac.pdf');

})

router.get('/darpdf2',function(req,res){
  var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    connection.query('select * from usuarios where (e_u=0)',function(error,datas){  
    

    var rpt = new Report("Reporte_Usuarios_db.pdf")

        .pageHeader( ["Reporte Usuarios de Baja \n Sedes-Tarija \n Usuario :"+ sess.ci] )         
        .data( datas)                         
        .detail( " {{ci_u}}       {{nomb_u}}      {{apellp_u}}     {{apellm_u}}") 
        .render();  
   })

res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Usuarios_db.pdf');

})

router.get('/buscarusu',function(req,res){
  console.log(req.query.key);
connection.query('SELECT * from usuarios where nomb_u like "%'+req.query.key+'%"', function(err, rows, fields) {
    if (err) throw err;
    var data=[];

    if(rows.length){
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].nomb_u);
      }
    }else{
      data.push('No encontrado');
    }
      console.log(rows);
      res.end(JSON.stringify(data));
    
  });
});








router.get('/agrusuario',function(req,res){
  sess=req.session;
  if(sess.ci){
  console.log("si");
  }else{
      res.redirect('/contasoft')
  }
});
router.post('/busu',function(req,res){
sess=req.session;
if(sess.ci){
        connection.query('select * from usuarios where (ci_u=?);',[req.body.id],function(e,rows){
        if(e){console.log(e);
            }else{
              var data=[];
              for (var i = 0; i < rows.length; i++) {
             data.push(rows[i].nomb_u +" "+ rows[i].apellp_u+" "+rows[i].apellm_u);
                    

               };

            res.send(data);
            }

            });
}else{

  res.redirect('/contasoft');
}

});




router.post('/vc',function(req,res){

sess=req.session;
if(sess.ci){
        connection.query('select * from usuarios where (ci_u=?);',[req.body.ciu],function(e,rows){
        if(e){console.log(e);
            }else{
              var data=[];
             if (rows.length==0) {
               data.push(1); 
             } else{
           data.push(0); 

             };
                 
               //console.log("yeas" + data)

            res.send(data);
            }

            });
}else{

  res.redirect('/contasoft');
}

});




router.post('/eliminaru',function(req,res){
  sess=req.session;
  if (sess.ci) {
    console.log(req.body.ciu);
    connection.query('select count(*) as dato from datos where(cid_u=?)',[req.body.ciu],function(e,rows){
      if(e){console.log(e);}
      else{
        var z;
      for (var i = 0; i < rows.length; i++) {
        z=rows[i].dato;
      }
      if (z===0) {
        connection.query('update usuarios set e_u=0  where  (usuarios.ci_u=?);',[req.body.ciu])
       res.send(req.body);

      } else{
          connection.query('update datos set ed_u=0  where  (datos.cid_u=?);',[req.body.ciu])
          connection.query('update usuarios set e_u=0  where  (usuarios.ci_u=?);',[req.body.ciu])
       res.send(req.body);

      };
       
      }

    });
    
  } else{
    res.redirect('/contasoft');
  };
})

router.post('/bajau',function(req,res){
  sess=req.session;
  if(sess.ci){
      
        console.log(req.body.ci);
    connection.query('select count(*) as dato from datos where(cid_u=?)',[req.body.ci],function(e,rows){
      if(e){console.log(e);}
      else{
        var z;
      for (var i = 0; i < rows.length; i++) {
        z=rows[i].dato;
      }
      if (z===0) {
        connection.query('update usuarios set e_u=0  where  (usuarios.ci_u=?);',[req.body.ci])
       res.send(req.body);

      } else{
          connection.query('update datos set ed_u=0  where  (datos.cid_u=?);',[req.body.ci])
          connection.query('update usuarios set e_u=0  where  (usuarios.ci_u=?);',[req.body.ci])
       res.send(req.body);

      };
       
      }

    });
  }else{
    res.redirect('/contasoft');
  }

});

router.get('/agregaru',function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('agregaru',{u:datau});
})
}
else{
  res.redirect('/contasoft');
}

});



router.get('/modificaru',function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('modificaru',{u:datau});
})
}
else{
  res.redirect('/contasoft');
}

});







router.get('/modificarp',function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('modificarp',{u:datau});
})
}
else{
  res.redirect('/contasoft');
}

});


router.get('/agregarp',function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('agregarp',{u:datau});
})
}
else{
  res.redirect('/contasoft');
}

});



//modulo mdepresiacion por tiempo
var schedule = require('node-schedule');
var myDate=new Date();
var date = new Date(myDate.getFullYear(), 08, 20);
var j = schedule.scheduleJob(date, function(){
    console.log('A DEPRESIAR');
});
/*
router.get('/hola',function(){

})


router.get('/pdfito',function(req,res){
sess=req.session;
  if (sess.ci) {
require("jsreport").render({
    template: {
        content: "Hello world from {{#sayLoudly this.name}}",
        helpers: "function sayLoudly(str) { return str.toUpperCase(); }",
        engine: "handlebars"
    },
    data: { name: "jsreport" }
}).then(function(out) {
    //pipes pdf with Hello world from JSREPORT
    out.stream.pipe(resp);
});

  } else{

    res.redirect('/contasoft');
  }

});
*/

router.get('/checa',function(req,res){
  sess=req.session;
  if (sess.ci) {
      connection.query('select * from usuarios where (ci_u=?) ',[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);
  res.render('checa',{u:datau});
  });
}
else{
  res.redirect('/contasoft');
}

});


router.post('/checa2', function(req,res) {

     console.log(req.body.mi);

for (var i = 0; i<req.body.section.length; i++) {
  console.log(req.body.section[i])
};

    
});


//Empezamos con el Sistema
    //PROCESO NODE JS 
router.get('/procesos',function(req,res){
  sess=req.session;
  if (sess.ci) {
      var pro;
      connection.query('select * from procesos',function(error,rusus){
if (error) {console.log(error)};
  pro=rusus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('procesos',{u:datau,proc:pro,filtrodato:""});
})
}
else{
  res.redirect('/contasoft');
}


});


router.post('/filtropr',function(req,res){
  sess=req.session;
  if (sess.ci) {
      var pro;
      connection.query("select * from procesos where nombre_p like '%"+req.body.filtrodato.toString()+"%'",function(error,rusus){
if (error) {console.log(error)};
  pro=rusus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('procesos',{u:datau,proc:pro,filtrodato:req.body.filtrodato});
})
}
else{
  res.redirect('/contasoft');
}

});


router.post('/eliminarpr',function(req,res){
  sess=req.session;
  if (sess.ci) {
    var dato=req.body.codp;
   // console.log(dato);
    connection.query('update procesos set e_p=0  where  (procesos.cod_p=?);',[req.body.codp]);


    res.send(req.body);
      
}
else{
  res.redirect('/contasoft');
}

});

router.get('/agregarpr',function(req,res){
  sess=req.session;
  if (sess.ci) {
  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);
  res.render('agregarpr',{u:datau});
  })
  }
  else{
    res.redirect('/contasoft');
  }

 });

router.post('/agregarprs',function(req,res){
  sess=req.session;
  if (sess.ci) {
        //console.log(req.body);
        var procesos={

          nombre_p:req.body.nombpr,
          url_p:req.body.urlpr,
          descrip_p:req.body.descres
        }
          connection.query('insert into procesos set ?',[procesos]);

          res.redirect('/procesos');

            }
  else{
    res.redirect('/contasoft');
  }

            });


router.post('/modificarpr',function(req,res){
//console.log(req.body.datah)

    sess=req.session;
  if (sess.ci) {

 
  

  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

 connection.query('select * from procesos where (cod_p=?)',[req.body.datah],function(e,datas){

       res.render('modificarpr',{u:datau,pr:datas});

   })   

  })


  }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/modificarprs',function(req,res){
    sess=req.session;
  if (sess.ci) {
       var procesos={
          nombre_p:req.body.nombpr,
          url_p:req.body.urlpr,
          descrip_p:req.body.descres
        }

connection.query('update procesos set ? where (cod_p= ?);',[procesos,req.body.codp]);
res.redirect('/procesos');

  }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/buscarpr',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     connection.query('select * from procesos where (cod_p=?)',[req.body.codp],function(e,datas){

      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});


router.get('/darpdfpr',function(req,res){
  var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    connection.query('select * from procesos ',function(error,datas){  
    

    var rpt = new Report("Reporte_Procesos.pdf")

        .pageHeader( ["REPORTE DE PROCESOS  \n Sedes-Tarija \n Usuario CI :"+ sess.ci] )         
        .data( datas)                         
        .detail( " {{nombre_p}}  {{url_p}}     {{e_p}}") 
        .render();  
   })

res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Procesos.pdf');

})


//ROLES SISTEMA CONTASOFT
router.get('/roles',function(req,res){
  sess=req.session;
  if (sess.ci) {
      var ro;
      connection.query('select * from roles',function(error,rusus){
if (error) {console.log(error)};
  ro=rusus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('roles',{u:datau,proc:ro,filtrodato:""});

})
}
else{
  res.redirect('/contasoft');
}


});


router.post('/filtror',function(req,res){
  sess=req.session;
  if (sess.ci) {
      var pro;
      connection.query("select * from roles where nombre_r like '%"+req.body.filtrodato.toString()+"%'",function(error,rusus){
if (error) {console.log(error)};
  pro=rusus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('roles',{u:datau,proc:pro,filtrodato:req.body.filtrodato});
})
}
else{
  res.redirect('/contasoft');
}

});
router.post('/eliminarr',function(req,res){
  sess=req.session;
  if (sess.ci) {
    //var dato=req.body.codr;
   // console.log(dato);
    connection.query('update roles set e_r=0  where  (roles.cod_r=?);',[req.body.codr]);
    res.send(req.body);
      
}
else{
  res.redirect('/contasoft');
}

});



router.get('/agregarr',function(req,res){
  sess=req.session;
  if (sess.ci) {
  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);
  res.render('agregarr',{u:datau});
  })
  }
  else{
    res.redirect('/contasoft');
  }

 });

router.post('/agregarrs',function(req,res){
  sess=req.session;
  if (sess.ci) {
        var roles={

          nombre_r:req.body.nombr,
          descrip_r:req.body.descres
        }
          connection.query('insert into roles set ?',[roles]);

          res.redirect('/roles');

            }
  else{
    res.redirect('/contasoft');
  }

            });


router.post('/modificarr',function(req,res){
//console.log(req.body.datah)

    sess=req.session;
  if (sess.ci) {

 
  

  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

 connection.query('select * from roles where (cod_r=?)',[req.body.datah],function(e,datas){

       res.render('modificarr',{u:datau,pr:datas});

   })   

  })


  }
  else{
    res.redirect('/contasoft');
  }
});


router.post('/modificarrs',function(req,res){
    sess=req.session;
  if (sess.ci) {
       var roles={

          nombre_r:req.body.nombr,
          descrip_r:req.body.descres
        }

connection.query('update roles set ? where (cod_r= ?);',[roles,req.body.codr]);
res.redirect('/roles');

  }
  else{
    res.redirect('/contasoft');
  }
});



router.post('/buscarr',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     connection.query('select * from roles where (cod_r=?)',[req.body.codr],function(e,datas){

      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});

const xar=0;
router.post('/asignarpr',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     xar=req.body.datah2;
  connection.query('select * from roles where(cod_r=?)',[req.body.datah2],function(e,dato){



  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

 connection.query('select * from procesos where(e_p=1)',function(e,datas){

  connection.query('select codrp_p from rolpro where (codrp_r=?)',[req.body.datah2],function(e, dat){


connection.query('SELECT * FROM procesos p WHERE (p.e_p!=0) AND p.cod_p NOT IN (SELECT r.codrp_p FROM rolpro r where(r.codrp_r=?) );',[req.body.datah2],function(e, dat3){

  res.render('agregarpr-r',{u:datau,pr:datas,ro:dato,dat:dat,dat3:dat3});
})
  
  }) 
   })   

  })

  } )  



  }
  else{
    res.redirect('/contasoft');
  }
});


router.post('/asignarprs',function(req,res){
  var dat;
    sess=req.session;
  if (sess.ci) {
   console.log()
    var x;
    var local;

      for (var i = 0; i < req.body.pr.length; i++) {
           dat=req.body.pr[i];
           console.log(req.body.codr+"++>"+dat)

            connection.query('select count(*) as uno from rolpro r where(r.codrp_r=?) and (r.codrp_p=?)',[req.body.codr,req.body.pr[i]],function(e,d){
              
              for (var i = 0; i < d.length; i++) {
              if(d[i].uno==0){


               console.log("necesita")

                connection.query('insert into rolpro(codrp_r,codrp_p) values (?,?)',[req.body.codr,req.body.pr[i]]);

            }else{
              
                console.log(" no necestita");

          
          }
              }

            })
            
      }

  res.redirect('/roles');
  }
  else{
    res.redirect('/contasoft');
  }
});


router.get('/darpdfr',function(req,res){
  var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
 connection.query('select * from roles ',function(error,datas){  
  
    var rpt = new Report("Reporte_Roles.pdf")

        .pageHeader( ["REPORTE DE ROLES  \n Sedes-Tarija \n Usuario CI :"+ sess.ci] )         
        .data( datas)                         
        .detail( " {{nombre_r}}") 
        .render();  
   })

res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Roles.pdf');

});
// USUARIOS SISTEMA 


router.get('/usuarios',function(req,res){
  sess=req.session;
  if (sess.ci) {
var tu;
connection.query('select * from usuarios',function(error,usus){
if (error) {console.log(error)};
  tu=usus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
/*
var notifier = require('node-notifier');
notifier.notify({
  'title': 'Mensaje',
  'message': 'Bienvenido a Usuarios'
});

*/
//console.log(tu);
res.render('usuarios',{u:datau,tusu:tu,filtrodato:""});
})
}
else{
  res.redirect('/contasoft');
}

});

router.post('/filtrousu',function(req,res){
  sess=req.session;
  if (sess.ci) {
var tu;
connection.query("select * from usuarios where nomb_u  like '%"+req.body.filtrodato.toString()+"%'",function(error,usus){
if (error) {console.log(error)};
  tu=usus;
});

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
res.render('usuarios',{u:datau,tusu:tu,filtrodato:req.body.filtrodato});
})
}
else{
  res.redirect('/contasoft');
}

});










var qr = require('qr-image');
var fs=require('fs');
var multiparty=require('multiparty');


router.get('/qrs', function(req, res) {
    var data="ACTIVO FIJO 234-089-A";
    var dat="234-089-a";
    var code = qr.image(data, { type: 'png', ec_level: 'H', size: 10, margin: 2 });
    res.type('png');
    code.pipe(fs.createWriteStream(__dirname+"/../public/qr/"+dat+".png"));
     console.log("se hizo");
});

router.get('/qr', function(req, res) {
 sess=req.session;

  connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);

res.render('loca',{u:datau});
})

});


router.get('/upload', function(req, res) {
 sess=req.session;

  connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);

res.render('upload',{u:datau});
})
});

router.post('/upload2', function(req, res) {
 sess=req.session;

 var form=new multiparty.Form();

 form.parse(req, function(e,fields,files){
  console.log("*> "+fields.name);



    //CARGAR FOTO
    var img=files.images[0];
    //var fs=require('fs');    
    fs.readFile(img.path, function(e,data){
      var path=__dirname+"/../public/fotos/"+fields.name+".jpg";
      fs.writeFile(path,data,function(error){
        if (error) console.log(error);
      });
    })



 })
res.redirect('usuarios');


})

router.get("/agregarusu",function(req,res){
  sess=req.session;
  if (sess.ci) {
connection.query(x,sess.ci,function(e,data){
connection.query(roles,function(e,ro){
 res.render('agregaru',{u:data,ro:ro});


})
 

})

  } else{
    res.redirect('/contasoft')
  };



})


var moment=require('moment');

router.post('/agregarusus', function(req, res) {
 sess=req.session;
 if (sess.ci) {
 var form=new multiparty.Form();

 form.parse(req, function(e,fields,files){

  var date = moment(fields.fecha, 'DD-MM-YYYY');
  var date2= date.format('YYYY-MM-DD');
  console.log(date2)
 

    if(files.images[0].originalFilename==''){
       var usu={
    ci_u:fields.cedula,
    nomb_u:fields.nomb,
    apellp_u:fields.ap,
    apellm_u:fields.am,
    dir_u:fields.dire,
    telf_u:fields.tel,
    foto_u:"defecto.jpg",
    fecha_nac_u:date.format('YYYY-MM-DD'),
    cod_r:fields.rolu,
    e_u:1
  }
  var datos={
    cid_u:fields.cedula,
    usuario:encrypt(fields.cedula.toString()),
    clave:encrypt(fields.clave1.toString()),
    e_d:1
  }

  connection.query('insert into usuarios set ?',[usu],function(error){
    console.log(error)
  });
  connection.query('insert into datos set ?',[datos],function(error){
    console.log(error)
  });
    

    }else{

       var datos={
    cid_u:fields.cedula,
    usuario:encrypt(fields.cedula.toString()),
    clave:encrypt(fields.clave1.toString()),
    e_d:1
  }

     var usu={
    ci_u:fields.cedula,
    nomb_u:fields.nomb,
    apellp_u:fields.ap,
    apellm_u:fields.am,
    dir_u:fields.dire,
    telf_u:fields.tel,
    foto_u:fields.cedula+".jpg",
    fecha_nac_u:date.format('YYYY-MM-DD'),
    cod_r:fields.rolu,
    e_u:1
  }



  connection.query('insert into usuarios set ?',[usu],function(error){
    console.log(error)
  });

  connection.query('insert into datos set ?',[datos],function(error){
    console.log(error)
  });

var img=files.images[0];
    //var fs=require('fs');    
    fs.readFile(img.path, function(e,data){
      var path=__dirname+"/../public/fotos/"+fields.cedula+".jpg";
      fs.writeFile(path,data,function(error){
        if (error) console.log(error);
      });
    })

    }


 })

res.redirect('/usuarios');
 } 

else{

  res.redirect('/contasoft');
}

})



router.post('/modificarusu', function(req, res) {
 sess=req.session;
 if (sess.ci) {

console.log(req.body.ci); 
var claves;

connection.query(x,sess.ci,function(e,data){
  connection.query(roles,function(e,ro){
     connection.query(ud,[req.body.ci],function(e,usu){
     console.log(usu)

     for (var i = 0; i < usu.length; i++) {
      claves= usu[i].clave;
     };
      console.log(claves)

      res.render('modificaru',{u:data,ro:ro,usu:usu,clave:decrypt(claves)}); }) }) })


}
else{

  res.redirect('/contasoft');
}

})





router.post('/modificarusus', function(req, res) {
 sess=req.session;
 if (sess.ci) {
 var form=new multiparty.Form();
 form.parse(req, function(e,fields,files){
  var date = moment(fields.fecha, 'DD-MM-YYYY');
  var date2= date.format('YYYY-MM-DD');
    if(files.images[0].originalFilename==''){

       var usu={
    //ci_u:fields.cedula,
    nomb_u:fields.nomb,
    apellp_u:fields.ap,
    apellm_u:fields.am,
    dir_u:fields.dire,
    telf_u:fields.tel,
    fecha_nac_u:date.format('YYYY-MM-DD'),
    cod_r:fields.rolu,
    e_u:1
  }
  console.log(usu);
  var datos={
   // cid_u:fields.cedula,
    //usuario:encrypt(fields.cedula.toString()),
    clave:encrypt(fields.clave1.toString()),
    e_d:1
  }

  connection.query('update usuarios set ? where(ci_u=?)',[usu,fields.cedula],function(error){
    console.log(error)
  });
  connection.query('update datos set ? where(cid_u=?)',[datos,fields.cedula],function(error){
    console.log(error)
  });
    

    }else{

       var datos={
    //cid_u:fields.cedula,
    //usuario:encrypt(fields.cedula.toString()),
    clave:encrypt(fields.clave1.toString()),
    e_d:1
  }

     var usu={
   // ci_u:fields.cedula,
    nomb_u:fields.nomb,
    apellp_u:fields.ap,
    apellm_u:fields.am,
    dir_u:fields.dire,
    telf_u:fields.tel,
    foto_u:fields.cedula+".jpg",
    fecha_nac_u:date.format('YYYY-MM-DD'),
    cod_r:fields.rolu,
    e_u:1
  }


 connection.query('update usuarios set ? where(ci_u=?)',[usu,fields.cedula],function(error){
    console.log(error)
  });
  connection.query('update datos set ? where(cid_u=?)',[datos,fields.cedula],function(error){
    console.log(error)
  });

var img=files.images[0];
    //var fs=require('fs');    
    fs.readFile(img.path, function(e,data){
      var path=__dirname+"/../public/fotos/"+fields.cedula+".jpg";
      fs.writeFile(path,data,function(error){
        if (error) console.log(error);
      });
    })

    }


 })

res.redirect('/usuarios');
 } 

else{

  res.redirect('/contasoft');
}

})



router.post('/buscaru',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     req.body.codu;
     connection.query(ud,[req.body.codu],function(e,datas){

      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});



router.post('/eliminarusu',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     var x=req.body.codu;

      connection.query('update usuarios set e_u=0 where(ci_u=?)',[req.body.codu],function(e){console.log(e)});
         connection.query('update datos set e_d=0 where(cid_u=?)',[req.body.codu],function(e){console.log(e)});

      res.send(req.body);
   }
  else{
    res.redirect('/contasoft');
  }
});


router.post('/activarusu',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     var x=req.body.codu;

      connection.query('update usuarios set e_u=1 where(ci_u=?)',[req.body.codu],function(e){console.log(e)});
         connection.query('update datos set e_d=1 where(cid_u=?)',[req.body.codu],function(e){console.log(e)});

      res.send(req.body);
   }
  else{
    res.redirect('/contasoft');
  }
});

// cuenta contable

router.get('/cuentacontables',function(req,res){
    sess=req.session;
  if (sess.ci) {

connection.query(cuentas,[sess.ci.toString()],function(error, proc){
if (error)  console.log(error);

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);

res.render('cuentas',{u:datau,filtrodato:"",proc:proc});
})
})

     
   }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/filtrocuenta',function(req,res){
    sess=req.session;
  if (sess.ci) {
connection.query("select * from cuenta_contable where nombre_c  like '%"+req.body.filtrodato.toString()+"%'",function(error, proc){
if (error)  console.log(error);

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
      
  res.render('cuentas',{u:datau,filtrodato:req.body.filtrodato,proc:proc});
})
})

     
   }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/buscarcu',function(req,res){
    sess=req.session;
  if (sess.ci) {
     
     connection.query('select * from cuenta_contable where (cod_cuenta=?)',[req.body.codp],function(e,datas){

      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});


router.get('/agregarcu',function(req,res){
    sess=req.session;
  if (sess.ci) {
  connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

      res.render('agregarcu',{u:datau});
  })

    }else{
      res.redirect('/contasoft');
    }

})




router.post('/agregarcus',function(req,res){
    sess=req.session;
  if (sess.ci) {
   // console.log(req.body)
var cuenta={
    cod_cuenta: req.body.codigocu,
    nombre_c: req.body.nombcu,
    grupo_c:req.body.grupocu,
    vidautil_c:req.body.vidaucu,
    descrip_c:req.body.descrip,
    e_c:1   
  }

 connection.query('insert into cuenta_contable set ?',[cuenta],function(error){
    console.log(error)
  });

      res.redirect('/cuentacontables');
    }else{
      res.redirect('/contasoft');
    }


})

router.post('/bcu',function(req,res){
sess=req.session;
if(sess.ci){
 connection.query('select * from cuenta_contable where (cod_cuenta=?);',[req.body.codcu],function(e,rows){
    if(e){console.log(e);
            }else{
              var data=[];
             if (rows.length==0) {
               data.push(1); 
             } else{
           data.push(0); 

             };
            res.send(data);
            }

            });
}else{

  res.redirect('/contasoft');
}

});

router.post('/eliminarcu',function(req,res){
  sess=req.session;
  if (sess.ci) {
    var dato=req.body.codcu;
 
    connection.query('update cuenta_contable set e_c=0  where  (cod_cuenta=?);',[dato]);

    res.send(req.body);
      
}
else{
  res.redirect('/contasoft');
}

});



router.post('/modificarcu',function(req,res){
    sess=req.session;
    


  if (sess.ci) {
  connection.query(x,[sess.ci.toString()],function(error, datau){
connection.query(cucon,[req.body.datah],function(e, cu){
      res.render('modificarcu',{u:datau,cu:cu});
    })
  })

    }else{
      res.redirect('/contasoft');
    }

})

router.post('/agregarcuss',function(req,res){
    sess=req.session;
  if (sess.ci) {
   // console.log(req.body)
   
var cuenta={ 
    nombre_c: req.body.nombcu,
    grupo_c:req.body.grupocu,
    vidautil_c:req.body.vidaucu,
    descrip_c:req.body.descrip
  }

 connection.query('update cuenta_contable set ? where(cod_cuenta=?)',[cuenta,req.body.codigocu],function(error){
    console.log(error)
  });

      res.redirect('/cuentacontables');
    }else{
      res.redirect('/contasoft');
    }


})

router.get('/cuentacontablepdf',function(req,res){
  
  "use strict";
    var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    var cont=0;
   var daydetail = function ( report, data ) {
    report.band( [
            {data: data.cod_cuenta, width: 50},
            {data: data.nombre_c, width: 250},
            {data: data.vidautil_c, width: 100},
            
                  
    ], {border:1} 
    );
  };
 connection.query('select * from cuenta_contable ',function(error,datas){  

    var rpt = new Report("Reporte_Cuenta_Contable.pdf")
        .pageHeader( ["REPORTE DE ROLES  \n Sedes-Tarija \n Usuario CI :"+ sess.ci])         
        .data( datas)                         
        .detail(daydetail) 
        .render();  
   })
res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Cuenta_Contable.pdf');

})



router.get('/tipo_activosfijos',function(req,res){
    sess=req.session;
  if (sess.ci) {

              connection.query(tipo_af,[sess.ci.toString()],function(error, proc){
              if (error)  console.log(error);

              connection.query(x,[sess.ci.toString()],function(error, datau){
              if (error)  console.log(error);

              res.render('tipo_af',{u:datau,filtrodato:"",proc:proc});
              })
              }) 
   }
  else{
    res.redirect('/contasoft');
  }
});


router.post('/filtroatf',function(req,res){
    sess=req.session;
  if (sess.ci) {
connection.query("select * from tipo_activofijo where nombre_taf  like '%"+req.body.filtrodato.toString()+"%'",function(error, proc){
if (error)  console.log(error);

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
      
  res.render('tipo_af',{u:datau,filtrodato:req.body.filtrodato,proc:proc});
})
})

     
   }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/eliminartaf',function(req,res){
  sess=req.session;
  if (sess.ci) {
    var dato=req.body.codtaf;
 
    connection.query('update tipo_activofijo set e_taf=0  where  (cod_serial=?);',[dato]);

    res.send(req.body);
      
}
else{
  res.redirect('/contasoft');
}

});

router.post('/buscaratf',function(req,res){
    sess=req.session;
  if (sess.ci) {
         connection.query('select * from tipo_activofijo t , cuenta_Contable c where (t.cod_serial=?) and (t.cod_cue=c.cod_scu);',[req.body.codtaf],function(e,datas){
      console.log(datas)
      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});

router.get('/agregartaf',function(req,res){
    sess=req.session;
  if (sess.ci) {
  connection.query(cuentas_activas,function(error, cu){
  if (error)  console.log(error);

   connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

      res.render('agregartaf',{u:datau,cu:cu});
    })
  })

    }else{
      res.redirect('/contasoft');
    }

})


router.post('/btaf',function(req,res){
sess=req.session;
if(sess.ci){
 connection.query('select * from tipo_activofijo where (cod_taf=?);',[req.body.codtaf],function(e,rows){
    if(e){console.log(e);
            }else{
              var data=[];
             if (rows.length==0) {
               data.push(1); 
             } else{
           data.push(0); 

             };
            res.send(data);
            }

            });
}else{

  res.redirect('/contasoft');
}

});



router.post('/agregaratfs',function(req,res){
    sess=req.session;
  if (sess.ci) {
    var taf={
      cod_cue:req.body.codcue,
      cod_taf:req.body.codigotaf,
      nombre_taf:req.body.nombtaf,
      e_taf:1
    }
connection.query('insert into tipo_activofijo set ?',[taf]);
res.redirect('tipo_activosfijos');

    }else{
      res.redirect('/contasoft');
    }

})

router.post('/modificartaf',function(req,res){
    sess=req.session;
  if (sess.ci) {
          
          connection.query('select * from tipo_activofijo where (cod_serial=?)',[req.body.datah],function(e,data){
                connection.query(cuentas_activas,function(error, cu){
  if (error)  console.log(error);

   connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

      res.render('modificartaf',{u:datau,cu:cu,taf:data});
      
    })
  })
                  })          
    }else{
      res.redirect('/contasoft');
    }

})


router.post('/modificaratfs',function(req,res){
    sess=req.session;
  if (sess.ci) {
    var taf={
      cod_cue:req.body.codcue,
      nombre_taf:req.body.nombtaf
    }
connection.query('update tipo_activofijo set ? where(cod_taf=?)',[taf,req.body.codigotaf]);
res.redirect('tipo_activosfijos');

    }else{
      res.redirect('/contasoft');
    }

})




router.get('/tipoactivofijopdf',function(req,res){
  
  "use strict";
    var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    var cont=0;
   var daydetail = function ( report, data ) {
    report.band( [
            {data: data.cod_taf, width: 120},
            {data: data.nombre_taf, width: 200},
            {data: data.nombre_c, width: 180},
            
                  
    ], {border:1} 
    );
  };
 connection.query('select * from tipo_activofijo t , cuenta_Contable c where  (t.cod_cue=c.cod_scu); ',function(error,datas){  

    var rpt = new Report("Reporte_Tipo_AF.pdf")
        .pageHeader( ["REPORTE DE TIPOS DE ACTIVOS FIJOS  \n Sedes-Tarija \n Usuario CI :"+ sess.ci])         
        .data( datas)                         
        .detail(daydetail) 
        .render();  
   })
res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Tipo_AF.pdf');

})


router.get('/unidades',function(req,res){
    sess=req.session;
  if (sess.ci) {

              connection.query(uni,[sess.ci.toString()],function(error, proc){
              if (error)  console.log(error);

              connection.query(x,[sess.ci.toString()],function(error, datau){
              if (error)  console.log(error);

              res.render('unidades',{u:datau,filtrodato:"",proc:proc});
              })
              }) 
   }
  else{
    res.redirect('/contasoft');
  }
});


router.post('/eliminarunid',function(req,res){
  sess=req.session;
  if (sess.ci) {
    var dato=req.body.codunid;
 
    connection.query('update unidades set e_un=0  where  (cod_unid=?);',[dato]);

    res.send(req.body);
      
}
else{
  res.redirect('/contasoft');
}

});


router.post('/buscarunid',function(req,res){
    sess=req.session;
  if (sess.ci) {
         connection.query('select * from unidades where(cod_unid=?)',[req.body.codunid],function(e,datas){
      //console.log(datas)
      res.json(JSON.stringify(datas));
    })
  }
  else{
    res.redirect('/contasoft');
  }
});

router.post('/filtrounid',function(req,res){
    sess=req.session;
  if (sess.ci) {
connection.query("select * from unidades where nombre_unid  like '%"+req.body.filtrodato.toString()+"%'",function(error, proc){
if (error)  console.log(error);

connection.query(x,[sess.ci.toString()],function(error, datau){
if (error)  console.log(error);
      
  res.render('unidades',{u:datau,filtrodato:req.body.filtrodato,proc:proc});
})
})

     
   }
  else{
    res.redirect('/contasoft');
  }
});


router.get('/agregarunid',function(req,res){
    sess=req.session;
  if (sess.ci) {

   connection.query(x,[sess.ci.toString()],function(error, datau){
  if (error)  console.log(error);

      res.render('agregarunid',{u:datau});
    })

    }else{
      res.redirect('/contasoft');
    }

})


router.post('/agregarunids',function(req,res){
    sess=req.session;
  if (sess.ci) {
    var unidad={
      nombre_unid:req.body.nombre_unid,
      descrip_unid:req.body.descrip_unid,
      dir_unid:req.body.dir_unid,
      e_un:1
    }
    console.log(unidad)
connection.query(unidades,[unidad]);
res.redirect('/unidades');

    }else{
      res.redirect('/contasoft');
    }

})


router.post('/modificarunidad',function(req,res){
    sess=req.session;
  if (sess.ci) {
          console.log(req.body.datah)
          connection.query('select * from unidades where (cod_unid=?)',[req.body.datah],function(e,data){
               
   connection.query(x,[sess.ci.toString()],function(error, datau){
 
      res.render('modificarunid',{u:datau,unid:data});
      
  })
                  })          
    }else{
      res.redirect('/contasoft');
    }

})



router.post('/modificarunids',function(req,res){
    sess=req.session;
  if (sess.ci) {
   var unidad={
      nombre_unid:req.body.nombre_unid,
      descrip_unid:req.body.descrip_unid,
      dir_unid:req.body.dir_unid,
    }
connection.query('update unidades set ? where(cod_unid=?)',[unidad,req.body.cod_unid]);
res.redirect('/unidades');

    }else{
      res.redirect('/contasoft');
    }

})

router.get('/unidadespdf',function(req,res){
  
  "use strict";
    var udies;
  var data=[];
  var Report = require('../lib/fluentReports' ).Report;
    var cont=0;
   var daydetail = function ( report, data ) {
    report.band( [
            {data: data.cod_unid, width: 50},
            {data: data.nombre_unid, width: 200},     
            {data: data.dir_unid, width: 250},
                  
    ], {border:1} 
    );
  };
 connection.query('select * from unidades where(e_un=1) ',function(error,datas){  

    var rpt = new Report("Reporte_Unidades.pdf")
        .pageHeader( ["REPORTE DE UNIDADES   \n Sedes-Tarija \n Usuario CI :"+ sess.ci])         
        .data( datas)                         
        .detail(daydetail) 
        .render();  
   })
res.download('C:/Users/nadris/Desktop/Taller III ContaSoft/Reporte_Unidades.pdf');

})




var unidades='insert into unidades set ?';
var uni='select * from unidades';

var cuentas_activas=" select * from cuenta_contable where(e_c=1)"

var tipo_af_activas="select * from tipo_activofijo where (e_taf=1)";

var tipo_af="select * from tipo_activofijo";

var cucon=" select * from cuenta_contable where(cod_cuenta=?)"

var cuentas=" select * from cuenta_contable"

var roles="select * from roles where (e_r=1);"

var x="select * from usuarios u, procesos p, roles r, rolpro rp where(u.ci_u=?) and(u.cod_r=r.cod_r) and (p.cod_p=rp.codrp_p) and(rp.codrp_r=u.cod_r)and (u.e_u=1)";

var ud="select *, DATE_FORMAT( STR_TO_DATE(u.fecha_nac_u, '%Y-%m-%d') ,'%d-%m-%Y' ) as fecha from usuarios u, datos d where(u.ci_u=?)and (u.ci_u=d.cid_u)";

module.exports = router;
