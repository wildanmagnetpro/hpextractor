/*
$(document).ready(function() {
	$.phoneExtractor({
		input: '#textInput',
		output: '#phoneList',
		leftFilter: '#startsWith',
		rightFilter: '#endsWith',
		extractButton: '#extract',
		heighlightButton: '#highlight',
		chkDuplicate: '#rmvDuplicate',
	});
});
*/

if(jQuery)(function(jQuery) {
	jQuery.extend(jQuery, {
		phoneExtractor: function(options) {
			jQuery.pne= jQuery.extend({
				input: null,
				output: null,
				filters: null,
				chkDuplicate: null,
				resultCount: null,
				
				extractButton: null,
				heighlightButton: null,
				csvExport: null,
				
				onExtractComplete: function() {},
			}, options);
			
			// Buttons ------
			if(jQuery.pne.extractButton) {
				jQuery(jQuery.pne.extractButton).bind('click', function() {
					jQuery.extractPhones();
				});
			}
			
			if(jQuery.pne.heighlightButton) {
				jQuery(jQuery.pne.heighlightButton).bind('click', function() {
					jQuery(jQuery.pne.output).select();
				});
			}
			
			if(jQuery.pne.csvExport) {
				jQuery(jQuery.pne.csvExport).bind('click', function() {
					if(jQuery.extResult.length < 1) {
						alert('No result was found. Please extract before download.');
					} else {
						$('#extractor-form').attr({'action': 'export/csv.php'}).trigger('submit').attr({'action': 'javascript:void(0);'})
						//window.open('export/csv.php?data='+encodeURIComponent(jQuery.extResult.join(',')));
					}
				});
			}
			
			if(jQuery.pne.txtExport) {
				jQuery(jQuery.pne.txtExport).bind('click', function() {
					if(jQuery.extResult.length < 1) {
						alert('No result was found. Please extract before download.');
					} else {
						$('#extractor-form').attr({'action': 'export/txt.php'}).trigger('submit').attr({'action': 'javascript:void(0);'})
						//window.open('export/txt.php?data='+encodeURIComponent(jQuery.extResult.join(',')));
					}
				});
			}
		},
		pne: {},
		extResult: [],
		selected: function(selector) {
			var Result= [];
			jQuery(selector).each(function() {
				if(jQuery(this).val().length > 0) {
					Result.push(jQuery(this).val());
				}
			});
			return (Result.length < 1) ? '' : Result;
		},
		extractPhones: function() {
			var phone= /[0-9]{11,14}/g;
			var input= jQuery(jQuery.pne.input).val();
			var numbers= (input && input.length > 0) ? input.match(phone) : [];
			var tempResult= [];
			// Inner functions ---
			function resultExists(value, array) {
				return (jQuery.inArray(value, array) >= 0) ? true : false;
			}
			// ----
			for(var i=0; i<numbers.length; i++) {
				var expArray= jQuery.selected(jQuery.pne.filters);
				
				if(expArray.length > 0) {
					var phoneExp= new RegExp('^('+expArray.join('|')+')');
					if(phoneExp.test(numbers[i])) {
						if(jQuery(jQuery.pne.chkDuplicate).length > 0 && jQuery(jQuery.pne.chkDuplicate).prop('checked')== true) {
							if(!resultExists(numbers[i], tempResult)) tempResult.push(numbers[i]);
						} else {
							tempResult.push(numbers[i]);
						}
					}
				} else {
					if(jQuery(jQuery.pne.chkDuplicate).length > 0 && jQuery(jQuery.pne.chkDuplicate).prop('checked')) {
						if(!resultExists(numbers[i], tempResult)) tempResult.push(numbers[i]);
					} else {
						tempResult.push(numbers[i]);
					}
				}
			}
			jQuery.extResult= tempResult;
			jQuery(jQuery.pne.output).add('[name="data"]').val(jQuery.extResult.join("\n"));
			if(jQuery.pne.resultCount) jQuery(jQuery.pne.resultCount).html(jQuery.extResult.length);
		},
		
	});
})(jQuery);