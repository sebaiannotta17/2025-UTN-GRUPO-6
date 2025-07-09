function setValue(element) {
	document.getElementById("inputValue").innerHTML = element.value;
	
	//$("#inputValue").html($("#input").val());
}

function increment() {
	var actual = parseInt(document.getElementById("counter").innerHTML);

	actual++;

	document.getElementById("counter").innerHTML = actual;
// 	var counter = $("#counter");

// 	var actual = parseInt(counter.html());
// 	actual++;

// 	counter.html(actual);
}

$(document).ready(function() {
	$.ajax({
		url: "https://blockchain.info/ticker",
		method: "GET",
		dataType: "json",
		success: function(response) {
			bitcoinInfo(response);
		},
		error: function(req, status, err) {
			showError();
		}
	});
	
	// var request = fetch("https://blockchain.info/ticker");
	// request.then((response) => response.json())
	// 	.then((r) => {
	// 		bitcoinInfo(r);
	// 	})
	// 	.catch(() => {
	// 		showError();
	// 	});
});

function bitcoinInfo(currencies) {
	var html = '<ul>';

	for (currency in currencies) {
		html += '<li>' + currencies[currency].symbol + ': ' + currencies[currency].last.toFixed(2) + '</li>';
	}

	html += '</ul>';

	document.getElementById('btc').innerHTML = html;
	//$("#btc").html(html);
}

function showError() {
	var html = '<div style="color: #F00">Ha ocurrido un error al traer el precio del BTC.</div>';

	document.getElementById('btc').innerHTML = html;
	//$("#btc").html(html);
}