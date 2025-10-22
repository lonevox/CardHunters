const Util = global.Util;

BlockEvents.rightClicked((event) => {
	const { player, block } = event;

	// Copper doors are locked unless you have the trial key card.
    if ((block.tags.contains(Util.MCRL('doors')) || block.tags.contains(Util.MCRL('trapdoors')))
			&& Util.getPath(block.id).includes('copper')) {
		const heldItem = player.getHandSlots()[0];
		if (heldItem.id !== 'kubejs:trial_key_card') {
			player.displayClientMessage(Text.of('You need a ').append(Text.of('Trial Key Card').gray()), true);
			event.cancel();
		}
    }
});
