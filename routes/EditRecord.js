var connection = require('../routes/co.js').localConnect();
var data="";
module.exports = function EditRecord(req , res , next){
    var id = req.params.id;
    //console.log(id);
    connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows){
    if(err){
        console.log("Error Selecting : %s ",err );
    }
    else{

	console.log(rows);
    res.render('EditCustomer',{page_title:"Edit Customers - Node.js",data:rows});
    }
	
});

}






