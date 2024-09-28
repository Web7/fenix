/**
 * Author: Oleksandr Nikitin
 * E-mail: o.nikitin@web7.com.ua
 * Date: 28.02.2018
 */
(function(){
	var classNames = {
		smartModal: 'smart-modal',
		modalBackdrop: 'modal-backdrop',
		modalDialog: 'modal-dialog',
		modalTitle: 'modal-title',
		modalBody: 'modal-body',
		modalFooter: 'modal-footer',
		modalOpen: 'modal-open',

		smartBtnSubmit: 'smart-btn-submit',

		smartPerfectScrollbar: 'smart-perfect-scrollbar'
	};
	var ids = {};

	var selectors = smart.buildSelectors(classNames, ids);
	var $smartModalTemplate;

	$(function(){
		$('body').append('<div class="modal fade smart-modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="myModalLabel"></h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="fa fa-close"></i></button></div><div class="modal-body smart-perfect-scrollbar"></div><div class="modal-footer"></div></div></div></div>');
		$smartModalTemplate = $(selectors.smartModal).detach();
	});

	smart.showModalDialog = function(params){
		var $smartModal = $smartModalTemplate.clone();
		var classModalTitle, classModalType, classSizeModal, modalTitle, modalBody, modalFooter, modalButtons;

		smart.modalRemove();

		if (_.isEmpty(params)) {
			return;
		}

		classModalTitle = params.classModalTitle;
		classModalType = params.classModalType;
		classSizeModal = params.classSizeModal;
		modalTitle = params.modalTitle;
		modalBody = params.modalBody;
		modalFooter = params.modalFooter;
		modalButtons = params.modalButtons;

		if (!_.isEmpty(modalButtons)) {
			$smartModal.find(selectors.modalFooter).html('');
			for (var modalButtonsIndex in modalButtons) {
				var btn = modalButtons[modalButtonsIndex];
				var $btn = $('<button/>', {class: btn.btnClass, text: btn.btnName});
				if (!_.isEmpty(btn.btnAttr)) {
					$btn.attr(btn.btnAttr);
				}
				if (_.isFunction(btn.btnFunction)) {
					if ($btn.hasClass(selectors.giwBtnSubmit)) {
						$btn.on('submit.click', btn.btnFunction);
					} else {
						$btn.on('click', btn.btnFunction);
					}
				}
				$smartModal.find(selectors.modalFooter).append($btn);
			}
		}


		if (classModalType) {
			$smartModal.addClass(classModalType);
		}
		if (classSizeModal) {
			$smartModal.find(selectors.modalDialog).addClass(classSizeModal);
		}
		if (classModalTitle) {
			$smartModal.find(selectors.modalTitle).addClass(classModalTitle);
		}
		$smartModal.find(selectors.modalTitle).text(modalTitle || '');
		$smartModal.find(selectors.modalBody).html(modalBody || '');
		if (_.isEmpty(modalButtons)) {
			$smartModal.find(selectors.modalFooter).html(modalFooter || '');
		}
		$('body').append($smartModal);
		$smartModal.modal('show');
		if (!params.disabledScrollbar) {
			$smartModal.find(selectors.smartPerfectScrollbar).perfectScrollbar();
			$smartModal.find(selectors.smartPerfectScrollbar).perfectScrollbar('update');
		} else {
			$smartModal.find(selectors.modalBody).removeClass(classNames.smartPerfectScrollbar);
		}
	};

	smart.modalRemove = function() {
		var $modalBackdrop;
		var $giwModal = $(selectors.smartModal);
		var $body = $('body');
		$body.removeClass(classNames.modalOpen).removeAttr('style');
		$modalBackdrop = $(selectors.modalBackdrop);
		if ($giwModal.exists()) {
			$giwModal.remove();
		}
		if ($modalBackdrop.exists()) {
			$modalBackdrop.remove();
		}
	};

	$(document).on('hide.bs.modal', selectors.smartModal, function(){
		smart.modalRemove();
	});
})();