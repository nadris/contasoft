var connection = require('../routes/co.js').localConnect();

module.exports = function SaveRecord(req , res , next){

    var id = req.params.id;

    var input = JSON.parse(JSON.stringify(req.body));

    var RecordDetailParsedFromForm = {

        name    : input.name,
        address : input.address,
        email   : input.email,
        phone   : input.number

    };
    connection.query("UPDATE customer set ? WHERE id=?",[RecordDetailParsedFromForm,id], function(err, rows)
    {
        if (err)
            console.log("Ocurrio un error : %s ",err );

        res.redirect('/customer');
    });


}
