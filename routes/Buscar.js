var connection = require('../routes/co.js').localConnect();

module.exports = function Buscar(req , res , next){

	console.log("asas" +req.query.key);
connection.query('SELECT name from customer where name like "%'+req.query.key+'%"',function(err, rows, fields) {
        console.log("llego");
        if(err)
         var data=[];
	for(i=0;rows.length;i++){ data.push(rows[i].name); }

        //res.end(JSON.stringify(data));

    })


};

