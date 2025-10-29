let $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");
const Util = global.Util;

BlockEvents.rightClicked((event) => {
	const { player, block, hitResult } = event;

	// Copper doors are locked unless you're holding the trial key card
    if ((block.getTags().contains(Util.MCRL('doors')) || block.getTags().contains(Util.MCRL('trapdoors')))
		&& Util.getPath(block.getId()).includes('copper')
		&& player.getMainHandItem().id.toString() !== 'kubejs:trial_key_card') {
			event.cancel();
    }
});
