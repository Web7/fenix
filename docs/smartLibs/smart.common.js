(function () {
	$.fn.exists = function () {
		return this.length !== 0;
	};

	$.fn.isFind = function($_findElement) {
		var $this = $(this);
		var $findElement = $this.find($_findElement);
		return $findElement.exists() ? $findElement : false;
	};

	window.smart = {};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	smart.buildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	smart.strrev = function(string){
		var ret = '', i = 0;
		for ( i = string.length-1; i >= 0; i-- ){
			ret += string.charAt(i);
		}
		return ret;
	};

	smart.number_format = function(number, decimals, decPoint, thousandsSep) {
		decimals = Math.abs(decimals) || 0;
		number = parseFloat(number);

		if (!decPoint || !thousandsSep) {
			decPoint = '.';
			thousandsSep = ',';
		}

		var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
		var numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber;
		var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
		var formattedNumber = "";

		while (numbersString.length > 3) {
			formattedNumber += thousandsSep + numbersString.slice(-3);
			numbersString = numbersString.slice(0, -3);
		}

		if (decimals && decimalsString.length === 1) {
			while (decimalsString.length < decimals) {
				decimalsString = decimalsString + decimalsString;
			}
		}

		return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
	};

	// smart.number_format = function (number, decimals, dec_point, thousands_sep) {
	// 	var i, j, kw, kd, km;
	// 	if (isNaN(decimals = Math.abs(decimals))) {
	// 		decimals = 2;
	// 	}
	//
	// 	if (dec_point === undefined) {
	// 		dec_point = ",";
	// 	}
	//
	// 	if (thousands_sep === undefined) {
	// 		thousands_sep = ".";
	// 	}
	//
	// 	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
	//
	// 	if ((j = i.length) > 3) {
	// 		j = j % 3;
	// 	} else {
	// 		j = 0;
	// 	}
	//
	// 	km = (j ? i.substr(0, j) + thousands_sep : "");
	// 	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	// 	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	// 	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
	//
	// 	return km + kw + kd;
	// };

	smart.array_chunk = function(input, size) {
		for(var x, i = 0, c = -1, l = input.length, n = []; i < l; i++){
			(x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
		}
		return n;
	};

	smart.in_array = function(needle, haystack, strict) {
		var found = false, key, strict = !!strict;

		for (key in haystack) {
			if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
				found = true;
				break;
			}
		}

		return found;
	};

	function is_object(mixed_var) {
		if (mixed_var instanceof Array) {
			return false;
		} else {
			return (mixed_var !== null) && (typeof( mixed_var ) === 'object');
		}
	}
	
	smart.isObject = function (obj) {
		if (obj instanceof Array) {
			return false;
		} else {
			return (obj !== null) && (typeof( obj ) === 'object');
		}
	};

	smart.getCookie = function (name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	smart.getSalePrice = function (itemArray) {
		if (!itemArray || !is_object(itemArray)) {
			return {'salePrice': 0, 'price': 0, 'stockPrice': 0};
		}

		var salePrice = itemArray.salePrice;
		var stockPrice = itemArray.stockPrice;
		var currencyType = itemArray.currencyType;

		var selectCurrency = smart.getCookie('selectCurrency') || smart.defaultCurrency;
		var rate = smart.currenciesByCode[selectCurrency].rate;
		var itemCurrency = smart.currenciesById[currencyType];

		switch (itemCurrency.codeCurrency) {
			case smart.defaultCurrency:
				salePrice = salePrice / rate;
				stockPrice = stockPrice / rate;
				break;
			case selectCurrency:
				salePrice = salePrice * 1;
				stockPrice = stockPrice * 1;
				break;
			default:
				salePrice = (salePrice * itemCurrency.rate) / rate;
				stockPrice = (stockPrice * itemCurrency.rate) / rate;
				break;
		}

		var price = salePrice;
		salePrice = smart.number_format(salePrice, 0, ',', '.') + " " + selectCurrency;
		stockPrice = smart.number_format(stockPrice, 0, ',', '.') + " " + selectCurrency;
		return {'salePrice': salePrice, 'price': price, 'stockPrice': stockPrice};
	};

	// $(document).on('copy cut', function(e){
	// 	if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		return false;
	// 	}
	// });

	$(function(){

		if (_.isEmpty(smart.paths)) {
			return;
		}
		new Fingerprint2().get(function(result, components){
			$.ajax({
				method: 'POST',
				url: smart.paths.whois,
				dataType: 'json',
				data: {
					result: result,
					components: components
				}
			});
		});

		$.ajax({
			type: "GET",
			url: smart.paths.lexicon,
			dataType: 'json'
		}).done(function(data){
			smart.jsonLang = data.lang;
		}).fail(function(data){
			console.log(data);
		});
	});
})();