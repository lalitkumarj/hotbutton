
$(document).ready(function(){

	myFunction = function(val){
		console.log("col"+(val))
		div_string = "<p> New row</p>"
		id = "col"+val
		$("#id").append($(div_string));    	
	}	
    var i=1;
	
    $("#add_cand").click(function(){
	// button = "<button onclick=myFunction("+i+") class=button id=but"+i+">Add post</button>"

	button = ""
	// $("#but" + i).click(function(){
	// 	console.log("Eric it's printing")
	// 	});

	this_string = "<div class=left-floater id=col"+i+">"+ button  + "</div>"
	//new_string = "<div ng-controller='StudentListController' class=left-floater><ul><li ng-repeat='student in students'><a ng-href='/student/view/{{student.id}}'>{{student.name}}</a></li></ul><button ng-click=insertTom()>Insert Tom</button></div>"
	$(".float-wrap").append($(this_string));
	i++;

	curr_width = $(".float-wrap").width()
	$(".float-wrap").width(curr_width + 102) 
	
    });

    

});
