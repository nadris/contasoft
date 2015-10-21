var connection = require('../routes/co.js').localConnect();

module.exports = function DisplayAllRecords(req , res , next){
    var a=connection.query('select * from customer',function(err , rows){
        if(err)
            console.log("Error Selecting : %s ",err);
        console.log(a);
        res.render('customer',{page_title:"Customers Detail", data:rows});
    })


};







