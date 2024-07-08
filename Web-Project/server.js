var express=require("express");
var app=express();
var mysql=require("mysql");
var fileuploader=require("express-fileupload");


app.listen(2000,function(){
    console.log("Server Started!!");
});

//-------
//Database connectivity
var dbConfigurationObj={
  host:"127.0.0.1",
  user:"root",
  password:"",
  database:"project"   //table ka name nahi database ka name dena hai
}
var dbRef=mysql.createConnection(dbConfigurationObj);
dbRef.connect(function(err){
  if(err==null)
      console.log("Connected Successfulllllyyyy");
  else
  console.log(err.toString());
});
//--------

app.use(express.static("public"));// To link css , js files to the server

//To Connect with the index page
app.get("/",function(req,resp){
    var path=__dirname+"/public/index.html";
    resp.sendFile(path);
});

//To connect with the Client-Dash Page
app.get("/dash-client",function(req,resp){
    var path=__dirname+"/public/dash-client.html";
    resp.sendFile(path);
});

//To connect with the CareTaker-Dash Page
app.get("/dash-caretaker",function(req,resp){
    var path=__dirname+"/public/dash-caretaker.html";
    resp.sendFile(path);
});

app.get("/dash-admin",function(req,resp){
    var path=__dirname+"/public/dash-admin.html";
    resp.sendFile(path);
});

app.get("/clients",function(req,resp){
    var path=__dirname+"/public/client-user.html";
    resp.sendFile(path);
});

app.get("/caretakers",function(req,resp){
    var path=__dirname+"/public/caretaker-user.html";
    resp.sendFile(path);
});

app.get("/find-caretaker",function(req,resp){
    var path=__dirname+"/public/caretaker-finder.html";
    resp.sendFile(path);
});


//converts binary to object
app.use(express.urlencoded({extended:true}));


//As we are using AJAX so "get".
app.get("/signup-process-post1",function(req,resp){
    //console.log("hello");
    //console.log(req.query.txtEmail1);

    resp.contentType("text/html");
    // var f=req.query.mailstat;
    // resp.send(f);

    //Saving Record in the table-users
    var dataAry=[req.query.txtEmail1,req.query.txtPass1,req.query.userType];
    dbRef.query("insert into users values(?,?,?,1)",dataAry,function(err){

        ////Doubt--Doubt
        if(req.query.mailstat=="Already Occupied"){
            resp.send("This Mail Id is Already Registered.")
        } else if(err==null){
            resp.send("Signed Up Successfully");
        }else{
            resp.send(err.toString());
        }
    })
});


//As we are using AJAX so "get"
//To Login..
app.get("/login-process-post",function(req,resp){
    resp.contentType("text/html");
    // var f=req.query.mailstat;
    // resp.send(f);

    //Saving Record in the table-users
    var dataAry=[req.query.txtEmail2,req.query.txtPass2];
    dbRef.query("select stat from users where emailid=? and pass_word=?",dataAry,function(err,table){
        if(err!=null){
            resp.send(err.toString());
            //console.log("btao2");
        }
            
        else if(table.length==1){
            //resp.send(table);
            if(table==1){
                resp.send("<b>Login Successful.</b>");
            } else{
                resp.send("<b>Id Blocked</b>");
            }
            //console.log("btao");
        }
            
        else {
            //console.log("btao1");
            resp.send("<b>Invlaid Cridentials.</b>");

        }
    })
});



app.use(fileuploader());

// for profile-client page - to Save data 
app.post("/signup-process-post3",function(req,resp){
    var idPicName="";
    var PPicName="";
    if(req.files==null){
        PPicName="nopic.png";
        idPicName="nopic.png";
    } else{

    


    
    if(req.files.ppic) {

        var fullPath=process.cwd()+"/public/uploads/"+req.files.ppic.name;
        req.files.ppic.mv(fullPath,function(err){
        if(err){
        console.log(err.toString());
        //console.log(err.toString());
        //console.log("hi");
        }
        else
          console.log("Profile Uploaded Successfully with data="+JSON.stringify(req.body));
        })

        PPicName=req.files.ppic.name;

    }
    else{
        PPicName="nopic.png";
    }

    
    if(req.files.idpic) {

        var fullPath1=process.cwd()+"/public/uploads/"+req.files.idpic.name;
    req.files.idpic.mv(fullPath1,function(err){
      if(err)
      console.log(err.toString());
      else
      console.log("Proof Uploaded Successfully with data="+JSON.stringify(req.body));
    })
    
        idPicName=req.files.idpic.name;

    }
    else{
        idPicName="nopic.png";
    }
    }
    

    

    
    
    

    //Saving Record in the table-users
    var dataAry=[req.body.txtEmail,req.body.txtName,req.body.txtCon,req.body.txtAdd,req.body.txtCity,req.body.txtState,req.body.txtPin,PPicName,idPicName,req.body.txtPet];
    dbRef.query("insert into clients values(?,?,?,?,?,?,?,?,?,?)",dataAry,function(err){
        if(err==null){
            resp.send("<b>Saved Successfully<b>");
        }else{
            resp.send(err.toString());
        }
    })

    
});

// for profile-client page - to Update ur data
app.post("/update-process-post3",function(req,resp){
    resp.contentType("text/html");
    // var f=req.query.mailstat;
    // resp.send(f);

    var picName1="";
    var picName2="";

    if(req.files==null)//No File Uploaded during Updation.
    {
        picName1=req.body.hdn1;
        picName2=req.body.hdn2;

        
    } else if(req.files.ppic){
        picName2=req.body.hdn2;
        var fullPath=process.cwd()+"/public/uploads/"+req.files.ppic.name;
    req.files.ppic.mv(fullPath,function(err){
      if(err){
        console.log(err.toString());
        //console.log(err.toString());
        //console.log("hi");
      }
      else
          console.log("Profile Uploaded Successfully with data="+JSON.stringify(req.body));
    });
    picName1=req.files.ppic.name;


    } else if(req.files.idpic){
        picName1=req.body.hdn1;
        var fullPath1=process.cwd()+"/public/uploads/"+req.files.idpic.name;
    req.files.idpic.mv(fullPath1,function(err){
      if(err)
      console.log(err.toString());
      else
      console.log("Proof Uploaded Successfully with data="+JSON.stringify(req.body));
    });
    picName2=req.files.idpic.name;

    }
    else{

        var fullPath=process.cwd()+"/public/uploads/"+req.files.ppic.name;
    req.files.ppic.mv(fullPath,function(err){
      if(err){
        console.log(err.toString());
        //console.log(err.toString());
        //console.log("hi");
      }
      else
          console.log("Profile Uploaded Successfully with data="+JSON.stringify(req.body));
    })

    

    var fullPath1=process.cwd()+"/public/uploads/"+req.files.idpic.name;
    req.files.idpic.mv(fullPath1,function(err){
      if(err)
      console.log(err.toString());
      else
      console.log("Proof Uploaded Successfully with data="+JSON.stringify(req.body));
    })

    picName1=req.files.ppic.name;
    picName2=req.files.idpic.name;
    }
    //Saving Record in the table-users
    var dataAry=[req.body.txtName,req.body.txtCon,req.body.txtAdd,req.body.txtCity,req.body.txtState,req.body.txtPin,picName1,picName2,req.body.txtPet,req.body.txtEmail];
    dbRef.query("update clients set name=?,contact=?,address=?,city=?,state=?,pin=?,profile=?,proof=?,pets=? where emailid=?",dataAry,function(err){
        if(err==null){
            resp.send("<b>Updated Successfully<b>");
        }else{
            resp.send(err.toString());
        }
    })
});

// for profile-client page -> to get data from your database
app.get("/getfromTable",function(req,resp){
    
    dbRef.query("select * from clients where emailid=?",req.query.mail,function(err,table){
    
        if(err!=null)
            resp.send(err.toString());
            
        else    
            resp.send(table);
    })
})

app.get("/checkEmailInTable",function(req,resp){
    dbRef.query("select * from users where emailid=?",req.query.mailid,function(err,table){
        resp.contentType("text/html");
        if(err!=null)
            resp.send(err.toString());
        else if(table.length==1)
            resp.send("<b>Already Occupied</b>")
        else 
            resp.send("<b>Available</b>");
    })
});



//for profile-caretaker page - to Save data
app.post("/signup-caretaker-post",function(req,resp){

    //onsole.log(req.files.size);
    var idPicName="";
    if(req.files!=null){ 
        var fullPath1=process.cwd()+"/public/uploads/"+req.files.idpic.name;
        req.files.idpic.mv(fullPath1,function(err){
        if(err)
        console.log(err.toString());
        else
        console.log("Proof Uploaded Successfully with data="+JSON.stringify(req.body));
        })
        idPicName=req.files.idpic.name;
    } else{//If photo not uploaded.
        idPicName="nopic.png";
    }
    

    //console.log(req.body.txtState);
    

    //Saving Record in the table-users
    var dataAry=[req.body.txtEmail,req.body.txtName,req.body.txtCon,req.body.txtAdd,req.body.txtWeb,req.body.txtCity,req.body.txtState,req.body.txtPin,req.body.txtPet,idPicName];
    dbRef.query("insert into caretaker values(?,?,?,?,?,?,?,?,?,?)",dataAry,function(err){
        if(err==null){
            resp.send("<b>Saved Successfully<b>");
        }else{
            resp.send(err.toString());
        }
    });
});

app.post("/update-caretaker-post",function(req,resp){
    resp.contentType("text/html");
    // var f=req.query.mailstat;
    // resp.send(f);
    var picName2="";

    if(req.files==null) //If photo is not updated
    {
        picName2=req.body.hdn2;
    }
    else{ // Photo is updated
        var fullPath=process.cwd()+"/public/uploads/"+req.files.idpic.name;
        req.files.idpic.mv(fullPath,function(err){
        if(err){
        console.log(err.toString());
        }
        else
            console.log("Proof Uploaded Successfully with data="+JSON.stringify(req.body));
        })
        picName2=req.files.idpic.name;
    }
    //Saving Record in the table-users
    var dataAry=[req.body.txtName,req.body.txtCon,req.body.txtAdd,req.body.txtWeb,req.body.txtCity,req.body.txtState,req.body.txtPin,req.body.txtPet,picName2,req.body.txtEmail];
    dbRef.query("update caretaker set name=?,contact=?,address=?,website=?,city=?,state=?,pin=?,selpets=?,proofpic=? where emailid=?",dataAry,function(err){
        if(err==null){
            resp.send("<b>Updated Successfully<b>");
        }else{
            resp.send(err.toString());
        }
    })
});

app.get("/getfromCareTakerTable",function(req,resp){
    
    dbRef.query("select * from caretaker where emailid=?",req.query.mail,function(err,table){
    
        if(err!=null)
            resp.send(err.toString());
            
        else    
            resp.send(table);
    })
});


//----Angular
app.get("/fetch-all-users-angular",function(req,resp){
    dbRef.query("select * from users",function(err,table){
        if(err!=null){
            resp.send(err.toString());
        } else{
            resp.send(table);
        }
    })
})

app.get("/do-block-this-user-angular",function(req,resp){
    var dataAry=[req.query.xEmail]; //primary key
  
    dbRef.query("update users set stat=0 where emailid=?",dataAry,function(err,result){
      if(err!=null){
        resp.send(err.toString());
      } else if(result.affectedRows==1)
      resp.send("Blocked Successfully");
      else
      resp.send("Invalid Id");
    })
})

app.get("/do-resume-this-user-angular",function(req,resp){
    var dataAry=[req.query.xEmail]; //primary key
  
    dbRef.query("update users set stat=1 where emailid=?",dataAry,function(err,result){
      if(err!=null){
        resp.send(err.toString());
      } else if(result.affectedRows==1)
      resp.send("UnBlocked/Resumed Successfully");
      else
      resp.send("Invalid Id");
    })
})


//Client-User
app.get("/fetch-all-clients-angular",function(req,resp){
    dbRef.query("select * from clients",function(err,table){
        if(err!=null){
            resp.send(err.toString());
        } else{
            resp.send(table);
        }
    })
})

app.get("/do-delete-client-angular",function(req,resp){
    var dataAry=[req.query.xEmail]; //primary key
  
    dbRef.query("delete from clients where emailid=?",dataAry,function(err,result){
      if(err!=null){
        resp.send(err.toString());
      } else if(result.affectedRows==1)
      resp.send("Deleted successfullyyyyyyy");
      else
      resp.send("Invalid Id!!!");
    })
})

//---- CAretaker
app.get("/fetch-all-caretakers-angular",function(req,resp){
    dbRef.query("select * from caretaker",function(err,table){
        if(err!=null){
            resp.send(err.toString());
        } else{
            resp.send(table);
        }
    })
})

app.get("/do-delete-caretaker-angular",function(req,resp){
    var dataAry=[req.query.xEmail]; //primary key
  
    dbRef.query("delete from caretaker where emailid=?",dataAry,function(err,result){
      if(err!=null){
        resp.send(err.toString());
      } else if(result.affectedRows==1)
      resp.send("Deleted successfullyyyyyyy");
      else
      resp.send("Invalid Id!!!");
    })
})

//-----Caretaker-Finder ,  Fetch cities
app.get("/fetch-cities-angular",function(req,resp){
    dbRef.query("select distinct city from caretaker",function(err,table){
      if(err!=null){
        resp.send(err.toString());
      } else{
        resp.send(table);
      }
    })
});

//---fetch caretaker cards
app.get("/fetch-caretakers-angular",function(req,resp){
    dbRef.query("select * from caretaker",function(err,table){
      if(err!=null){
        resp.send(err.toString());
      } else{
        resp.send(table);
      }
    })
});
