const Util = global.Util;
const ColorUtil = global.ColorUtil;

ItemEvents.entityInteracted(event => {
    const { player, target } = event;
    if (target.type == 'minecraft:glow_item_frame') {
		const text = Text.of('Rebuild Ladder').gold()
			.append(Text.gray(' | '))
			.append(Text.white('0/16 '))
			.append(Text.of('Copper Ingot').bold().color(ColorUtil.COPPER));
		player.displayClientMessage(text, true);
		player.swing('main_hand', true);
	}
});

BlockEvents.rightClicked((event) => {
	const { player, block } = event;

	// Copper doors are locked unless you have the trial key card.
    if ((block.tags.contains(Util.MCRL('doors')) || block.tags.contains(Util.MCRL('trapdoors')))
			&& Util.getPath(block.id).includes('copper')) {
		const heldItem = player.getHandSlots()[0];
		if (heldItem.id !== 'kubejs:trial_key_card') {
			const text = Text.of('You need a ')
				.append(Text.of('Trial Key Card').bold().gray())
				.append(Text.of(' to open '))
				.append(Text.of('Copper Doors').bold().color(ColorUtil.COPPER))
			player.displayClientMessage(text, true);
			event.cancel();
		}
    }
});
