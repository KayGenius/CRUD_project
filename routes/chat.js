const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const io = require("socket.io-client")
const url = 'https://connect.aischool.o-r.kr/'



//채팅방 개설하기
router.post('/chatroom_create',(req,res)=>{
    let {title} = req.body
    let {user_name} = req.session.user
    console.log("제목",title)
    let room_idx;
    let sql = `insert into tb_chatroom (room_title,room_desc,user_id,created_at,room_type)values(?,'채팅방입니다',?,now(),1)` //채팅방 만들기
    let sql_room = `insert into tb_chatpeople (room_people,created_at,room_idx,chat_status,user_name)values(?,now(),?,1,?);`
    let selectQuery = 'SELECT LAST_INSERT_ID() AS room_idx;'
    conn.query(sql,[title,req.session.user.user_id],(err,rows)=>{   //채팅방 만드는 db실행
        
        //채팅방이 만들어지면서 room_idx생성
        conn.query(selectQuery,(err,rows_number)=>{ //만든 채팅방의 room_idx를 chatcreate_title로 보내준다.
            room_idx = rows_number[0]
            console.log("들어가는건가",rows_number[0])
            res.json(rows_number[0])
            console.log("룸인덱스",room_idx)
            conn.query(sql_room,[req.session.user.user_id,room_idx.room_idx,user_name],(err,rows)=>{ //채팅방을 만든 후 개설자도 chatpeople 테이블에 들어간다.
                console.log("작동하냐",rows)
        
            })
        })       
    })
})


//채팅방 초대 화면 보내주기  
router.get('/chatinvite:id',(req,res)=>{   //채팅방 개설 후 초대화면, params 통해 room_idx를 chatcreate_title에게 받아온다.
     chatroom_idx =  req.params.id //방번호
    res.render('screen/chatinvite',{params:chatroom_idx})   //room_idx를 chatcreate_inv에게 보내줌
    
})


//채팅방 초대하기
router.post('/chat_inv',(req,res)=>{
      
        console.log("채팅방번호",req.body.room_idx)
        console.log("채팅초대할인원",req.body.invite)
    let {room_idx} =req.body    
    let {invite} = req.body
    let invitesql = "insert into tb_chatpeople (room_people,created_at,room_idx,chat_status,user_name)values(?,now(),?,1,?);"
    let sql = "select * from tb_user where user_id = ?"          
    conn.query(sql,[invite,room_idx],(err,rows)=>{  //검색한 유저를 db에서 불러온다.
           //채팅방 초대할 인원 user 테이블에서 가져오기
           console.log("에러 되냐",rows[0])
        if(rows[0]==undefined){ res.json("1") //해당하는 회원이 없다
        
        }else{   
            console.log("1")         
            res.json(rows[0].user_id)   //불러온 유저를 chatcreate_inv.html로 보내준다. 이유는 검색결과를 표시하기 위함
            console.log("여기까지 되냐",rows[0])
            conn.query(invitesql,[invite,room_idx,rows[0].user_name],(err,rows)=>{    //chatpeople 테이블에 참가자 추가
                console.log("초대되냐",rows)            
            })}
        })
    })

//채팅방 개설 후 추가로 초대하기
router.post('/chatroom_inv',(req,res)=>{

let {room_idx,user_id} = req.body
let sql = "insert into tb_chatpeople (room_people,created_at,room_idx,chat_status,user_name)values(?,now(),?,1,?);"
let sql_inv ="select * from tb_user where user_id = ?"
conn.query(sql_inv,[user_id],(err,rows)=>{
    if(rows[0] == undefined){ res.json("1")}
    else{   res.json(rows)

        conn.query(sql,[user_id,room_idx,rows[0].user_name],(err,rows)=>{
            
        })

}})





})




//채팅방 나가기
router.post('/exit',(req,res)=>{
    console.log('나가기',req.body.room_idx,req.session.user.user_id)
    let {room_idx} =req.body
    let {user_id} = req.session.user
    let sql = `update tb_chatpeople set chat_status = 0 where room_idx =? and room_people = ?;` 
    conn.query(sql,[room_idx,user_id],(err,rows)=>{

    })



})


//실시간 채팅기능
const ENDPOINT = url; //io의 endpoint 를 잡아서 넣는다.
  let socket;
  socket = io(ENDPOINT); // Socket.IO 라이브러리를 사용하여 서버와의 연결을 설정하는 부분입니다. 클라이언트는 이렇게 서버의 ENDPOINT로 소켓 연결을 시도하게 됩니다.
  




//채팅방목록 쏴주기
router.get('/',(req,res)=>{
    //내 아이디가 있는 room_people 을 where로 주고 그중 room_idx를 가져온다. 
//가져온 room_idx를 chatroom 과 inner조인해서 출력된 select 값을 채팅방 목록에 띄워준다.
    let {user_id} = req.session.user
   
        let sql = `select room_title,room_desc,DATE_FORMAT(A.created_at, '%Y-%m-%d %p %h:%i') as created_at,room_people,
        B.room_idx from tb_chatroom as A left outer join tb_chatpeople as B on A.room_idx = B.room_idx where B.room_people = ? and B.chat_status = 1 `
    //chatroom 과 chatpeople 를 조인함. 내 아이디가 참가한 모든 채팅방을 불러온다.
    conn.query(sql,[user_id],(err,rows)=>{  //불러온 채팅방을 chat.html에 보내준다.
        console.log(rows)
        res.render('screen/chat',{data:rows})


    })
})


//채티방 내용 보내주기
router.post("/message", (req, res) => { 
         
    let  {room_idx,user_id} = req.body
    console.log("채팅방 방번호",room_idx)
    console.log("아이디",user_id)
    let sql = `select A.talker as talker,user_name,talk,DATE_FORMAT(A.talked_at,'%m/%d/%Y, %l:%i %p') as talked_at,room_idx 
    from tb_talk as A left outer join tb_user as B on A.talker = B.user_id where  room_idx = ? order by talked_at` //채팅방을 누르면 채팅방에 해당하는 모든 대화목록을 쏴준다.
    let sql_userlist = `select * from tb_chatpeople where room_idx= ? and chat_status = 1`
    conn.query(sql,[room_idx],(err,rows)=>{
        console.log("내용불러오기1111",rows)
            conn.query(sql_userlist,[room_idx],(err,userlist)=>{
                    const data = {
                        rows:rows,
                        user:userlist
                    }
                    console.log("내용불러오기",rows)
                    res.json(data)
            })
     
     
      
      
    })
});


//채팅방 내용 저장
router.post("/save", (req, res) => {
    

    // socket.emit('connection2',{talk:req.body.talk,userid:req.session.user.id}); //socket를 써서 서버로 채팅내용 보내기 실시간
    socket.emit('connection2',{talk:req.body.talk,userid:req.session.user.user_id, username:req.session.user.user_name}); //socket를 써서 서버로 채팅내용 보내기 실시간
  
    let{room_idx} =req.body
    let {user_id} = req.session.user
    let {talk} = req.body
    console.log("내가누른 방번호:",room_idx,"토커:",user_id,"대화내용:",talk)
        let sql = `insert into tb_talk(talker,talk,talked_at,room_idx) values(?,?,now(),?)` //채팅창에서 전송을 눌러 tb_talk에 대화내용 저장한다.
    conn.query(sql,[user_id,talk,room_idx],(err,rows)=>{ 
            console.log("저장되는거",rows.affectedRows)
     })  
  }
  );


 


module.exports = router;