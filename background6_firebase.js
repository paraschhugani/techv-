console.log("background script loaded, this works every time the broweser is ran!");
//alert("PREPARE TO BE HUMBLED AND WEEP BY GLORY OF MY BRAIN!");
//------------------------------------------------------------------------------------------------
// Initialize Firebase
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
function doSomething(tab){
    console.log("clicked!!! at tab ", tab);
    //tab_id = tab.id;// for  hrome.browserAction.onClicked.addListener(doSomething) ie button click execution
    tab_id = tab; // for on message from content script execution
    console.log("tab id is ",tab_id);
    get_stuff(); //works with db and current website initalls
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
        if (currentWebsite == "null"){
            currentProductId= "null";
            console.log("you dont need us right now");
            } 
        else if(currentWebsite == "flipkart"){
            var currentProductId = url.match(/[?]pid=[a-zA-Z0-9]+/gm);
            currentProductId = currentProductId[0].replace("?pid=","");
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
        if(currentWebsite != "null"){  // works only for the given sites above, 
        //NOTE: without this it  will keep loading the last opened data, which can be used later
            for(var gpidKey in db[currentWebsite]){
                if(db[currentWebsite][gpidKey][0]==currentProductId){ // checks it that pid key it opened has the current pid in it
                    generalpid = gpidKey; // sets the general product id
                    console.log(generalpid);
                    // amazonPriceLoad(generalpid);
                    // flipkartPriceLoad(generalpid);
                    // cromaPriceLoad(generalpid);
                    functionCalls(); //     NOTE IF THIS DOESNT WORK ADD A PARAM GPID
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
function functionCalls(){
    /* 
    * calls the functions to get data from database
    */
    console.log("executing functionCalls!");
    amazonPriceLoad(generalpid);
    flipkartPriceLoad(generalpid);
    cromaPriceLoad(generalpid);
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
// FIREBESE PART. NOTE ADD NEW FUNCTIONS HERE AND CALL IN FUCNTIONCALLS.
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
            setPrice(["flipkart",link,price,price2]);
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
            setPrice(["amazon",link,price,price2]);
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
            setPrice(["croma",link,price,price2]);
        }
    }).catch(function(error){
        alert(error);
    })
}
//------------------------------------------------------------------------------------------------

