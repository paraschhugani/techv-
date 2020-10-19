console.log("background script loaded, this works every time the broweser is ran!");
//alert("PREPARE TO BE HUMBLED AND WEEP BY GLORY OF PRIYAM MEHTA'S BRAIN!");
//------------------------------------------------------------------------------------------------
var webdiv;
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
  var ft = firebase.firestore();
//------------------------------------------------------------------------------------------------
var currentWebsite;
var generalpid;
var currentProductId;
var site_counter=3; //number of sites available in database
var tab_id;
var siteList
//------------------------------------------------------------------------------------------------
// The main function, where every other function runs or is called
//chrome.browserAction.onClicked.addListener(doSomething)  // sedns a tessage to all the listening js, uncomment this for onclick action
chrome.runtime.onMessage.addListener(receivedMessage);
function receivedMessage(message,sender,response){
    console.log(message,sender.tab.id);
    doSomething(sender.tab.id);
 }
//try{
function doSomething(tab){
    console.log("clicked!!! at tab ", tab);
    //tab_id = tab.id;// for  hrome.browserAction.onClicked.addListener(doSomething) ie button click execution
    tab_id = tab; // for on message from content script execution
    console.log("tab id is ",tab_id);
    get_stuff(); //works with db and current website initalls
    // The for loop extracts site name and link from sitelink and passes it as argument ot get_HTML()   
    //sendMessage(tab,sites_final);
}

//------------------------------------------------------------------------------------------------
var siteLink = new Object();
var sites_final = []; // as sites have all sites, but site link may not have all sites due to aviblity. see get stuff
//------------------------------------------------------------------------------------------------
// SEQUENCE WISE EXECUTION OF FUNCTIONS
function get_stuff(){
    console.log("executing get_stuff!");
    try{ // just to avoid any unknown errors
    chrome.tabs.getSelected(null, function(tab) {
        var url = tab.url;
        var currentWebsite = "null"

        for (var site in db){
            if(site == url.match(new RegExp(site,"i"))){ 
                currentWebsite = site;
                break;
        }}
        try{
            console.log(currentWebsite);
        if (currentWebsite == "null"){
            currentProductId= "null";
            console.log("you dont need us right now");
            } 
        else if(currentWebsite == "flipkart"){
            var currentProductId = url.match(/[?]pid=[a-zA-Z0-9]+/gm);
            currentProductId = currentProductId[0].split("?pid=")[1];
            console.log(currentProductId); 
            }
        else if(currentWebsite == "amazon"){
            var currentProductId = url.match(/[B]+[^a-zA-Z][a-zA-Z0-9]+/gm);
            currentProductId = currentProductId[0].replace("B", "");
            console.log(currentProductId);
             }
        else if (currentWebsite == "croma"){
          var currentProductId = url.match(/p[^a-zA-Z][a-zA-Z0-9]+/gm);
          currentProductId = currentProductId[0].replace("p/","");
          console.log(currentProductId);
             }
        else if (currentWebsite == "paytm" || currentWebsite == "paytmmall"){
          currentProductId = "paytm";
          console.log(currentProductId);
        }
        }
        catch(err){
            console.log("error in site detection by var CurrentWebsite is : ", err);
        }
        if(currentWebsite != "null"){  // works only for the given sites above, 
        //NOTE: without this it  will keep loading the last opened data, which can be used later
            for(var gpidKey in db[currentWebsite]){
                if(db[currentWebsite][gpidKey][0]==currentProductId){ // checks it that pid key it opened has the current pid in it
                    generalpid = gpidKey; // sets the general product id
                    console.log(generalpid);
                    amazonPriceLoad(generalpid);
                    flipkartPriceLoad(generalpid);
                    cromaPriceLoad(generalpid);
                    paytmPriceLoad(generalpid);
                    break;
                    }
            }
        }
    }); 
    }   
    catch(err){
        console.log("an error may have occured in the get_stuff function. which is ", err);
    };
}
function otherCalls(){
    console.log("executing otherCalls!");
    for(var site in siteLink){
        console.log("site is ",site);
        console.log(siteLink[site]);
        get_HTML_Price(site,siteLink[site]);  
    }
}
//------------------------------------------------------------------------------------------------
// This section contains fucntions for functions making requests to web pages
function get_HTML_Price(site,link){
    /*
    *@param {str} site_name the name of function, that which applies regex ( genreally same as the site name)
    *@param {str} link  link of the site page to fetch  
    */
    console.log("executing get_html_price!");
    var x = new XMLHttpRequest();
    x.open('GET', link);
    x.onload = function() {
        // console.log(typeof x.response);// alert to give every time there is a login made or new chrome is opne
         console.log(x.response);
        if(site == "amazon"){
            amazon(x.response,link);
           // delete x.response
        }
        else if(site == "flipkart"){
            flipkart(x.response,link);
            //delete x.response
        }
        else if(site == "croma"){
            croma(x.response,link);
            //delete x.response
        }
    };
    x.send(); 
}
//------------------------------------------------------------------------------------------------
// Final parts
function setPrice(arr){
    /*
    *@param {arr} arr the array value that regex function/s returns
    */
   console.log("executing setPrice!");
    console.log(arr);
    sites_final.push([arr[0],arr[1],arr[2],arr[3]]);
    console.log("sites_final is ",sites_final);
    console.log("site counter is ", site_counter);
    console.log("sites final length",sites_final.length );
    if(sites_final.length == site_counter){
        console.log("tab id is ",tab_id);
        sendMessage(tab_id,sites_final);
        console.log("sendMessage(tab,sites_final);");
        site_counter=3;
        //delete sites final, as next time the script is ran its is overwritten 
        
            };
    //sendMessage();     
}
function sendMessage(tabId,obj){
    /*
    *@param {int} tab The tab method of chrome to get its id, or use a random int 
    *@param {object} obj The object that hold the site name, link and price
    */
    console.log("executing sendMessage!");
    obj["check"] = true;  // for the content script side check, only required for content side execution 
    chrome.tabs.sendMessage(tabId,obj);
    console.log("message sent");
    del(obj);
}
//------------------------------------------------------------------------------------------------
function del(arr){
    /* 
    @param {object} arr The object to delete 
    delets everything in the sites final object
    */
    for(var site in arr){
        // delete arr[site]; // for obejct
        arr.pop(); // for array
    }
    console.log("deleted !!!");
}
//------------------------------------------------------------------------------------------------
// FIREBESE PART
function flipkartPriceLoad(generalpid){
    var flio = "flipkart";
    const priceid = (flio.concat("/").concat(generalpid));
    const f = ft.doc(priceid);
    f.get().then(function(doc){
        if (doc && doc.exists){
            const myData = doc.data();
            const price = myData.price ;
            const link = myData.link;
            var price2 = price.replace(",",""); // price2 is for sorting
            price2 = Number(price2);

            var webdiv = `<div class="moreDiv" id="flipkartDiv" style="background-color: #f96d80;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://logos-download.com/wp-content/uploads/2016/09/Flipkart_logo-700x185.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="flipkartPrice" class="pr-btn defaultPrice"> Rs `+price+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="flipkartButton"  role="button" target="_blank" href=`+link+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`
            setPrice([webdiv,link,price,price2]);
        }
    }).catch(function(error){
        alert(error);
    })
}
function amazonPriceLoad(generalpid){
    var flio = "amazon";
    const priceid = (flio.concat("/").concat(generalpid));
    const f = ft.doc(priceid);
    f.get().then(function(doc){
        if (doc && doc.exists){
            const myData = doc.data();
            const price = myData.price ;
            const link = myData.link;
            var price2 = price.replace(",",""); // price2 is for sorting
            price2 = Number(price2);
            // alert("price :"+pi+"  and link :  " + link)

            var webdiv = `<div class="moreDiv" id="amzonDiv" style="background-color: #ffd31d;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://images-na.ssl-images-amazon.com/images/G/01/rainier/available_at_amazon_1200x600_Nvz5h2M.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="amazonPrice" class="pr-btn defaultPrice">Rs `+price+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="amazonButton"  role="button" target="_blank" href=`+link+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`


            setPrice([webdiv,link,price,price2]);
            
        }
    }).catch(function(error){
        alert(error);
    })
}
function cromaPriceLoad(generalpid){
    var flio = "croma";
    const priceid = (flio.concat("/").concat(generalpid));
    const f = ft.doc(priceid);
    f.get().then(function(doc){
        if (doc && doc.exists){
            const myData = doc.data();
            const price = myData.price ;
            const link = myData.link;
            var price2 = price.replace(",",""); // price2 is for sorting
            price2 = Number(price2);
            // alert("price :"+pi+"  and link :  " + link)

            var webdiv = `<div class="moreDiv" id="cromaDiv" style="background-color: #ffd31d;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://www.dealsfreak.com/wp-content/uploads/thumbs_dir/Croma-1vodbtwe96jtyh7tduobg4l7dptsz31t25aku0jiu2p0.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="cromaPrice" class="pr-btn defaultPrice">Rs `+price+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="cromaButton"  role="button" target="_blank" href=`+link+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`
            setPrice([webdiv,link,price,price2]);
        }
    }).catch(function(error){
        alert(error);
    })
}
function paytmPriceLoad(generalpid){
    var flio = "paytm";
    const priceid = (flio.concat("/").concat(generalpid));
    const f = ft.doc(priceid);
    f.get().then(function(doc){
        if (doc && doc.exists){
            const myData = doc.data();
            const price = myData.price ;
            const link = myData.link;
            var price2 = price.replace(",",""); // price2 is for sorting
            price2 = Number(price2);

            var webdiv = `<div class="moreDiv" id="flipkartDiv" style="background-color: #f96d80;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://logos-download.com/wp-content/uploads/2016/09/Flipkart_logo-700x185.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="flipkartPrice" class="pr-btn defaultPrice"> Rs `+price+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="flipkartButton"  role="button" target="_blank" href=`+link+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`
            setPrice([webdiv,link,price,price2]);
        }
    }).catch(function(error){
        alert(error);
    })
}
//------------------------------------------------------------------------------------------------