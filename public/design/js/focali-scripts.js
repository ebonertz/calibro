//Hompage Slider
$(function() {
    $('.hero').unslider({
    	speed: 500,               //  The speed to animate each slide (in milliseconds)
    	delay: 5000,              //  The delay between slide animations (in milliseconds)
    	dots: true,               //  Display dot navigation
    	fluid: true              //  Support responsive design. May break non-responsive designs
    });
});

$('#price-range').noUiSlider({
		start: [ 0, 500 ],
		connect: true,
		range: {
			'min': 0,
			'max': 500
		}
	});
	$('#price-range').Link('lower').to($('#range-number-min'), null, wNumb({
		decimals: 0
	}));
	$('#price-range').Link('upper').to($('#range-number-max'), null, wNumb({
		decimals: 0
	}));

//Add class checked to radio button

$('.radio-price').click(function() {
	$('.radio-price').removeClass('checked');
	$(this).addClass('checked');
});
$('#price-filter .clearfilter').click(function() {
	$('.radio-price').removeClass('checked');
	return false;
});


$('select').on('change', function() {
  $(this).addClass('active');
});
//Checkboxes styles
$('input[type=checkbox]').click(function() {
	$(this).parent('label').toggleClass('checked');
})
$('.clearfilter').click(function() {
	$(this).parent('div').find('label').removeClass('checked');
	$(this).parent('div').find('input[type=checkbox]').attr('checked', false);
	return false;
});

$(function() {
$('#show-filters').click(function() {
	$('.filters').toggleClass('expand');
	var text = $(this).text();
	$(this).text(
	text == "Show Filters" ? "Hide Filters" : "Show Filters");
	return false;
	});
});

$('.thumbnail-wrapper').click(function() {
	$('.thumbnail-wrapper').removeClass('active');
	var url = $(this).data('url');
	$('.img-big img').fadeOut();
		setTimeout(function(){
		$('.img-big img').attr('src', url);	
		$('.img-big img').fadeIn();
		
		},500);
	$(this).addClass('active');
	return false;
});
function addItem() {
	$('#item-amount').val( Number($('#item-amount').val()) + 1 );
}
function removeItem() {
	if($('#item-amount').val() =='1'){
		$('#item-amount').val('1');
	} else {
	$('#item-amount').val( Number($('#item-amount').val()) - 1 );
	}
}


//Tabs
$('.tab').click(function() {
	var target = $(this).data('tab');
	var openthis = '#' + target;
	$('.tab').removeClass('active');
	$('.tab-content').removeClass('active');
	$(openthis).addClass('active');
	$(this).addClass('active');
	return false;
});

//Cart
$('.product-row').each(function() {
	var unitPrice = $('.product-price', $(this)).text();
	$('.item-total', $(this)).text(unitPrice);
});

//Calculations
function totalsCalc() {
var totals = 0;
$(".item-total").each(function() {
    var value = $(this).text().replace('$', '');
    totals +=  parseFloat(value);
    console.log(totals.toFixed(2));
    if(!isNaN(value) && value.length != 0) {
    $('td#sub-amount, #price-total').text('$' + totals.toFixed(2));
    } else {
     $('td#sub-amount, #price-total').text('$0');
    }
});
}
//Do initial Cart calculation 
$(document).ready(totalsCalc);
//Sum unit price 
$('.edit-quantity #more').each(function(){
		
		$(this).click(function() {
			var thisUnitPrice = $(this).parents('.product-row').children('.product-price').text().replace('$', '');
			var currentTotal = $(this).parents('.product-row').children('.item-total').text().replace('$', '');
			var newTotal = (Number(parseFloat(currentTotal) + parseFloat(thisUnitPrice)).toFixed(2));
			var route = $(this).parents('.product-row').find('#item-amount');
			$(this).parents('.product-row').children('.item-total').text('$' + newTotal);
			route.val(Number(route.val()) + 1);
			totalsCalc();
		});
});
//Substract item price and stop substracting if it's 1
$('.edit-quantity #minus').each(function() {
		$(this).click(function() {
		var thisUnitPrice = $(this).parents('.product-row').children('.product-price').text().replace('$', '');
		var currentTotal = $(this).parents('.product-row').children('.item-total').text().replace('$', '');
		var newTotal = (Number(parseFloat(currentTotal) - parseFloat(thisUnitPrice)).toFixed(2));
		var itemsAdded = $(this).parents('.edit-quantity').children('#item-amount').val();	
		var route = $(this).parents('.product-row').find('#item-amount');
		if(itemsAdded  == '1'){
			return false;
		} else {
			
			$(this).parents('.product-row').children('.item-total').text('$' + newTotal);
			route.val(Number(route.val()) - 1);
			totalsCalc();
		}	
	});
});

//Just to show the effect
$('.remove-from-cart').click(function() {
	$('#sub-amount, #price-total').html('<img src="/images/loading.gif" width=15 height="15" style="margin:0 auto"/>');
	$(this).parents('.product-row').fadeOut(800, function() {
		$(this).remove();
		totalsCalc();
	});
	
	$('.cart-alerts').removeClass('not-showing').text('The product has been removed');
	setTimeout(function() {
		$('.cart-alerts').addClass('not-showing');		
	}, 3000);
	
	return false;
})

$('input.error').focus(function() {
	$(this).removeClass('error');
});

//Addresses
$('.remove-from-list').click(function() {
	$(this).parents('tr').remove();
	return false;
});

//Panels
$('.panel-trigger').click(function() {
	$(this).parents('.ex-panel').toggleClass('active');
	return false;
});

//Blocky Radios
$('.block-radio').click(function() {
	$('.block-radio').removeClass('checked');
	$(this).addClass('checked');
});

//Sticky header
$(function(){
    $(window).scroll(function(){
        // make sure you change 52 to your headers height plus your padding
        if ($(window).scrollTop() > 20) {
            $("#main-header").addClass("sticky");
        } else {
            $("#main-header").removeClass("sticky");
        }
    });
});

//Search
$(function() {
	$('#search-expander').click(function() {
		$('.site-search-wrapper').addClass('showing');
		return false;
	});
	$('#search-close').click(function() {
		$('.site-search-wrapper').removeClass('showing');
		return false;
	});
	
});