
const mysql = require('mysql2')

let conn = mysql.createConnection({
    host : 'project-db-stu3.smhrd.com', // 데이터베이스 e주소임
    user: 'Insa4_JSB_hacksim_4',
    password: 'aishcool4', // 설정한 비번
    port: 3307, // port번호
    database : 'Insa4_JSB_hacksim_4' 
})
conn.connect();

module.exports = conn;
