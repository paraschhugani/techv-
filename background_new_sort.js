console.log("background new sort script loaded, this works every time the broweser is ran!");
//alert("PREPARE TO BE HUMBLED AND WEEP BY GLORY OF MY BRAIN!");
//------------------------------------------------------------------------------------------------
var currentWebsite;
var generalpid;
var currentProductId;
var site_counter=3; //number of sites available in database
var tab_id;
let site_logos = {"amazon":"https://images-na.ssl-images-amazon.com/images/G/01/rainier/available_at_amazon_1200x600_Nvz5h2M.png",
"flipkart":"https://logos-download.com/wp-content/uploads/2016/09/Flipkart_logo-700x185.png",
"croma":"https://www.dealsfreak.com/wp-content/uploads/thumbs_dir/Croma-1vodbtwe96jtyh7tduobg4l7dptsz31t25aku0jiu2p0.png"}
var sites_final = []; 
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
var sites_final = new Object(); // as sites have all sites, but site link may not have all sites due to aviblity. see get stuff
//------------------------------------------------------------------------------------------------
// SEQUENCE WISE EXECUTION OF FUNCTIONS
function get_stuff(){
    console.log("executing get_stuff!");
    try{ // just to avoid any unknown errors
    chrome.tabs.getSelected(null, function(tab) {
        var url = tab.url;
        console.log(tab.url,url);
        var currentWebsite = "null"
        if(url.match(/flipkart/gm) == "flipkart"){
            currentWebsite = "flipkart";
            var currentProductId = url.match(/[\?]pid=[a-zA-Z0-9]+/gm)[0]; //[?]pid=[a-zA-Z0-9]+
            currentProductId = currentProductId.replace("?pid=","").replace("&","");
            console.log(currentProductId);
            }
        else if(url.match(/amazon/gm) == "amazon"){
            currentWebsite = "amazon";
            var currentProductId = url.match(/[\/][B][0][A-Z0-9]+/gm)[0].replace("B", "").replace("/","");//[\/][B]+[^a-zA-Z][a-zA-Z0-9]+
            //currentProductId = currentProductId[0].replace("B", "");
            console.log(currentProductId);
             }
        else if (url.match(/croma/gm) == "croma"){
              currentWebsite = "croma";
              var currentProductId = url.match(/p[^a-zA-Z][a-zA-Z0-9]+/gm)[0];
              currentProductId = currentProductId.replace("p/","");
              console.log(currentProductId);
             }
        else if (currentWebsite == "null"){
            currentProductId= "null";
            console.log("you dont need us right now !!!");
             } 
        if(currentWebsite != "null"){  // works only for the given sites above, 
        //NOTE: without this it  will keep loading the last opened data, which can be used later
        //------------------------------------------------------------------------------------------------
        //  CALLING OTHER FUCNTIONS INSIDE IT 
        console.log("calling other fucntions");
        // otherCalls(currentWebsite,currentProductId);
        otherCalls(currentWebsite,currentProductId);
        //------------------------------------------------------------------------------------------------
        }
        else{
            //do something, NOTE: maybe clear the siteLink list or keep it updating to show it to user
        }
    });
    }
    catch(err){
        console.log("an error may have occured in the get_stuff function. which is ", err);
    };
}
function otherCalls(cuw,cup){ // cuw is current website, cup is current pid
    console.log("executing otherCalls!");
    console.log(cuw,cup);
    get_HTML_Price(cuw,cup);  
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
    x.open('GET', "https://techvani.pythonanywhere.com/gget?id="+link+","+site);
    x.onload = function() {
        console.log(JSON.parse(x.response));
        //sendMessage(tab_id,convert_JSON(x.response));
        convert_JSON(JSON.parse(x.response));
    };
    x.send(); 
}
//------------------------------------------------------------------------------------------------
function convert_JSON(obj){
    // converts object to array, for use in content script
    console.log("executing convert_ JSON!!!");
    var price1;
    var price2;
    var message = [];
    var hidden = "block"; // normal condition, thus it views
    for(var site in obj){
        var hidden = "block"; // normal condition, thus it views
        console.log(obj[site]);
        for(var element=0;element<=obj[site].length;element++){
            if( obj[site][element]==""){
                //due to some server side error, or for an unexisting element, it wont show
                hidden = "none";
            }
        }
        if(obj[site][2] == "" || obj[site][2] == " "){
             price2 = 9999999; // if the price is empty, it will set it to 10 million, which is just too big
             price1 = "no price available";
            //continue // skips adding that product, if price isnt available
        }
        else{
            price1 = obj[site][2].replace(".00","");
            price2 = obj[site][2].replace(",","")//.match(/[0-9]+[^.]\d/gm)[0];//.replace(".","")
            price2 = Number(price2);
        }
            message.push([price2,hidden,site_logos[site],price1,obj[site][1]]);
        
        
    }
    message = message.sort();
    sendMessage(tab_id,message);   
}
//------------------------------------------------------------------------------------------------
function sendMessage(tabId,arr){
    /*
    *@param {int} tab The tab method of chrome to get its id, or use a random int 
    *@param {object} obj The object that hold the site name, link and price
    */
    console.log("executing sendMessage!");
    arr.sort();
    //obj["check"] = true;  // for the content script side check, only required for content side execution 
    console.log(arr);
    chrome.tabs.sendMessage(tabId,arr);
    console.log("message sent");
    //obj["check"] = false;
}
//------------------------------------------------------------------------------------------------
//--------------------------------- DO NOT SEE ---------------------------------------------------
function Sender_array(obj){
    var webdiv_croma = `<div class="moreDiv" id="cromaDiv" style="background-color: #ffd31d;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://www.dealsfreak.com/wp-content/uploads/thumbs_dir/Croma-1vodbtwe96jtyh7tduobg4l7dptsz31t25aku0jiu2p0.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="cromaPrice" class="pr-btn defaultPrice">Rs `+obj["croma"][2]+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="cromaButton"  role="button" target="_blank" href=`+obj["croma"][1]+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`
    setPrice([webdiv_croma,obj["croma"][1],obj["croma"][2]]);

    var webdiv_flipkart = `<div class="moreDiv" id="flipkartDiv" style="background-color: #f96d80;">
            <img  id="first-pic" class="pic-btn default-pic" src="https://logos-download.com/wp-content/uploads/2016/09/Flipkart_logo-700x185.png" alt="">
            <div class="default-pr-btn fl-rt">
            <span id="flipkartPrice" class="pr-btn defaultPrice"> Rs `+obj["flipkart"][2]+`</span>
            <a class="btn fl-rt pr-btn pic-btn defaultButton" id="flipkartButton"  role="button" target="_blank" href=`+obj["flipkart"][1]+`><div class="defaultBtnText">Go to store
            
            </div></a>
            </div>
            </div>`
    setPrice([webdiv_flipkart,obj["flipkart"][1],obj["flipkart"][2]]);        
}
function sort_old(arr){
    for(var iterations = 0;iterations<=arr.length-1;iterations++){
        for(var i=0;i<=arr.length-2;i++){
            if(arr[i][3]>arr[i+1][3]){
                var swap = arr[i];
                arr[i]=arr[i+1]; // not [3] but whole to swap the whole element 
                arr[i+1] = swap; // this arr[i+1] holds the original value of arr[i]
            }
        }
    }
}
//------------------------------------------------------------------------------------------------
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