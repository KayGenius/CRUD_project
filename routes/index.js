const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const url = 'https://connect.aischool.o-r.kr/';


router.get("/", (req, res) => {
  res.render('screen/login')
  console.log(url)
});

// 페이징 라우터 추가
router.get("/page/:pageNumber", async (req, res) => {
  if (!req.session.user) {
    res.send(`<script>alert("로그인을 해주세요!!!");location.href="${url}"</script>`);
    return;
  }
  const pageNumber = parseInt(req.params.pageNumber, 12);
  
  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).send("Invalid page number");
  }
  
  const postsPerPage = 12;
  const offset = (pageNumber - 1) * postsPerPage;

  let totalPostCount, totalPages;
  try {
    totalPostCount = await getTotalPostCount();
    totalPages = Math.ceil(totalPostCount / postsPerPage); 
  } catch (err) {
    console.error(err);
    return res.status(500).send("데이터베이스 에러");
  }

  let sql = `
      SELECT tb_board.*, tb_user.user_name 
      FROM tb_board 
      INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id 
      WHERE tb_board.b_permit = 'YES'
      ORDER BY tb_board.b_idx DESC
      LIMIT ?, ?
    `;

    
    
  conn.query(sql, [offset, postsPerPage], (err, rows) => {
    res.render("screen/main", { data: rows, obj: req.session.user, totalPages: totalPages });
  });
});

// 총 게시물 수 반환 함수 추가
function getTotalPostCount() {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(b_idx) as postCount FROM tb_board WHERE b_permit = 'YES'";
    conn.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].postCount);
      }
    });
  });
}

// 그룹원 검색
router.post('/user_search',(req,res)=>{
  console.log('유저이름',req.body.user_name)
  let {user_name} = req.body
  console.log(user_name)
  let sql = `select user_id, user_class from tb_user where user_name = ?;`
  conn.query(sql,[user_name],(err,rows)=>{
    if(rows[0]==undefined){
      res.json('아이디가 존재하지 않네요😥')
    }else{
       console.log(rows[0].user_id,rows[0].user_class)
       res.json({ search : rows });
    }
  })
})

router.post('/increment_likes', (req, res) => {
  const post_idx = req.body.post_idx;
  const user_id = req.body.user_id;

  // 사용자의 좋아요를 관리하는 세션 설정
  if (!req.session.likes) {
    req.session.likes = {};
  }

  // 이미 좋아요를 누른 사용자 확인
  if (req.session.likes[user_id] && req.session.likes[user_id].includes(post_idx)) {
    res.status(400).send("이미 좋아요 누른 사용자입니다.");
    return;
  }

  // 좋아요 증가 로직
  const updateLikesSql = "UPDATE tb_board SET b_likes = b_likes + 1 WHERE b_idx = ?";
  conn.query(updateLikesSql, [post_idx], (err, result) => {
    // 에러 처리
    if (result.affectedRows > 0) {
      // 좋아요가 성공적으로 적용되면 사용자의 세션에 좋아요 정보 추가
      if (!req.session.likes[user_id]) {
        req.session.likes[user_id] = [];
      }
      req.session.likes[user_id].push(post_idx);
      res.status(200).send("좋아요 추가 완료!");
    } else {
      res.status(404).send("해당 게시물이 없습니다.");
    }
  });
});

// 검색 기능
router.post('/search',(req,res)=>{
  console.log(req.body.content)
  const search = req.body.content

  let sql = `SELECT a.*, b.user_name FROM tb_board a INNER JOIN tb_user b ON a.user_id = b.user_id WHERE a.b_title LIKE '%${search}%' OR a.b_content LIKE '%${search}%' OR b.user_name LIKE '%${search}%' OR a.b_type LIKE '%${search}%' AND a.b_permit = 'YES' order by a.created_at desc;`

  conn.query(sql,[search],(err, rows)=>{
   res.render('screen/main', { data:rows , obj: req.session.user })
  })
})

// 카테고리 프로젝트 별 모음 기능
router.get('/project',(req,res)=>{
  let sql = `SELECT tb_board.*,tb_user.user_name FROM tb_board INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id WHERE tb_board.b_permit = 'YES' and SUBSTRING_INDEX(b_category, ',', 1) = '["프로젝트"';`
  conn.query(sql,(err, rows)=>{
    res.render('screen/main', { data:rows , obj: req.session.user })
   })

})
// 카테고리 스터디 별 모음 기능
router.get('/study',(req,res)=>{
  let sql = `SELECT tb_board.*,tb_user.user_name FROM tb_board INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id WHERE tb_board.b_permit = 'YES' and SUBSTRING_INDEX(b_category, ',', 1) = '["스터디"';`
  conn.query(sql,(err, rows)=>{
    res.render('screen/main', { data:rows , obj: req.session.user })
   })
})
// 카테고리 공모전 별 모음 기능
router.get('/Competition',(req,res)=>{
  let sql = `SELECT tb_board.*,tb_user.user_name FROM tb_board INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id WHERE tb_board.b_permit = 'YES' and SUBSTRING_INDEX(b_category, ',', 1) = '["공모전"';`
  conn.query(sql,(err, rows)=>{
    res.render('screen/main', { data:rows , obj: req.session.user })
   })
})
// 카테고리 게시판 별 모음 기능
router.get('/boardpan', (req, res) => {
  let sql = `SELECT tb_board.*,tb_user.user_name FROM tb_board INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id WHERE tb_board.b_permit = 'YES' and b_type = "자유게시판";`
  conn.query(sql,(err, rows)=>{
    res.render('screen/main', { data:rows , obj: req.session.user })
   })
})



// 회원가입 중복체크 기능
router.post('/user/dup_check', (req, res) => {
  console.log(req.body.userId)
  let {userId} = req.body;

  let sql = `select user_id from tb_user where user_id = ?;`

  conn.query(sql,[userId],(err, rows)=>{
     res.json(rows.length)
   
   })
})

// 회원가입 번호인증 기능
router.post('/user/phone_check', (req, res) => {
  console.log(req.body.userPhone)
  let {userPhone} = req.body;

  let sql = `select user_phone from tb_user where user_phone = ?;`

  conn.query(sql,[userPhone],(err, rows)=>{
     res.json(rows.length)
   
   })
})



router.get("/join", (req, res) => {
  res.render("screen/join");
});

router.get("/write", (req, res) => {
  if (!req.session.user) {
    res.send(`<script>alert("로그인을 해주세요!!!");location.href="${url}"</script>`);
    return;
  }
  res.render("screen/write", { obj: req.session.user });
});

router.delete('/deletePost/:postIdx', (req, res) => {
  const postIdx = req.params.postIdx;

  // SQL 쿼리를 사용하여 게시물 삭제
  const sql = 'UPDATE tb_board SET b_permit = "NO" WHERE b_idx = ?';
  conn.query(sql, [postIdx], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('데이터베이스 에러');
    }
    if (result.affectedRows > 0) {
      res.status(200).send('성공적으로 삭제되었습니다.');
    } else {
      res.status(404).send('해당 게시물이 없습니다.');
    }
  });
});


router.get('/screen/login', (req, res) => {
  res.render('/screen/login')
})

router.get("/detail", (req, res) => {
  if (!req.session.user) {
    res.send(`<script>alert("로그인을 해주세요!!!");location.href="${url}"</script>`);
    return;
  }
  // req.query에서 post_idx 값 가져오기
  const post_idx = req.query.a;

  // 쿼리 문자열에_idx가 없을 경우 오류 메시지 출력
  if (!post_idx) {
    return res.status(400).send("Invalid request: post_idx is required.");
  }

  // 세션에 viewedPosts 객체가 없 경우 초기화
  if (!req.session.viewedPosts) {
    req.session.viewedPosts = {};
  }

  if (!req.session.viewedPosts[post_idx]) {
    // post_idx에 해당하는 게시글의 조회수 1 증가
    let updateViewsSql =
      "UPDATE tb_board SET b_views = b_views + 1 WHERE b_idx = ?";
    conn.query(updateViewsSql, [post_idx], (err, result) => {
      if (err) {
        // 오류 처리
        console.error(err);
        return res.status(500).send("Database error");
      }

      // 해당 글에 대한 조회수를 이미 증가시켰음을 표시
      req.session.viewedPosts[post_idx] = true;

      // 조회수 업데이트 후 게시글 가져오기
      getPostDetail(post_idx, req, res);
    });
  } else {
    // 이미 조회한 글인 경우 조회수 증가 없이 게시글 가져오기
    getPostDetail(post_idx, req, res);
  }
});

// 댓글 수를 가져오는 함수 추가
function getCommentCount(post_idx) {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(cmt_content) as commentCount FROM tb_comment WHERE b_idx = ?";
    conn.query(query, [post_idx], (err, results, fields) => {
      if (err) {
        reject(err);
      } else { 
        resolve(results[0].commentCount);
      }
    });
  });
}

// 게시글 가져오는 함수를 수정하여 작성자 이메일도 함께 가져옴
async function getPostDetail(post_idx, req, res) {
  let selectPostSql = `
    SELECT tb_board.*, tb_user.user_name, tb_user.user_email 
    FROM tb_board
    INNER JOIN tb_user ON tb_board.user_id = tb_user.user_id
    WHERE tb_board.b_permit = 'YES' AND tb_board.b_idx = ?
  `;
  conn.query(selectPostSql, [post_idx], async (err, rows) => { // async를 추가합니다
    if (err) {
      // 오류 처리
      console.error(err);
      return res.status(500).send("데이터베이스 에러");
    }

    if (rows.length === 0) {
      // 해당 게시글이 없을 경우 오류 메시지 출력
      return res.status(404).send("해당게시글이 없습니다.");
    }
    // 댓글 수를 가져옴
    let commentCount;
    try {
      commentCount = await getCommentCount(post_idx);
    } catch (err) {
      console.error(err);
      return res.status(500).send("데이터베이스 에러");
    }

    let selectCommentSql = `
      SELECT tb_comment.*, tb_user.user_name
      FROM tb_comment
      INNER JOIN tb_user ON tb_comment.user_id = tb_user.user_id
      WHERE tb_comment.b_idx = ?
      ORDER BY tb_comment.created_at ASC
    `;
    conn.query(selectCommentSql, [post_idx], (err, comments) => {
      if (err) {
        console.error(err);
        return res.status(500).send("데이터베이스 에러");
      }

      // 게시글 데이터와 댓글 데이터와 댓글 수를 detail 템플릿으로 전달
      res.render("screen/detail", {
        data: rows,
        obj: req.session.user || null,
        comments: comments,
        commentCount: commentCount,
      });
    });
  });
}

// 댓글 작성
router.post("/addComment", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send(`<script>alert('로그인을 해주세요!!');
    location.href="${url}"</script>`);
  }

  const post_idx = req.body.post_idx;
  const userid = req.session.user.user_id;
  const content = req.body.content;

  console.log(req.body.content);

  if (!post_idx || !content) {
    return res.status(400).send("글ID가 옳지 않습니다.");
  }

  let insertCommentSql = `
  INSERT INTO tb_comment (b_idx, cmt_content,created_at,user_id)
  VALUES (?, ?,NOW() ,?)
  `;
  conn.query(insertCommentSql, [post_idx, content,userid], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("데이터베이스 에러");
    }
    res.redirect("/detail?a=" + post_idx);
  });
});



// 그룹 만드는 라우터
router.get('/teammake',(req,res)=>{
  res.render("screen/teammake", { obj: req.session.user });
})

router.post('/teammake',(req,res)=>{
    let {group_title,group_desc} = req.body
    let {user_id} = req.session.user
    console.log(user_id)    
    let sql = "insert into tb_party (party_title,party_desc,user_id,created_at,party_status)values (?,?,?,now(),1);"
    let sql_idx ='SELECT LAST_INSERT_ID() AS room_idx;'
    let sql_leader = "insert into tb_join (user_id,party_idx,joined_at) values(?,?,now())"
    conn.query(sql,[group_title,group_desc,user_id],(err, rows)=>{
      console.log("그룹방마들기",rows)
      conn.query(sql_idx,(err,rows)=>{
        console.log("그룹방번호",rows[0].room_idx)
        let room_idx = rows[0].room_idx
        res.render('screen/teaminvite',{data:rows[0].room_idx})
        conn.query(sql_leader, [user_id, room_idx], (err, rows) => {
          console.log("방장추가됨",rows)
            
          })
      
      })
     })
})

router.post('/teaminvite',(req,res)=>{
  console.log(req.body)
  let {user_id,group_idx} = req.body
  let sql = "insert into tb_join (user_id,party_idx,joined_at)values (?,?,now());"
  let sql_select ='select user_id from tb_join where user_id = ?'
  conn.query(sql,[user_id,group_idx],(err,rows)=>{
    conn.query(sql_select,[user_id],(err,rows)=>{
      console.log(rows[0])
      if(rows[0] == undefined){
        res.json("1")
      }else{
      res.json(rows[0].user_id)}
    })
  })
  
})

//채팅방 개설 
  //채팅창 만들기
  router.get('/chatmake',(req,res)=>{
    res.render("screen/chatmake")
})



module.exports = router;
