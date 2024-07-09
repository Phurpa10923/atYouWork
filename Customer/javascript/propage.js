

window.addEventListener("DOMContentLoaded",()=>{
    var firebaseConfig = {
        apiKey: "AIzaSyCJCDVwBYkSiR4hZ1e_jEDSusIgVKjn2Hg",
        authDomain: "atyourdoor-2182d.firebaseapp.com",
        projectId: "atyourdoor-2182d",
        storageBucket: "atyourdoor-2182d.appspot.com",
        messagingSenderId: "146734259860",
        appId: "1:146734259860:web:3223036ea0524c95f21e81"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var Database=firebase.database();
   
});

//Database ref to both pro and user




                var exist;
                var id;
                var pro_name;//to Check if message is send or not
                //set content in the page
                const img=document.getElementById("profileimg");
                const Name=document.getElementById("name");
                const skill=document.getElementById("skill");
                const aboutme=document.getElementById("aboutme");
                const available=document.getElementById("dot");
                const button=document.getElementById('hirebtn');
                const message=document.getElementById("message");


                document.getElementById("recombox").style.visibility="hidden";
                document.getElementById("result").style.visibility="hidden";
                document.getElementById("hor-line").style.visibility="hidden";
                document.getElementById("body").style.height="100%";
                
                
                //GET Data from JSON file


                

                fetch("../data/userid.json").then((res)=>res.json())
                    .then((data)=>{
                        
                        var userdatabase=firebase.database();
                        userid=data.userid;
                        userdatabase.ref("users/"+data.userid+"/details").once('value',(snapshot)=>{
                            user_name=snapshot.val().Name;
                            
                        })

                });


                //User saved data variable
                var user_name;
                var userid;

                fetch('../data/prodetails.json').then((res)=>res.json())
                .then((data)=>{

                    setTimeout(function(){
                        img.setAttribute('src',data.Imgurl);
                        
                        Name.innerHTML=data.name;
                        pro_name=data.name;
                        skill.innerHTML=data.skill;
                        id=data.proid;
                        aboutme.innerHTML=data.aboutme;
                        aboutme.style.background="white";
                        aboutme.style.animation="none";
                        Name.style.background="white";
                        Name.style.animation="none";

                        skill.style.background="white";
                        skill.style.animation="none";
                    
                        checkRequest(id)
                    },1000);


                    

                })

                const order_tab=document.getElementById("orders-tab");
                

                
               

               

                order_tab.addEventListener('click',function(){
                    order_page.style.visibility='visible';
                    firebase.database().ref("users/"+userid+"/requests").once('value',(snapshot)=>{
                        if(snapshot.exists()){
                                

                            document.getElementById("emptyorders").style.visibility="hidden";
                            snapshot.forEach((snap)=>{
                                        var temp=document.getElementsByTagName('template')[1];

                                        
                                        var id=temp.content.querySelector(".order-list");
                                    
                                        var clon=document.importNode(id,true);
                                        document.getElementById('lists').appendChild(clon);
                                        clon.childNodes.forEach((x)=>{
                                            if(x.nodeType==Node.ELEMENT_NODE){
                                                
                                            if(x.nodeName=="SPAN"){
                                                x.childNodes.forEach((y)=>{
                                                    if(y.nodeName=="SPAN"){
                                                        if(y.className=="u-orderid"){
                                                            y.textContent=snap.key;
                                                        }
                                                        
                                                    }
                                                })
                                               
                                            
                                            }
                                            if(x.nodeName=="DIV"){
                                                x.childNodes.forEach((y)=>{
                                                    y.childNodes.forEach((z)=>{
                                                        if(z.nodeName=="SPAN"){
                                                            if(z.className=="Date"){
                                                                z.textContent=snap.val().date;
                                                            }
                                                            else if(z.className=="Time"){
                                                                z.textContent=snap.val().time;
                                                            }
                                                        }
                                                    })
                                                })
                                               
                                            
                                            }
                                                
                                            }
                                            if(x.nodeName=="DIV"){
                                                if(x.className=="details"){
                                                    
                                                    x.childNodes.forEach((y)=>{
                                                        if(y.nodeName=="SPAN"){
                                                            y.childNodes.forEach((z)=>{
                                                               
                                                                if(z.className=="H_name"){
                                                                    
                                                                    z.textContent=snap.val().Pro_name;
                                                                }
                                                                if(z.className=="duration"){
                                                                    z.textContent=snap.val().duration;
                                                                }
                                                            })
                                                        }
                                                       
                                                    })
                                                }
                                            }
                                            if(x.nodeName=="DIV"){
                                                if(x.className=="order-info"){
                                                    
                                                    x.childNodes.forEach((y)=>{
                                                        if(y.nodeName=="P"){
                                                            if(y.className=="msg"){
                                                                y.textContent=snap.val().message;
                                                            }
                                                           
                                                        }
                                                       
                                                    })
                                                }
                                            }
                                            
                                        })
                            })

                                   
                                
                            
                        }
                        else{
                            document.getElementById("emptyorders").style.visibility="visible";
                        }
                    })
                });
                

                
                

                function checkRequest(id){
                    
                    var checkDatabase=firebase.database();
                    //console.log(id);
                    firebase.database().ref("Professional/pro"+id+"/details").on('value',(snapshot)=>{
                        if(snapshot.exists()){
                            if(snapshot.val().available==true){

                                available.style.background="rgb(100,231,100)";
                                document.getElementById("recombox").style.visibility="hidden";
                                document.getElementById("result").style.visibility="hidden";
                                document.getElementById("hor-line").style.visibility="hidden";
                                document.getElementById("body").style.height="100%";
                                 
                                const r=document.getElementById("reccomendation");
                                while(r.firstChild){
                                    r.firstChild.remove();
                                }
                                //recommendation(id,snapshot.val().skill);
                            }
                            else{
                                available.style.background="red";
                                document.getElementById("recombox").style.visibility="visible";
                                document.getElementById("result").style.visibility="visible";
                                document.getElementById("hor-line").style.visibility="visible";
                                document.getElementById("body").style.height="140vh";
                                recommendation(id,snapshot.val().skill);
                            }
                        }
                        else{
                            console.log("not Present")
                        }

                    })
                    checkDatabase.ref("Professional/pro"+id+"/messages/m"+userid).on('value',(snapshot)=>{

                        exist=snapshot.exists();
                        //console.log(exist);
                        if(exist==true){
                            button.style.background="red";
                            button.innerHTML="Cancel Request";
                        }else{
                            button.style.background="#374446";
                            button.textContent="Hire Me";
                    }
                        
                           
                    })
                    
                }


                function recommendation(id,p_skill){
                    
                    var i=0;
                    firebase.database().ref("Professional").once("value",(snapshot)=>{
                        if(snapshot.exists()){
                            
                            snapshot.forEach(element => {
                                
                                if(element.val().details.available==true&&element.val().details.skill==p_skill){
                                    i++;
                                    var temp=document.getElementsByTagName('template')[0];

                                    var id=temp.content.querySelector(".rec_profile");
                                    
                                    var clon=document.importNode(id,true);
                        
                                    clon.setAttribute('data-proname',element.val().details.name);
                                    clon.setAttribute('data-proid',element.val().details.proid);
                                    document.getElementById('reccomendation').appendChild(clon);
                                    clon.childNodes.forEach((x)=>{
                                      if(x.nodeType==Node.ELEMENT_NODE){
                                          
                                        if(x.nodeName=="IMG"){
                                            console.log(element.val().details.Imgurl);                                            
                                            x.setAttribute('src',element.val().details.Imgurl);
                                        
                                        }
                                      if(x.nodeName=="H3"){
                                          if(x.className=="Name"){
                                            
                                            x.textContent=element.val().details.name;
                                          }
                                          else{
                                            x.textContent=element.val().details.skill;
                                          }
                                          
                                          
                                      }
                                          
                                      }
                                  })
                                }
                                else{
                                    console.log("No");
                                }
                            });
                            if(i==0){
                                
                                document.getElementById("result").textContent=i+" Recommendated Profesional found";
                                document.getElementById("reccomendation").style.visibility="hidden";
                                
                                
                                
                            }
                            else{
                                document.getElementById("result").textContent=i+" Recommendated Profesional found";
                                document.getElementById("reccomendation").style.visibility="visible";
                            }
                            
                            
                        }
                    })
                }
                
                
                function request(obj){

                    console.log(obj.className);
                    window.location.href="/propage/user?id="+document.getElementsByClassName(obj.className)[0].getAttribute('data-proid')+"&name="+document.getElementsByClassName(obj.className)[0].getAttribute('data-proname');
                    //window.location.replace("propage/user?id="+document.getElementsByClassName(obj.className)[0].getAttribute('data-proid')+"&name="+document.getElementsByClassName(obj.className)[0].getAttribute('data-proname'));
                }

               
                



                


                var u_key;
                button.addEventListener('click',function(){

                    var database=firebase.database();   
                    userid=userid;
                    user_name=user_name;   
                    var msg;
                    

                    let date=new Date();

                    var year=date.getFullYear();
                    var month=date.getMonth()+1;
                    var day=date.getDate();

                    console.log(month);

                    var currentdate=day+":"+month+":"+year;
                    var currenttime=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

                    console.log(currentdate+"\n"+currenttime);
                    
                    //console.log(user_name);   
                    if(message.value!=""){
                        msg=message.value;  
                    }
                    else{
                        msg="I want to hire You.";
                    }
                         
                
                    //console.log(msg);
                    if(button.textContent=="Hire Me"){
                       
                        database.ref("Professional/pro"+id+"/details").once('value',(snapshot)=>{
                            if(snapshot.val().available==true){

                                console.log("I am Here"+id);
                                
                                console.log(user_name);
                                var key=firebase.database().ref("users/"+userid+"/requests").push({
                                    Pro_id:id,
                                    Pro_name:pro_name,
                                    accepted:false,
                                    rejected:false,
                                    completed:false,
                                    date:currentdate,
                                    time:currenttime,
                                    duration:0,
                                    message:msg,
                                },(error)=>{
                                    if(error){
                                        console.log(error);
                                    }
                                }).getKey();

                                u_key=key;
                                console.log(id+'\t'+userid);
                                
                                database.ref("Professional/pro"+id+"/messages/m"+userid).set({
                                    H_userid:userid,
                                    H_name:user_name,
                                    message:msg,
                                    accepted:false,
                                    rejected:false,
                                    completed:false,
                                    U_orderid:u_key,
                                    date:currentdate,
                                    time:currenttime
                                
                                    
                                },(error)=>{
                                    if(error){
                                        console.log(error);
                                    }
                                    else{

                                        
                                        
                                        button.style.background="red";
                                        button.innerHTML="Cancel Request";
                                        message.value=null;
                                    }
                                })
                            }
                            else{
                                if(confirm("Pro is not Available. Do you still want to send the Request?")){

                                    var key=firebase.database().ref("users/"+userid+"/requests").push({
                                        Pro_id:id,
                                        Pro_name:pro_name,
                                        accepted:false,
                                        rejected:false,
                                        completed:false,
                                        date:currentdate,
                                        time:currenttime
                                    },(error)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                    }).getKey();
    
                                    u_key=key;

                                    database.ref("Professional/pro"+id+"/messages/m"+userid).set({
                                        H_userid:userid,
                                        H_name:user_name,
                                        message:"I want to Hire you",
                                        accepted:false,
                                        rejected:false,
                                        completed:false,
                                        U_orderid:u_key,
                                        date:currentdate,
                                        time:currenttime
                                    },(error)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        else{
                                            
                                            button.style.background="red";
                                            button.innerHTML="Cancel Request";
                                        }
                                    })
                                }
                                else{
                                    alert("Try Later!!");
                                }
                            }

                        })
                        
                    }
                    else{
                        button.style.background="White";
                        button.innerHTML="Hire Me";
                        database.ref("Professional/pro"+id+"/messages/m"+userid).once("value",(snapshot)=>{
                            var unid=snapshot.val().U_orderid;
                            firebase.database().ref("users/"+userid+"/requests/"+unid).remove();

                        },(error)=>{
                            if(error){
                                console.log(error);
                            }
                        })
                       
                        
                        database.ref("Professional/pro"+id+"/messages/m"+userid).remove();
                        
                
                    }

                    firebase.database().ref("users/"+userid+"/requests/"+u_key).on('value',(snap)=>{
                        if(snap.val().accepted==true&&snap.val().completed==false){
                            button.innerHTML="Accepted";
                            alert("You Request has been Accepted");
                            
                            button.style.background="gray";
                            button.style.color="black";
                            button.disabled=true;
                        }
                        if(snap.val().completed==true){
                            button.style.background="White";

                            alert("You Request has been Completed.\n"+"Duration:"+snap.val().duration);
                            button.innerHTML="Hire Me";
                            button.style.color="white";
                            button.disabled=false;
                        }
                    })
                    
                   
                    
                    
                   
                })








