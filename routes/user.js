const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const url = 'https://connect.aischool.o-r.kr/';

router.post("/write", (req, res) => {
  let {
    title,
    content,
    categoryMain,
    category,
    human,
    lastdate,
    selectedStacks,
  } = req.body;
  let userid = req.session.user.user_id;
  let categoryJson;
  if (categoryMain !== "자유게시판") {
    const parsedSelectedStacks = selectedStacks
      ? JSON.parse(selectedStacks)
      : [];
    let categoryArray = [category, human, lastdate, parsedSelectedStacks];
    categoryJson = JSON.stringify(categoryArray);
  } else {
    // '게시판'일 경우 빈 객체를 저장합니다.
    categoryJson = JSON.stringify({});
  }

  let sql =
    "INSERT INTO tb_board (b_title, b_content, created_at,user_id, b_type, b_category) VALUES (?, ?, NOW(), ?,?, ?)";
  conn.query(
    sql,
    [title, content, userid, categoryMain, categoryJson],
    (err, rows) => {
      if (err) {
        console.error("Error:", err);
        res.send(`<script>alert("전송 실패");
                location.href="${url}"</script>`);
      } else {
        idx_id = rows.insertId;
        res.send(`<script>alert("업로드 되었습니다.");
                location.href="${url}detail?a=${idx_id}"</script>`); // 새 포스트의 상세 페이지로 리디렉션합니다.
      }
    }
  );
});

// 조회수

// 회원가입 기능 라우터
router.post('/join', (req, res) => {
  console.log('회원가입 기능 라우터', req.body)
  // 1. join.html 에서 받아온 id,pw,name,address를 각각의 변수에 저장
  let { name, id, git,phone, pw,pw2, process1} = req.body
  console.log(name, id, git,phone, pw,pw2, process1)
  // 2. 비밀번호와, 비밀번호 확인 데이터가 같으면 회원가입 로직으로
  // 3. DB 연동 작업 = insert into 테이블명 values (아이디, 비번, 이름, 주소)
  
  if (pw === pw2) {
      let sql = "insert into tb_user values (?,SHA2(?,512),?,?,?,?,'y',now(),'uu')"
      conn.query(sql, [id, pw, name,git,phone,process1], (err, rows) => {
          console.log('회원가입 결과',rows)
          if(rows.affectedRows>0){
              res.send(`<script>alert('회원가입 성공했습니다 로그인해주세요')
                  location.href="${url}"</script>`)
          }    
     // 4. 만약 회원가입에 성공하면 alert로 회원가입 성공! => 메인창 이동
      })
  } else {
      res.send(`<script>alert("비밀번호 확인이 다릅니다.")
      location.href="${url}join"</script>`)
  }
  // 5. 만약 회원가입에 실패하면 alert로 회원가입 실패 ... => 회원가입 창으로 이동

  // **참고
  // 07.DB => 회원가입 로직
  // 07. DB 참고 끝났으면 바로바로 폴더 닫아주세요! ★★★

})


// 로그인 기능 라우터
router.post('/login', (req,res)=>{
  // 1.layout.html 에서 login Box 안의 데이터를 받아온다 (id,pw)
  // 2. 그 데이터들을 각각 id, pw 변수 안에 저장
  console.log('로그인 기능 라우터',req.body)
  let {id,pw} = req.body
  // 3. DB 연동해서 해당 id 값과 pw 값이 일치하는 데이터가 DB에 있는지 확인한다
  let sql = 'select * from tb_user where user_id=? and user_pw =SHA2(?,512)'
  // 4. 데이터가 존재한다면 로그인 성공
  conn.query(sql,[id,pw],(err, rows)=>{
  
      if(rows.length > 0){
         console.log('로그인 성공!', rows)
          req.session.user = rows[0];
          res.send(`<script>location.href="${url}page/1"</script>`)
      } 
         else {
         console.log('로그인 실패!')
         res.send(`<script>alert("아이디 혹은 비밀번호를 다시 확인해주세요.");
         location.href="${url}"</script>`)
      }

   })
  //     4-2) 로그인이 성공했다면, 해당 유저의 정보를 세션에 저장(id, nick, address)
  //     4-3) 환영합니다! alert => 메인으로 이동
  // 5. 데이터가 존재하지 않는다면 로그인 실패
})

// 로그아웃 기능 라우터
router.get('/logout',(req,res)=>{
  // 1. 세션 삭제
  req.session.destroy()
  // 2. 메인페이지에 다시 접근
  res.send(`<script>location.href="${url}"</script>`)
})


// 회원가입 수정 페이지 이동
router.get('/setting',(req,res)=>{
  res.render('screen/setting',{obj : req.session.user})
})


// 회원 정보 수정 기능 라우터 (JS fetch 와의 연동) ★★★★★
router.post('/modify',(req,res)=>{
  console.log('회원정보수정!',req.body)

  // 1. 내가 받아온 새 이름과 새 주소를 name, add 라는 변수에 넣을 것
  let {name,git,phone,process1} = req.body
  console.log(name,git,phone,process1)
  // 2. id 값? session에서 가져오기
  let id = req.session.user.user_id 
  // 3. DB 연동
  let sql = 'update tb_user set user_name = ?, user_email = ?, user_phone=?, user_class= ? where user_id = ?'
  conn.query(sql,[name,git,phone,process1, id],(err, rows)=>{
      console.log(rows)
      if(rows.affectedRows>0){
          console.log('값 변경 성공!')
          req.session.user.user_name = name
          req.session.user.user_email = git
          req.session.user.user_phone = phone
          req.session.user.user_class = process1
          res.json({msg : 'success'})
      }else{
          console.log('값 변경 실패...')
          res.json({msg : 'failed..'})
      }
    })
    //  3-2) update set 을 이용해서 DB값 변경
    //  3-3) 세션 안에 있는 값 변경 (이름, 주소변경)
    // 4. console.log('값 변경 성공!'), '값 변경 실패'
    //      => 페이지 이동 X 캡쳐해서 단톡방에
    
  })
  
// 회원탈퇴
router.post('/delete_user', (req, res) => {
  console.log('회원아이디',req.body.userId)
  const userId = req.body.userId;
  const query = `UPDATE tb_user SET user_status = 'n' WHERE user_id = ?`;

  conn.query(query,userId, (err, result) => {
    if (err) {
      console.error('Error deleting user: ', err);
      res.status(500).send('Error deleting user');
    } else {
      console.log('User deleted!');
      req.session.destroy()
      res.json('안녕하세요')
      
    }
  });
});
  


// mypage 
router.get('/myteam',(req,res)=>{
  let {user_id} = req.session.user
  let sql =`select A.user_id,  B.party_title, B.user_id, B.party_idx , C.user_name
  from tb_join A inner join tb_party B 
  on A.party_idx = B.party_idx 
  inner join tb_user C
  on B.user_id = C.user_id
  where A.user_id = ?;`
  
  conn.query(sql,[user_id],(err,rows)=>{
    res.render('screen/myteam',{data:rows,obj: req.session.user})
  })
})


router.get("/mypost", (req, res) => {
  const user_id = req.session.user.user_id;
  let sql = `SELECT tb_board.*, tb_user.user_name 
  FROM tb_board 
  INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id 
  WHERE tb_board.b_permit = 'YES' and
  tb_board.user_id = ?
  ORDER BY tb_board.b_idx DESC`;
  conn.query(sql, [user_id], (err, rows) => {
    res.render("screen/mypost", { data: rows, obj: req.session.user });
  });
});
module.exports = router;
