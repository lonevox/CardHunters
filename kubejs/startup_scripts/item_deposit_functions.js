/**
 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original} player
 */
global.repair_ladder = function(player) {
	const server = player.server;
	server.runCommandSilent(`particle minecraft:happy_villager ${player.x} ${player.y + 1} ${player.z} 0.5 0.5 0.5 0.1 10 force @a`);
	server.runCommandSilent(`playsound minecraft:entity.player.levelup master @a ${player.x} ${player.y} ${player.z} 1 1`);
	server.runCommandSilent(`title @s actionbar {"text":"Ladder Repaired!","color":"gold","bold":true}`);
	server.runCommandSilent('setblock -1 0 -3 create:copper_ladder[facing=south]');
	server.runCommandSilent('setblock -1 1 -3 create:copper_ladder[facing=south]');
}
