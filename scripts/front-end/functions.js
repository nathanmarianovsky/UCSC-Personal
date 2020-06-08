define(function() {
	var exports = {};

	exports.handle_links = function() {
		$("a").on("click", function(e) {
			e.preventDefault();
		});
	};
});