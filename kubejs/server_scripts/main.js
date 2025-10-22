const Util = global.Util;

ItemEvents.entityInteracted(event => {
    const { player, target } = event;
    if (target.type == 'minecraft:glow_item_frame') {
		const text = Text.of('Rebuild Ladder').gold().append(Text.white(' | Needs 16 Copper Ingots'));
		player.displayClientMessage(text, true);
	}
});

BlockEvents.rightClicked((event) => {
	const { player, block } = event;

	// Copper doors are locked unless you have the trial key card.
    if ((block.tags.contains(Util.MCRL('doors')) || block.tags.contains(Util.MCRL('trapdoors')))
			&& Util.getPath(block.id).includes('copper')) {
		const heldItem = player.getHandSlots()[0];
		if (heldItem.id !== 'kubejs:trial_key_card') {
			event.cancel();
		}
    }
});
