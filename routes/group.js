const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const session = require("express-session");
const url = 'https://connect.aischool.o-r.kr/';


router.post("/canvan", (req, res) => {
  let { todo, deadline, member, group_idx } = req.body;

  console.log(req.body);
  let user_id = req.session.user.user_id;
  let sql =
    "INSERT INTO tb_canvan (user_id, todo,in_process,party_idx,deadline, member) VALUES(?, ?,'0',?,?,?)";
  conn.query(sql, [user_id, todo, group_idx, deadline, member], (err, rows) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.redirect("/group?data=" + group_idx);
    }
  });
});

router.post("/notice", (req, res) => {
  let { title, group_idx } = req.body;
  let user_id = req.session.user.user_id;
  let sql =
    "INSERT INTO tb_notification (noti_content, created_at, user_id,party_idx) VALUES(?, NOW(),?, ?);";
  conn.query(sql, [title, user_id, group_idx], (err, rows) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.redirect("/group?data=" + group_idx);
    }
  });
});

router.get("/", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  let data = req.query.data;
  let user_id = req.session.user.user_id;

  let sql_group_info = `SELECT A.user_id, B.party_title, B.party_idx, C.user_name
  FROM tb_join A
  INNER JOIN tb_party B ON A.party_idx = B.party_idx
  INNER JOIN tb_user C ON A.user_id = C.user_id
  WHERE B.party_idx = ?;`;

  conn.query(sql_group_info, [data], (err, rows_group_info) => {
    if (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ message: "Database error" });
    } else if (rows_group_info.length === 0) {
      res.status(404).json({ message: "No matching party found" });
    } else {
      let party_idx = rows_group_info[0].party_idx;

      let sql_notice = `
SELECT a.noti_content, DATE_FORMAT(a.created_at, '%Y-%m-%d %p %h:%i') as created_at, a.user_id, a.party_idx, b.user_name
FROM tb_notification a
INNER JOIN tb_user b ON a.user_id = b.user_id
WHERE a.party_idx = ?;
`;
      let sql_todo = `SELECT todo, member, DATE_FORMAT(deadline, '%m / %d') AS formattedDeadline, in_process, process_idx, party_idx FROM tb_canvan WHERE party_idx = ?;`;

      conn.query(sql_notice, [party_idx], (err, rows_notice) => {
        if (err) {
          console.error("Error retrieving data:", err);
          res.status(500).json({ message: "Database error" });
        } else {
          conn.query(sql_todo, [party_idx], (err, rows_todo) => {
            if (err) {
              console.error("Error retrieving data:", err);
              res.status(500).json({ message: "Database error" });
            } else {
              // 공지사항 목록과 그룹 데이터를 렌더링하는 group   이지에 데이터 전달
              res.render("screen/group", {
                obj: req.session.user,
                notice: rows_notice,
                to: rows_todo,
                group_info: rows_group_info,
                group: data,
              });
            }
          });
        }
      });
    }
  });
});

router.post("/update/:id", (req, res) => {
  const process_idx = parseInt(req.params.id);
  const { in_process } = req.body;
  console.log(req.body);
  const sql = "UPDATE tb_canvan SET in_process = ? WHERE process_idx = ?";
  conn.query(sql, [in_process, process_idx], (error, result) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Item not found" });
    } else {
      res.json({ message: "Item updated successfully" });
    }
  });
});

router.delete("/delete/:id", function (req, res) {
  const id = parseInt(req.params.id);

  // MySQL 데이터베이스에서 해당 ID의 항목 삭제
  const deleteQuery = "DELETE FROM tb_canvan WHERE process_idx = ?"; //process_idx -> task_id로 수정

  conn.query(deleteQuery, [id], (error, result) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Item not found" });
    } else {
      res.json({ message: "Item deleted successfully" });
    }
  });
});

//그룹추가초대하기
router.post("/group_inv", (req, res) => {
  let { group_idx, user_id } = req.body;
  console.log(group_idx, user_id);
  let sql = `select * from tb_user where user_id = ?`;
  let sql_add =
    "insert into tb_join (user_id,party_idx,joined_at) values(?,?,now())";
  conn.query(sql, [user_id], (err, rows) => {
    console.log(rows);
    if (rows[0] == undefined) {
      res.json("1");
    } else {
      res.json(rows);
      conn.query(sql_add, [user_id, group_idx], (err, rows) => {});
    }
  });
});

//그룹 나가기
router.post('/exit',(req,res)=>{
  console.log('나가기',req.body.group_idx,req.session.user.user_id)
  let {party_idx} =req.body
  let {user_id} = req.session.user
  let sql = `delete from tb_join where party_idx =? and user_id = ?;` 
  conn.query(sql,[party_idx,user_id],(err,rows)=>{

  })



})


module.exports = router;
