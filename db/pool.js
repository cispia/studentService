var mysql = require('mysql');
var pool = mysql.createPool({
	host:'192.168.43.239',
	user:'root',
	password:'root',
	database:"students"
})

module.exports = {
	conn(json){
		pool.getConnection(function(err,connection){
			if(err){
				console.log('ERROR======'+err)
				json.error(err)
				return
			}
			connection.query(json.sql,json.arr,(err,data)=>{
				if(err){
				console.log('ERROR======'+err)
				json.error(err)
				return
			  }
			json.success(data)
			connection.release()
			})
		})
	}
}
