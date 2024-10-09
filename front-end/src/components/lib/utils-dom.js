import { Logger } from 'react-logger-lib';

export const UtilsDom = {
	log: Logger.of("UtilsDom"),

	selectElementContents: function(el) {
		var body = document.body, range, sel;
		if (document.createRange && window.getSelection) {
		  range = document.createRange();
		  sel = window.getSelection();
		  sel.removeAllRanges();
		  try {
			range.selectNodeContents(el);
			sel.addRange(range);
		  } catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		  }
		} else if (body.createTextRange) {
		  range = body.createTextRange();
		  range.moveToElementText(el);
		  range.select();
		}
	}
}