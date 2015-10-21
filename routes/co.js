var db = function localConnect(){
    return require('mysql').createConnection({
        hostname: 'localhost',
        user: 'root',
        password: 'rootmysql',
        database: 'cu'
    });
    connection.connect();
}
module.exports.localConnect = db;