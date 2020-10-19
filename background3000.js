console.log("background script loaded, this works every time the broweser is ran!");
//alert("PREPARE TO BE HUMBLED AND WEEP BY GLORY OF MY BRAIN!");
//------------------------------------------------------------------------------------------------
var currentWebsite;
var generalpid;
var currentProductId;
var site_counter=3; //number of sites available in database
var tab_id;
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
        if (currentWebsite == "null"){
            currentProductId= "null";
            console.log("you dont need us right now");
            } 
        else if(currentWebsite == "flipkart"){
            var currentProductId = url.match(/[?]pid=[a-zA-Z0-9]+/gm);
            currentProductId = currentProductId[0].currentProductId[0].split("?pid")[0];
            console.log(currentProductId);
            }
        else if(currentWebsite == "amazon"){
            var currentProductId = url.match(/[B]+[^a-zA-Z][a-zA-Z0-9]+/gm);
            currentProductId = currentProductId[0].split("B")[0];
            console.log(currentProductId);
             }
        else if (currentWebsite == "croma"){
          var currentProductId = url.match(/p[^a-zA-Z][a-zA-Z0-9]+/gm);
          currentProductId = currentProductId[0].replace("p/","");
          console.log(currentProductId);
             }
    } catch(err){
        console.log(err);
    }
        // console.log(currentWebsite);
        // if(currentWebsite != "null"){  // works only for the given sites above, 
        // //NOTE: without this it  will keep loading the last opened data, which can be used later
        // for(var gpidKey in db[currentWebsite]){
        //     if(db[currentWebsite][gpidKey][0]==currentProductId){ // checks it that pid key it opened has the current pid in it
        //         generalpid = gpidKey; // sets the general product id
        //         console.log(generalpid);
        //         break;
        //     }
        // }
    
        //------------------------------------------------------------------------------------------------
        //  CALLING OTHER FUCNTIONS INSIDE IT 
        console.log("calling other fucntions");
        //otherCalls();
        get_HTML_Price(currentWebsite,currentProductId);

        //------------------------------------------------------------------------------------------------
    
   
    })
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
function get_HTML_Price(site,cpid){
    /*
    *@param {str} site_name the name of function, that which applies regex ( genreally same as the site name)
    *@param {str} link  link of the site page to fetch  
    */
    console.log("executing get_html_price!");
    var x = new XMLHttpRequest();
    console.log(cpid);
    x.open('GET', "https://techvani.pythonanywhere.com/gget2?id="+cpid+","+site);
    x.onload = function() {
        // console.log(typeof x.response);// alert to give every time there is a login made or new chrome is opne
         console.log(x.response);
         //sendMessage(tab_id,JSON.parse(x.response))
        
    };
    x.send(); 
}
//------------------------------------------------------------------------------------------------
//  THIS SECTION CONTAINS ALL THE REGULAR EXPRESSIONS
function amazon(html1,link){
    try{
        console.log("executing regex amazon!");
        html = html1; // thus we can delete the origirnal response pages, to reduce the size
        price = html.match(/"priceblock_ourprice"[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z]*[a-z]*[^a-z][^a-z]*/gm);
        price = price[0].match(/[>][^a-z]*[^</]/);
        price = price[0].replace(">","");//₹
        price2 = price.replace("₹","");// other var as price is fro users, easy to read 
        price2 = price2.replace(",",""); // price2 is for sorting
        price2 = price2.match(/[0-9]+[^.]\d/gm);
        price2 = Number(price2);
        //for(var i =0;i<=1000;i++); // time loop, remove this if unnecessary.
        console.log("price is ",price);
        setPrice(["amazon",link,price,price2]);
    }    
    catch(err){
            console.log("error in amazon as " +err);
            //alert("error in Amazon_regex2_2 as " +err)
           // console.log("recurring...");
            //amazon()
        }
}
function flipkart(html1,link){
    try{
        console.log("executing regex flipkart!");
        html = html1;
        price = html.match( /"_1vC4OE _3qQ9m1"[>][^a-z]+[<]/gm);
        price = price[0].match(/[>][^a-z]*[^</]/);
        price = price[0].replace(">","");//₹
        price2 = price.replace("₹","");// other var as price is fro users, easy to read 
        price2 = price2.replace(",",""); // price2 is for sorting
        price2 = price2.match(/[0-9]+[^.]\d/gm);
        price2 = Number(price2);
        //for(var i =0;i<=1000;i++); // time loop, remove this if unnecessary.
        console.log("price is ",price);
        setPrice(["flipkart",link,price,price2]);
    }    
    catch(err){
            console.log("error in flipkart as " +err);
            //alert("error in Amazon_regex2_2 as " +err)
            //console.log("recurring...");
            //flipakrt();
        }
}
function croma(html1,link){
    try{
        console.log("executing regex croma!");
        html = html1;
        price = html.match(/"pdpPrice"[>][^a-zA-Z]*[<]/gm);
        price = price[0].match(/[>][^a-z]*[^<]/);
        price = price[0].replace(">","");//₹
        price2 = price.replace("₹","");// other var as price is fro users, easy to read 
        price2 = price2.replace(",",""); // price2 is for sorting
        price2 = price2.match(/[0-9]+[^.]\d/gm);
        price2 = Number(price2);
        //for(var i =0;i<=1000;i++); // time loop, remove this if unnecessary.
        console.log("price is ",price);
        setPrice(["croma",link,price,price2]);
    }    
    catch(err){
            console.log("error in croma as " +err);
            //alert("error in Amazon_regex2_2 as " +err)
            //console.log("recurring...");
            //croma();
        }
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