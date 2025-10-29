/** @type {typeof import("net.minecraft.resources.ResourceLocation").$ResourceLocation } */
let $ResourceLocation  = Java.loadClass("net.minecraft.resources.ResourceLocation")
/** @type {typeof import("net.minecraft.world.level.ClipContext").$ClipContext } */
let $ClipContext  = Java.loadClass("net.minecraft.world.level.ClipContext")
/** @type {typeof import("net.minecraft.world.level.ClipContext$Block").$ClipContext$Block } */
let $ClipContext$Block  = Java.loadClass("net.minecraft.world.level.ClipContext$Block")
/** @type {typeof import("net.minecraft.world.level.ClipContext$Fluid").$ClipContext$Fluid } */
let $ClipContext$Fluid  = Java.loadClass("net.minecraft.world.level.ClipContext$Fluid")

global.Util = {
	RL: function (namespace, path) {
		return $ResourceLocation.fromNamespaceAndPath(namespace, path);
	},

	MCRL: function (path) {
		return $ResourceLocation.fromNamespaceAndPath('minecraft', path);
	},

	kubeRL: function (path) {
		return $ResourceLocation.fromNamespaceAndPath('kube', path);
	},

	getNamespace: function (resourceLocation) {
		return resourceLocation.split(':')[0];
	},

	getPath: function (resourceLocation) {
		return resourceLocation.split(':')[1];
	},

	/**
	 * Get rotation values from a facing direction.
	 * 
	 * Ported from `ItemFrame.setDirection` in the Minecraft source code.
	 * 
	 * @param {import("net.minecraft.core.Direction").$Direction$$Original} facingDirection
	 * @returns {{xRot: number, yRot: number}}
	 */
	rotationFromDirection: function (facingDirection) {
		if (facingDirection.axis.horizontal) {
			return { xRot: 0, yRot: facingDirection.horizontalIndex * 90 };
		} else {
			return { xRot: facingDirection.axisDirection.step, yRot: 0 };
		}
	},

	/**
	 * Get the center position of a blocks face with an extra offset away from the block.
	 * 
	 * @param {import("net.minecraft.core.Direction").$Direction$$Original} direction
	 * @param {number} extraOffset
	 * @returns {{x: number, y: number, z: number}}
	 */
	blockFaceOffset: function (direction, extraOffset) {
		switch (direction) {
			case $Direction.NORTH:
				return { x: 0.5, y: 0.5, z: -extraOffset };
			case $Direction.EAST:
				return { x: 1 + extraOffset, y: 0.5, z: 0.5 };
			case $Direction.SOUTH:
				return { x: 0.5, y: 0.5, z: 1 + extraOffset };
			case $Direction.WEST:
				return { x: -extraOffset, y: 0.5, z: 0.5 };
			case $Direction.UP:
				return { x: 0.5, y: 1, z: 0.5 };
			case $Direction.DOWN:
				return { x: 0.5, y: 0, z: 0.5 };
		}
	}
}

global.PlayerUtil = {
	/**
	 * Perform a raycast from the player's eyes to determine what they are looking at.
	 * The length of the raycast is determined by the player's block interaction range.
	 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original | import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
	 * @returns {import("net.minecraft.world.phys.BlockHitResult").$BlockHitResult$$Original} The result of the raycast.
	 */
	raycast: function (player) {
		const start = player.getEyePosition(1);
        const lookVec = player.getLookAngle();
		const reach = player.blockInteractionRange();
        const end = start.add(lookVec.x() * reach, lookVec.y() * reach, lookVec.z() * reach);
		const hitResult = player.level.clip(new $ClipContext(start, end, $ClipContext$Block.VISUAL, $ClipContext$Fluid.NONE, player));
		return hitResult;
	}
}

global.ColorUtil = {
	COPPER: '#E07654',
}
