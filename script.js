/**
 * AcMenu plugin: an accordion menu for namespaces and relative pages.
 *
 * script.js: it defines the accordion menu behaviour used by AcMenu plugin.
 *
 * @author Torpedo <dgtorpedo@gmail.com>
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @package script
 */

jQuery(document).ready(function() {
	// only if the browser enables javascript hide the content of each namespace
	//jQuery(".dokuwiki div.acmenu ul.idx li.closed ul.idx").css("display", "none");
	//jQuery(".dokuwiki div.page.group").css("min-height", "");

	// the jQuery selector used is defined as the element (right to left):
	//     <div> that is not direct child of class starting with class="level"
	//     which in turns is direct child of <ul>
	//     which in turns is descendant of the class="acmenu"
	const _SELECTOR = "div.acmenu ul > :not([class^='level']) > div";
	const _HREF = /\/doku\.php?id=.*/g;
	var item_open = [];
    var one_click = "";
	var clicks = 0;
	
	if (document.cookie.indexOf("item_open") == -1) {
		jQuery(".dokuwiki div.acmenu ul.idx li.open ul.idx")
		.css("display", "none")
		.parent().removeClass("open").addClass("closed");;
		jQuery(".dokuwiki div.page.group").css("min-height", "");
	}

	// implementation of "one click" and "double click" behaviour:
	// "double click" has effect only if occurs in less X milliseconds,
	// where X is the time lapse defined in setTimeout
	jQuery(_SELECTOR).click(function(event) {
		// redefine "this" in outer scope in order to be used in setTimeout
		var that = this;

		var item = jQuery(this).find("a").attr("href");
		clicks = clicks + 1;
		if (clicks == 1) {
			event.preventDefault();
			one_click = window.setTimeout(function () {
				clicks = 0;
				if (jQuery(that).next().is(":visible") == false) {
					jQuery(that)
					.next().slideDown("fast")
					.parent().removeClass("closed").addClass("open");
					item_open.push(item);
				}
				else {
					jQuery(that)
					.next().slideUp("fast")
					.parent().removeClass("open").addClass("closed");
					item_open.splice(jQuery.inArray(item, item_open), 1);
				}
				var cvalue = JSON.stringify(item_open);
				document.cookie = "item_open=" + cvalue + ";expires='';path=/";
			}, 300);
        }
		else if (clicks == 2) {
			clearTimeout(one_click);

            clicks = 0;
			var url = window.location.toString();
			//if (jQuery.inArray(item, item_open) == -1) {
			//	item_open.push(item);
			//}
			//sessionStorage.setItem("item_open", JSON.stringify(item_open));
			window.location = url.replace(_HREF, jQuery(this).find("a").attr("href"));
        }
	});
});
