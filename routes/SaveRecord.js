var connection = require('../routes/co.js').localConnect();

module.exports = function SaveRecord(req , res , next){

    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var datos = {

        name    : input.name,
        address : input.address,
        email   : input.email,
        phone   : input.number

    };
    connection.query("INSERT INTO customer set ? ",datos, function(err, rows)
    {

        if (err)
            console.log("Error inserting : %s ",err );

        res.redirect('/customer');

    });


}
