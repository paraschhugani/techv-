document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('ex-btn');
  checkPageButton.addEventListener('click', checkme(),false);
  function checkme(){

    var amazon = document.getElementById("am-btn");
    amazon.addEventListener('click',function(){
        window.open('https://amazon.in/s/','_blank');
        document.getElementById('twotabsearchtextbox').value = searchItem;
        document.getElementById('nav-search-submit-text').click();
        var results = document.getElementById('resultsCol').value;
        var someElement = document.createElement("someElement");
        someElement.appendChild(document.createTextNode(resultsFromAmazon1));
        //li.setAttribute("id", "element4"); // added line keep id in number to use for loop
        fetchElementplace.appendChild(someElement);
        
    },false);
    

  }

},false);