ItemEvents.modifyTooltips(event => {
	event.add('kubejs:trial_key_card', [
		Text.darkGray('Many trials await you.').italic(),
		Text.gray('Can unlock any copper doors or trapdoors.')
	]);
});
