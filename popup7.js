var firebaseConfig = {
    apiKey: "AIzaSyABDHdwv49ZzrsO490Odsb6gWmRH7JNfUs",
    authDomain: "techvani-proto1.firebaseapp.com",
    databaseURL: "https://techvani-proto1.firebaseio.com",
    projectId: "techvani-proto1",
    storageBucket: "techvani-proto1.appspot.com",
    messagingSenderId: "279904547937",
    appId: "1:279904547937:web:43e550e5d69bc8c36ae620",
    measurementId: "G-6DF1SYNPRK"
  };
  // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);

  var userfinalemail;
  var usernamefinal;
  var userfamilyfinal;

  



document.addEventListener('DOMContentLoaded', function(){




var imgInt = Math.floor(Math.random() * 11);

// document.getElementById("userimg").src = img_scr[imgInt];






  
    var signinDiv = document.getElementById("singinDiv");
    var userinfo = document.getElementById("userinfo");
    var userimg = document.getElementById("userimg");
    var usernameH1 = document.getElementById("usernameH1");

    var familynameH6 = document.getElementById("familynameH6");
  
   

    try{
        chrome.storage.sync.get(['email','username','familyname'], function(result) {
            userfinalemail = result.email;
            usernamefinal = result.username;
            userfamilyfinal = result.familyname;
            if(userfinalemail){
            signinDiv.style.display = "none";
      
            usernameH1.innerHTML = usernamefinal;
     
            familynameH6.innerHTML = " "+userfamilyfinal;
          
            }
            else{
                familynameH6.style.display = "none";
                // usernameH1.style.display = "none";
                usernameH1.innerHTML = "wait motherfucker "+ lodo;
            }

          });
    }catch{}
    
    var googlediv = document.getElementById("googleDiv")
    googlediv.onclick = function(){

        chrome.identity.getAuthToken({
            interactive: true
        }, function(token) {
            if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError.message);
                return;
            }
            var x = new XMLHttpRequest();
            x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
            x.onload = function() {
                // alert(x.response);// alert to give every time there is a login made or new chrome is opne
                var resp =  JSON.parse(x.response);
                chrome.storage.sync.set({email: resp["email"],username: resp["given_name"],familyname: resp["family_name"]}, function() {
            
                  });
                  
                        };
            x.send();
        });
        //the line below can be usesd to get the data of user , but we are using it from response above
        // chrome.identity.getProfileUserInfo(function(info) { email = info.email; username = info.id; familyname = info.family_name;alert(email,username,familyname);});
        
    }
    //the foloowing is code for getting a joke from fire base 
    var ft = firebase.firestore();
    const f = ft.doc("extra/joke");
    f.get().then(function(doc){
        if (doc && doc.exists){
            const myData = doc.data();
            const joke = myData.jokeOfTheDay ;
           document.getElementById("joke").innerText = (`"` +joke+` "`);
            
            

        }
    }).catch(function(error){
        console.log( "got an error" + error );
    })

    // usernameH1.innerHTML = sendRequestToGetUserData().toString();
       

       
       


        
            

            
       
            
              
       
    





})

//---------------------------------------- TESTING FUNCTIONS SECTION -------------------------------------------------
function sendRequestToGetUserData(){
    let user_id = getEmailAndStuff()[0];
    try{
        let y = new XMLHttpRequest();
        y.open('GET', 'https://www.ShopAwesome.pythonanywhere.com/ge?id=' + user[0]);
        y.onload = function() {
                var response = JSON.parse(y.response);       
        }
    }
    catch{};

    return response;
}    
    
function getEmailAndStuff(){
    return_arr = []
    try{
        chrome.storage.sync.get(['email','username','familyname'], function(result) {
            userfinalemail = result.email;
            usernamefinal = result.username;
            userfamilyfinal = result.familyname;
            if(userfinalemail){
                return_arr[0] = userfinalemail;
                return_arr[1] = usernamefinal;
                return_arr[2] = userfamilyfinal;
            }
            else{
                log("error in userfinalemail");
                return_arr[0] = null;
            };
            if(return_arr[0]){  // this coude be merged up directly, but this makes it more clear code
                return return_arr;
            }
            else{
                return null;
            };

        });
        
    }catch{
        log("error in getting email");
    }    
}

function listenForMessages(){
    // document.addEventListener
}
