'use strict';

angular.module('customers').filter('totalItems', function () {
  return function(lineItems){
		var count = 0;

		lineItems.forEach(function(line){
			count = count + line.quantity;
		})

		return count;
  }	
})
.filter('statusColor', function(){
	return function(status){
		var color;

		switch(status){
			case "Paid":
				color = "green";
				break;
			case "Open":
				color = "yellow";
				break;
			case "Complete":
				color = "green";
				break;
			case "Cancelled":
				color = "red";
				break;
		}

		return color;
	}
})
