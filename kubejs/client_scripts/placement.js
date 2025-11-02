let $BlockTarget = Java.loadClass("com.lonevox.cardhunterscore.BlockTarget")

BlockEvents.rightClicked((event) => {
	const { player, block } = event;

	$BlockTarget.blockTarget = block.getPos();
});
