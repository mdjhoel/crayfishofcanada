var app = angular.module('instantsearch',[]);

app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $httpProvider.defaults.headers.get = {};
});
 
app.controller('instantSearchCtrl',function($scope,$http){
	//$http.get('https://raw.githubusercontent.com/hoelfamily/website/master/data/blog.json').success(function(data, status, headers, config) {
    $http.get('data/blog.json').success(function(data, status, headers, config) {

		$scope.items = data.reverse();

	}).error(function(data, status, headers, config) {
		console.log("No data found..");
  });
});
 
app.filter('searchFor', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		
		angular.forEach(arr, function(item){
			if(item.keywords.toLowerCase().indexOf(searchString) !== -1){
				result.push(item);
			}
		});

		return result;
	};
});

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    //xobj.open('GET', 'https://raw.githubusercontent.com/hoelfamily/website/master/data/blog.json', true);
    xobj.open('GET', 'data/blog.json', true);

    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function getKeywords() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    var doc = document.getElementById("keywords");
    var keywords = "";

    // create Dictionary object and variable to place trimmed value
    var dict = new Object;
    var trimmedkey = "";

    for (i in actual_JSON) {
      temparray = actual_JSON[i].keywords.split(",");
      for (j in temparray) {
      	trimmedkey = temparray[j].trim(); // trim off any spaces
	if (keywords.indexOf(trimmedkey) == -1) {
          keywords = keywords + trimmedkey;
          dict[trimmedkey] = 1;
	 } else {
	   dict[trimmedkey] = dict[trimmedkey] + 1;
	 }
      }
    }

    // Sort the keys for further visual confirmation of ranking
    // Thanks SO - https://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
    //var sorted_keys = Object.keys(dict).sort();
    var sorted_keys = Object.keys(dict).sort(function(a,b){return dict[b]-dict[a]});    

    keywords = "";
    for (var key in sorted_keys) { // go through sorted keys, but get associated count data from original dictionary
      if (sorted_keys.hasOwnProperty(key)) {
      	keywords = keywords + "<span id='keyword'><div class='label label-primary'>" + sorted_keys[key] + "   <span class='badge' style='background-color: white; color:black;'>" + dict[sorted_keys[key]] + "</span></div></span>" 
      } 
    }

    doc.innerHTML = keywords;
 });
 
}
