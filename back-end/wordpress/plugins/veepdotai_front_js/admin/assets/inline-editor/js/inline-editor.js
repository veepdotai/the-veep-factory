const INLINE_EDITOR_CLASS = "veep_para"; // This constant define which class will be "editable" ("veep_para by default")

const DATA_ATTR = "veep-id"; // html attribute used to distinguish elements from each others

const InlineEditor = {

	editMode: false,

	clickedPara: [],

	inlineEditorInit: function () {
		$("." + INLINE_EDITOR_CLASS).attr("contenteditable", true);
	},

	createEditorBtns: function (postId) {
		const str = `
			<div id="inline-editor-btn-container">
				<button id="inline-editor-validation" class="inline-editor-btn color-pr">Valider</button>

				<button id="inline-editor-annulation" class="inline-editor-btn color-sc">Annuler</button>
			</div>
		`;
		$("body").append(str);

		$("#inline-editor-validation").click(function () {

			let modifications = InlineEditor.clickedPara.filter(InlineEditor.filterModifiedPara);
			
			$(this).html(`<span class="loader"></span> Validation ...`);
			$(this).attr('disabled', true);
			$("#inline-editor-annulation").attr('disabled', true);
			$("." + INLINE_EDITOR_CLASS).attr("contenteditable", false);

			const postId = InlineEditor.getPostId();
			ajax_save_article_inline(modifications, postId);
			
			InlineEditor.clickedPara = [];
		});

		$("#inline-editor-annulation").click(function () {
			$(this).attr('disabled', true);
			$("#inline-editor-validation").attr('disabled', true);
			$("." + INLINE_EDITOR_CLASS).attr("contenteditable", false);
			InlineEditor.stopUnloadListeners();
			location.reload();
		});
	},

	nIndexOf: function (haystack, needle, n) {
		let result;
		let start = 0;
		for (let i = 0; i < n; i++) {
			result = haystack.indexOf(needle, start);
			if (result >= 0) {
				start = result + 1;
			}
		}
		return result;
	},

	lastIndexOfFirstDiv: function (str) {
		let firstEnd = str.indexOf("</div>");
		let n = Array.from(str.slice(0, firstEnd).matchAll("<div")).length;
		let lastEnd = InlineEditor.nIndexOf(str, "</div>", n);
		let m = Array.from(str.slice(firstEnd, lastEnd).matchAll("<div")).length;

		while (m > 0) {
			n += m;
			firstEnd = lastEnd;
			lastEnd = InlineEditor.nIndexOf(str, "</div>", n);
			m = Array.from(str.slice(firstEnd, lastEnd).matchAll("<div")).length;
		}

		return lastEnd + 6;
	},

	/**
	 * This function return the html string without the plugin's div. If there is no plugin's div, it will return the original html string.
	 * @param {string} html
	 * @param {string} pluginClass 
	 * @returns 
	 */
	extractPluginDiv: function (html, pluginClass) {
		const index = InlineEditor.lastIndexOfFirstDiv(html);
		const firstDiv = html.slice(0, InlineEditor.lastIndexOfFirstDiv(html));
		let result = html;

		if (firstDiv.includes(pluginClass)) {
			result = html.slice(index).trim();
		}

		return result;
	},

	getPostId: function () {
		let str = $("body").attr("class");
		let num = str.search("postid-");

		str = str.slice(num + 7);
		num = str.search(" ");

		str = str.slice(0, num);
		num = parseInt(str);

		return num;
	},

	initUnloadListeners: function () {
		window.addEventListener('beforeunload', this.handleUnloadEvents);
		window.addEventListener('pagehide', this.handleUnloadEvents);
	},

	handleUnloadEvents: function (e) {
		window.prompt("Are you really sure you want to quit the application?");
		e.preventDefault();
	},

	stopUnloadListeners: function () {
		window.removeEventListener('beforeunload', this.handleUnloadEvents);
		window.removeEventListener('pagehide', this.handleUnloadEvents);
	},

	filterModifiedPara: function (value) {
		const newContent = $("p[data-" + DATA_ATTR + "=" + value.id + "]").html();
		let result = newContent != value.content;
		value.content = newContent;
		return result;
	},

	widget: function () {
		InlineEditor.inlineEditorInit();

		$("." + INLINE_EDITOR_CLASS).focus(function () {

			if (!InlineEditor.editMode) {
				InlineEditor.initUnloadListeners();
				InlineEditor.editMode = true;
				InlineEditor.createEditorBtns();
			}
			
			const id = $(this).attr("data-" + DATA_ATTR);
			const currentContent = $(this).html;

			InlineEditor.clickedPara.push({id: id, content: currentContent});			
		});
	}
}

$(document).ready(function () {
	
	if ($("body").attr("class").includes("logged-in")) {
		InlineEditor.widget();
	} else {
		$("." + INLINE_EDITOR_CLASS).attr("contenteditable", false);
	}
});

function ajax_save_article_inline(modifications, postId) {
	let fd = new FormData();

	fd.append('modifications', JSON.stringify(modifications));
	fd.append('postId', postId);

	fd.append('action', 'save_article_inline');
	fd.append('security', MyAjax.security);

	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (response) {
				InlineEditor.stopUnloadListeners();
				location.reload();
			}
		}
	);
}