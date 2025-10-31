let $PlacementClient  = Java.loadClass("net.createmod.catnip.placement.PlacementClient");

BlockEvents.rightClicked((event) => {
	const { player, block } = event;

	console.log("Registering placement client script");
	console.log($PlacementClient.target);
	console.log(JSON.stringify($PlacementClient, null, 2));
});
