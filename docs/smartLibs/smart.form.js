/**
 * Author: Oleksandr Nikitin
 * E-mail: o.nikitin@web7.com.ua
 * Date: 06.08.2017
 */
(function(){
	var classNames = {
		formGroup: 'form-group',
		hasError: 'has-error',
		hasWarning: 'has-warning',
		modalSm: 'modal-sm',

		smartModalError: 'smart-modal-error',
		smartBtnSubmit: 'smart-btn-submit'
	};
	var ids = {};

	var selectors = smart.buildSelectors(classNames, ids);

	var isReload = false;

	smart.clearFormElements = function() {
		var $elements = $('[name]').not('[type="hidden"], meta, [type="number"], [data-not-clear]');
		$elements.val('');
	};

	$(document).on('keypress', 'form', function(e){
		var $this = $(this);
		var isNotPressEnter = $this.attr('data-is-not-press-enter');

		// if (e.keyCode === 13) {
		// 	e.preventDefault();
		// 	e.stopPropagation();
		// 	return false;
		// }

		if ($this.attr('method') === 'post' && e.which === 13 && !isNotPressEnter) {
			$(selectors.smartBtnSubmit).trigger('click');
			return false;
		}
	});

	$(document).on('input propertychange', 'input', function(){

	});

	$(document).on('click', selectors.smartBtnSubmit, function(e){
		var $this = $(this);
		var $thisForm = $this.attr('data-form') ? $('#' + $this.attr('data-form')) : $this.closest('form');
		var $formElementsRequired = $thisForm.find('input[required], textarea[required]');
		var $formElements = $thisForm.find('input, textarea');
		var data = {};
		isReload = $thisForm.attr('data-is-reload') && $thisForm.attr('data-is-reload') === 'true';

		// smart.showThrobberInElement($this);

		$this.trigger('submit.click');

		$(selectors.formGroup).removeClass(classNames.hasError);
		$(selectors.formGroup).removeClass(classNames.hasWarning);
		$formElementsRequired.each(function(){
			var $_this = $(this);
			if (!$_this.val()) {
				$_this.closest(selectors.formGroup).addClass(classNames.hasError);
			}

			if ($_this.attr('type') === 'checkbox' && !$_this.is(':checked')) {
				$_this.closest(selectors.formGroup).addClass(classNames.hasError);
			}
		});
		if ($thisForm.find(selectors.formGroup).hasClass(classNames.hasError)) {
			var $hasError = $thisForm.find(selectors.hasError).first().find('input').focus();
			var $input = $hasError.find('input'),
				$textarea = $hasError.find('textarea');
			if ($input.exists()) {
				$input.focus();
			} else if ($textarea.exists()) {
				$textarea.focus();
			}
			return;
		}

		var dataSerialize = $thisForm.serializeArray();

		for (var dataSerializeIndex in dataSerialize) {
			var serializeItem = dataSerialize[dataSerializeIndex];
			data[serializeItem.name] = serializeItem.value || null;
		}

		smart.ajax({
			path: $thisForm.attr('action'),
			method: $thisForm.attr('method'),
			data: data,
			triggerName: $thisForm.attr('data-trigger-name')
		}, function(_data){
			var dataCallback = $thisForm.attr('data-callback') ? giw[$thisForm.attr('data-callback')] : undefined;
			if (dataCallback) {
				if (_.isFunction(dataCallback)) {
					dataCallback(_data);
				}
			}
			if (isReload) {
				smart.isDocumentClick = true;
				location.reload();
			}
		});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	smart.ajax = function(params, callback){
		var path = params.path,
			data = params.data,
			dataType = params.dataType,
			method = params.method,
			triggerName = params.triggerName;
		smart.showThrobber();
		smart.isAjax = true;
		$.ajax({
			data: data,
			type: method || "post",
			url: path,
			dataType: dataType || 'json'
		}).done(function(data){
			if (data.redirect) {
				smart.isDocumentClick = true;
				location.href = data.redirect || '/';
				return;
			}
			if (_.isFunction(callback)) {
				callback(data);
			}
			smart.modalRemove();
			if (!isReload) {
				smart.removeThrobber();
			}
			if (!_.isEmpty(triggerName)) {
				$(document).trigger(triggerName);
			}
		}).fail(function(error) {
			var dataError = error && error.responseJSON;
			var _error = dataError && dataError.error;
			var title = 'Error', errorText = 'Unknown error';
			if (_.isObject(_error)) {
				title = _error.title;
				errorText = _error.message;
			} else {
				errorText = _error || 'Unknown error';
			}
			smart.showModalDialog({
				classSizeModal: _.isObject(_error) ? '' : classNames.modalSm,
				classModalType: classNames.smartModalError,
				modalTitle: title,
				modalBody: errorText,
				modalFooter: $('<button/>', {type: 'button', class: 'btn btn-danger', 'data-dismiss': 'modal', text: smart.jsonLang.close[smart.lng]})
			});
			smart.removeThrobber();
		}).always(function() {
			smart.isAjax = false;
		});
	};
})();