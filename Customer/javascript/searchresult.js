

var no_of_pro,temp_data;

fetch('./allpro.json').then(response=>response.json())
.then(data=>{
  temp_data=data;
  no_of_pro=data.length;
  if(no_of_pro==0){
    if(confirm("No Pro Are available for Such Skill.\n Show All The Avialable proFessionals.")){
      window.location.replace('/pro?search=all');
    }
    else{

    }

  }
  else{
    console.log(temp_data[0].pro_id);
    printl();
  }
  
})


function printl(){
  if(no_of_pro==0){

  }
  else{
    var i=0;
    const database=firebase.database();
    const storage=firebase.storage();
    
    while(i<no_of_pro){
             var temp=document.getElementsByTagName('template')[0];

            var id=temp.content.querySelector(".container");
            
            var clon=document.importNode(id,true);

            clon.className=".container"+i;
            clon.id=".container"+i;

            
            
           
            console.log(i);

            
            document.getElementById('con').appendChild(clon);

           
            
            clon.childNodes.forEach((x)=>{
              if(x.nodeType==Node.ELEMENT_NODE){
                  
                   x.childNodes.forEach((y)=>{
                      if(y.nodeName=="IMG"){
                        
                          database.ref("Professional/pro"+temp_data[i].pro_id+"/details").on('value',function(snapshot){
                            console.log(snapshot.val());
                            y.setAttribute('src',snapshot.val().Imgurl);
                            
                          })
                      }
                      if(y.nodeName=="H1"){
                          y.textContent=temp_data[i].Name;
                          console.log(document.getElementsByClassName(""+clon.className)[0].setAttribute('data-name',temp_data[i].Name));
                          console.log(document.getElementsByClassName(""+clon.className)[0].setAttribute('data-id',temp_data[i].pro_id));
                      }
                      if(y.nodeName=="H2"){
                        
                         y.textContent=temp_data[i].Skill;
                          
                      }
                      if(y.nodeName=="DIV"){
                        
                        y.childNodes.forEach((t)=>{
                          if(t.nodeType==Node.ELEMENT_NODE){
                            if(t.nodeName=="SPAN"){

                              var msg="";
                              if(temp_data[i].aboutme.length>10){
                                
                                  msg=msg+temp_data[i].aboutme;
                                
                              }
                              
                              t.textContent=msg+"...";
                              
                            }
                          }
                        });
                       
                      }
                  });
              }
          });
            i++;
    }
  }
}

function classname(obj){
    
    window.location.replace("propage/user?id="+document.getElementsByClassName(obj.className)[0].getAttribute('data-id')+"&name="
  +document.getElementsByClassName(obj.className)[0].getAttribute('data-name'));
}



