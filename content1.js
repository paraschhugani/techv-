console.log("content script 1 ran!!!");
chrome.runtime.onMessage.addListener(receivedMessage);
function receivedMessage(message,sender,response){
  console.log(message);
  console.log("message was ", message);  // sorting price wise
  for(var iterations = 0;iterations<=message.length-1;iterations++){
      for(var i=0;i<=message.length-2;i++){
          if(message[i][3]>message[i+1][3]){
              var swap = message[i];
              message[i]=message[i+1]; // not [3] but whole to swap the whole element 
              message[i+1] = swap; // this message[i+1] holds the original value of message[i]
          }
      }
  }
  console.log("message is ", message);

  let currentsite = document.domain;
  if (currentsite =="www.amazon.in"){
    let pricediv = "#price";
    loadingcontent(pricediv);
  }
  if(currentsite =="www.flipkart.com"){
    let pricediv = "#container > div > div._3Z5yZS.NDB7oB._12iFZG._3PG6Wd > div.ooJZfD._3FGKd2 > div.ooJZfD._2oZ8XT.col-8-12 > div:nth-child(2) > div > div._3iZgFn";
    loadingcontent(pricediv);
  }
  if(currentsite =="www.croma.com"){
    let pricediv = "#V01PPMM010302 > div.col-xs-12.col-sm-12.col-md-12.col-lg-12";
    loadingcontent(pricediv);
  }
  function loadingcontent(pricediv){
  try{
  let flipPrice = document.querySelector(pricediv)
  let sty = document.createElement('style');
  sty.innerHTML = `.techvaniedit
  { height: 180px; width: 340px; padding: 0; }
  #techvanilogo{ margin-left: 60px; margin-bottom: 12px;}
  #techvani{ color: white; font-size: 30px; margin-right: 75px;}
  .navbar { border-radius: 40px;}
  .amazonDiv{ border-radius: 40px; margin-bottom: 5px; border-bottom: 1px dashed #e0e0e0 ; background-color: green; animation-name: example; animation-duration: 2s; animation-iteration-count: infinite; }@keyframes example { 0% {background-color: yellow;} 25% {background-color: green;transform: scale(1.1);} 50% {background-color: yellow;transform: scale(1.0);} 75% {background-color: green;transform: scale(1.1);} 100% {background-color: yellow;transform:scale(1.0);} }.flipkartDiv{ margin-top: 5px; margin-bottom: 5px; border-bottom: 1px dashed #e0e0e0 ; transition: transform 300ms ease-in-out 0s;}.flipkartDiv:hover{ transform: scale(1.1);}.cromaDiv{ margin-top: 5px; margin-bottom: 5px; border-bottom: 1px dashed #e0e0e0 ; transition: transform 300ms ease-in-out 0s;}.cromaDiv:hover{ transform: scale(1.1);}#am-pic{ width: 90px; height: 40px;}#amazon{ margin-top: 4px; font-size: 20px; float: left; color: rgba(26,26,26,0.87); font-weight: 500;}#amazonP{ padding: 10px 7px; margin-left: 5px; font-weight: 500; font-size: 13px; text-transform: uppercase; cursor: pointer; text-align: center; border-radius: 25px; background-color: #f5b042; border-color: #f5b042; color: white;}#flipkart{ margin-top: 4px; font-size: 20px; float: left; color: rgba(26,26,26,0.87); font-weight: 500;}#flipkartP{ padding: 8px 7px; margin-left: 5px; font-weight: 500; font-size: 13px; text-transform: uppercase; cursor: pointer; text-align: center; border-radius: 25px; margin-bottom: 5px; background-color: #ff6c00; border-color: #ff6c00; color: white;}#fl-pic{ width: 85px; height: 40px; margin-left: 5px;}#croma{ margin-top: 4px; font-size: 20px; float: left; color: rgba(26,26,26,0.87); font-weight: 500;}#cromaP{ padding: 8px 7px; margin-left: 5px; font-weight: 500; font-size: 13px; text-transform: uppercase; cursor: pointer; text-align: center; margin-bottom: 5px; border-radius: 25px; background-color: #bd1e2d ; border-color: #bd1e2d ; color: white;}#cr-pic{ width: 85px; height: 40px; margin-left: 5px;}.pic-btn{ display: inline-block; position: relative; cursor: pointer;}.pr-btn{ position: relative;}.fl-rt{ float: right;}`
  flipPrice.innerHTML = '<div class="techvaniedit"> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"> <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #000000;width:340px;height:50px;"> <img id="techvanilogo"src="https://www.festivalclaca.cat/imgfv/m/54-540653_500-instagram-logo-icon-gif-transparent-png-insta.png" alt="" style="width:47px;height:35px;"> <h1 id="techvani">Techvani</h1><!--most important for prices do not remove--> </nav> <div id="onlineplatform"> <div class="amazonDiv"> <img id="am-pic" class="pic-btn" src="https://images-na.ssl-images-amazon.com/images/G/01/rainier/available_at_amazon_1200x600_Nvz5h2M.png" alt=""> <div class="am-pr-btn fl-rt"> <span id="amazon" class="pr-btn">price</span> <a class="btn fl-rt pr-btn pic-btn" id="amazonP" role="button">Go to store</a> </div> </div> <div class="flipkartDiv"> <img id="fl-pic" class="pic-btn" src="https://logos-download.com/wp-content/uploads/2016/09/Flipkart_logo-700x185.png" alt=""> <div class="fl-pr-btn fl-rt"> <span id="flipkart" class="pr-btn">price</span> <a class="btn fl-rt pr-btn pic-btn" id="flipkartP" role="button">Go to store</a> </div> </div> <div class="cromaDiv"> <img id="cr-pic" class="pic-btn" src="https://www.dealsfreak.com/wp-content/uploads/thumbs_dir/Croma-1vodbtwe96jtyh7tduobg4l7dptsz31t25aku0jiu2p0.png" alt=""> <div class="cr-pr-btn fl-rt"> <span id="croma" class="pr-btn">price</span> <a class="btn fl-rt pr-btn pic-btn" id="cromaP" role="button">Go to store</a> </div> </div> </div> </div>'
  let headi = document.querySelector("head")
  headi.appendChild(sty)
  document.getElementsByClassName("_3hSwtk").onclick = function(){
    document.querySelector("body").style.backgroundColor = "green";
  };
  for(var site=0;site<=message.length-1;site++){
    console.log("rank is ",message[site]);
    console.log("site is ",message[site][0]);
    console.log("link ",message[site][1]);
    console.log("button id is  ",message[site][0]+"P");
    document.getElementById(message[site][0]).innerHTML = message[site][2] ; //price
    document.getElementById(message[site][0]+"P").addEventListener('click', function(){  //button link
    window.open(message[site][1],"_blank");
    },false);
  }
  // document.getElementById("amazon").innerHTML = message["amazon"][1] ;
  // document.getElementById("amazonP").addEventListener('click', function(){
  //   window.open(message["amazon"][0],"_blank");
  // },false);
  // document.getElementById("croma").innerHTML = message["croma"][1] ;
  // document.getElementById("cromaP").addEventListener('click', function(){
  //   window.open(message["croma"][0],"_blank");
  // },false);

  }
catch(err){
    alert("got this error loadind content on  "+currentsite+ "  :"+err);
            }
    }
}
  
// function sex(){
// try{

// url = document.url;


// changeofurl();
// function changeofurl(){

//   currentUrl = document.url;
//   if(currentUrl != url){
//     alert("change of url");
//     url = currentUrl;
//   }
//   setTimeout(changeofurl(),120);
// }
// }
// catch(err){
//   alert(err);
//   sex();
// }
// }

// sex();






