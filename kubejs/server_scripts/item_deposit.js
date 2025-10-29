/** @type {typeof import("net.minecraft.world.phys.HitResult$Type").$HitResult$Type } */
let $HitResult$Type  = Java.loadClass("net.minecraft.world.phys.HitResult$Type")
/** @type {typeof import("net.minecraft.nbt.ListTag").$ListTag } */
let $ListTag  = Java.loadClass("net.minecraft.nbt.ListTag")
/** @type {typeof import("net.minecraft.nbt.CompoundTag").$CompoundTag } */
let $CompoundTag  = Java.loadClass("net.minecraft.nbt.CompoundTag")
/** @type {typeof import("net.minecraft.world.entity.EntityType").$EntityType } */
let $EntityType  = Java.loadClass("net.minecraft.world.entity.EntityType")
/** @type {typeof import("net.minecraft.world.entity.Display$ItemDisplay").$Display$ItemDisplay } */
let $Display$ItemDisplay  = Java.loadClass("net.minecraft.world.entity.Display$ItemDisplay")
/** @type {typeof import("net.minecraft.world.entity.Display$TextDisplay").$Display$TextDisplay } */
let $Display$TextDisplay  = Java.loadClass("net.minecraft.world.entity.Display$TextDisplay")
/** @type {typeof import("net.minecraft.nbt.FloatTag").$FloatTag } */
let $FloatTag  = Java.loadClass("net.minecraft.nbt.FloatTag")
/** @type {typeof import("net.minecraft.core.Direction").$Direction } */
let $Direction  = Java.loadClass("net.minecraft.core.Direction")
/** @type {typeof import("net.minecraft.nbt.StringTag").$StringTag } */
let $StringTag  = Java.loadClass("net.minecraft.nbt.StringTag")
/** @type {typeof import("net.minecraft.world.entity.decoration.ItemFrame").$ItemFrame } */
let $ItemFrame  = Java.loadClass("net.minecraft.world.entity.decoration.ItemFrame")
/** @type {typeof import("net.minecraft.nbt.Tag").$Tag } */
let $Tag  = Java.loadClass("net.minecraft.nbt.Tag")
/** @type {typeof import("net.minecraft.server.level.ServerLevel").$ServerLevel } */
let $ServerLevel  = Java.loadClass("net.minecraft.server.level.ServerLevel")

ItemEvents.entityInteracted(event => {
    const { player, target } = event;
    if (target.type == 'minecraft:item_frame' && target.nbt.getList('Tags', $Tag.TAG_STRING).contains($StringTag.valueOf('item_deposit'))) {
		const itemFrame = /** @type {import("net.minecraft.world.entity.decoration.ItemFrame").$ItemFrame$$Original} */ (/** @type {unknown} */ (target));
		const heldItem = player.getHandSlots()[0];
		const data = itemFrame.persistentData.getCompound('data');
		if (heldItem.id !== data.getString('item_id')) {
			player.displayClientMessage(`Right click with a ${data.getString('item_id')} to deposit it`, true);
			event.cancel();
		}
		const itemCount = data.getInt('item_count');
		const depositCount = Math.min(heldItem.count, itemCount);
		heldItem.shrink(depositCount);
		data.putInt('item_count', itemCount - depositCount);
		itemFrame.persistentData.put('data', data);

		// Update the text display
		const level = /** @type {import("net.minecraft.server.level.ServerLevel").$ServerLevel$$Original} */ (/** @type {unknown} */ (player.level));;
		const textDisplay = data.getUUID('text_display');
		const textDisplayEntity = level.getEntityByUUID(textDisplay);
		const textDisplayNbt = textDisplayEntity.nbt;
		const newCount = itemCount - depositCount;
		const text = Text.of(newCount.toString()).color('#EEEEEE').toJson();
		textDisplayNbt.putString('text', text);
		textDisplayEntity.nbt = textDisplayNbt;

		if (newCount <= 0) {
			// Execute on_complete
			const completionType = data.getString('completion_type');
			const onComplete = data.getString('on_complete').toString();
			console.log(completionType);
			switch (completionType) {
				case 'function':
					global[onComplete](player);
					break;
				case 'command':
					player.server.runCommand(onComplete);
					break;
			}
			killItemDeposit(level, itemFrame.blockPosition(), itemFrame.facing);
		}
	}
});

ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;
	
	event.register(Commands.literal('createItemDeposit')
		.requires(source => source.hasPermission(2))
		.then(Commands.argument('name', Arguments.STRING.create(event))
			.then(Commands.argument('item', Arguments.ITEM_STACK.create(event))
				.then(Commands.argument('count', Arguments.INTEGER.create(event))
				.executes(context => _createItemDeposit(context.source.player, Arguments.STRING.getResult(context, 'name'), Arguments.ITEM_STACK.getResult(context, 'item'), Arguments.INTEGER.getResult(context, 'count'), null))
					.then(Commands.argument('on_complete', Arguments.STRING.create(event))
						.executes(context => _createItemDeposit(context.source.player, Arguments.STRING.getResult(context, 'name'), Arguments.ITEM_STACK.getResult(context, 'item'), Arguments.INTEGER.getResult(context, 'count'), Arguments.STRING.getResult(context, 'on_complete')))
					)
				)
			)
		)
	);

	/**
	 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
	 * @param {string} name
	 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} itemStack
	 * @param {number} count
	 * @param {string | null} onComplete
	 */
	function _createItemDeposit(player, name, itemStack, count, onComplete) {
		const hitResult = global.PlayerUtil.raycast(player);
		if (hitResult.type === $HitResult$Type.MISS) {
			player.displayClientMessage('Look at a block to place the item deposit', true);
			return 0;
		}
		const hitDirection = hitResult.direction;
		if (hitDirection.axis.horizontal === false) {
			player.displayClientMessage('Item deposit must be placed on the side of a block', true);
			return 0;
		}
		const blockPos = hitResult.blockPos;
		const level = player.level;
		// Narrow level to ServerLevel
		if (!(level instanceof $ServerLevel)) {
			return 0;
		}
		// Return if an item deposit already exists at this location
		if (level.persistentData.contains('item_deposits')) {
			const itemDeposits = level.persistentData.getCompound('item_deposits');
			if (itemDeposits.contains(blockPos.x + ' ' + blockPos.y + ' ' + blockPos.z + ' ' + hitDirection)) {
				player.displayClientMessage('An item deposit already exists at this location', true);
				return 0;
			}
		}

		const tags = new $ListTag();
		tags.add(0, $StringTag.valueOf('item_deposit'));

		// Create the item frame
		// @ts-ignore
		const itemFrame = new $ItemFrame(level, blockPos.relative(hitDirection), hitDirection);
		const itemFrameNbt = itemFrame.getNbt();
		itemFrameNbt.put('Tags', tags);
		itemFrameNbt.putBoolean('Invisible', true);
		itemFrameNbt.putBoolean('Fixed', true);
		itemFrame.setNbt(itemFrameNbt);
		itemFrame.spawn();
		const brightness = new $CompoundTag();
		brightness.putInt('sky', 15);
		brightness.putInt('block', 15);

		const displayRotation = global.Util.rotationFromDirection(hitDirection);

		// Create the item display
		const itemDisplay = new $Display$ItemDisplay($EntityType.ITEM_DISPLAY, level);
		const itemDisplayFaceOffset = global.Util.blockFaceOffset(hitDirection, 0.01);
		itemDisplay.setPos(blockPos.x + itemDisplayFaceOffset.x, blockPos.y + 0.6, blockPos.z + itemDisplayFaceOffset.z);
		itemDisplay.setRotation(displayRotation.yRot, displayRotation.xRot);
		const itemDisplayNbt = itemDisplay.nbt;
		itemDisplayNbt.put('Tags', tags);
		itemDisplayNbt.put('brightness', brightness);
		const scale = itemDisplayNbt.getCompound('transformation').getList('scale', $Tag.TAG_FLOAT);
		scale.setTag(0, $FloatTag.valueOf(0.5));
		scale.setTag(1, $FloatTag.valueOf(0.5));
		scale.setTag(2, $FloatTag.valueOf(0.5));
		const itemTag = new $CompoundTag();
		itemTag.putString('id', itemStack.item.id);
		itemDisplayNbt.put('item', itemTag);
		itemDisplay.nbt = itemDisplayNbt;
		itemDisplay.spawn();

		// Create the text display
		const textDisplay = new $Display$TextDisplay($EntityType.TEXT_DISPLAY, level);
		const textDisplayFaceOffset = global.Util.blockFaceOffset(hitDirection, 0.03);
		textDisplay.setPos(blockPos.x + textDisplayFaceOffset.x, blockPos.y + 0.15, textDisplayFaceOffset.z + blockPos.z);
		textDisplay.setRotation(displayRotation.yRot, displayRotation.xRot);
		const textDisplayNbt = textDisplay.nbt;
		textDisplayNbt.put('Tags', tags);
		textDisplayNbt.put('brightness', brightness);
		textDisplayNbt.putBoolean('shadow', true);
		textDisplayNbt.putByte('background', 0);
		const text = Text.of(count.toString()).color('#EEEEEE').toJson();
		textDisplayNbt.putString('text', text);
		textDisplay.nbt = textDisplayNbt;
		textDisplay.spawn();

		// Save the item deposit data to the item frame's persistent data
		const itemDepositData = new $CompoundTag();
		itemDepositData.putString('name', name);
		itemDepositData.putString('item_id', itemStack.item.id);
		itemDepositData.putInt('item_count', count);
		if (onComplete === null) {
			itemDepositData.putString('completion_type', 'function');
			itemDepositData.putString('on_complete', name);
		} else {
			itemDepositData.putString('completion_type', 'command');
			itemDepositData.putString('on_complete', onComplete);
		}
		itemDepositData.putUUID('item_display', itemDisplay.uuid);
		itemDepositData.putUUID('text_display', textDisplay.uuid);
		itemFrame.persistentData.put('data', itemDepositData)
		console.log(level.persistentData);

		// Save the item deposit to the level's persistent data
		if (!level.persistentData.contains('item_deposits')) {
			level.persistentData.put('item_deposits', new $CompoundTag());
		}
		const itemDeposits = level.persistentData.getCompound('item_deposits');
		const itemFramePos = itemFrame.blockPosition();
		itemDeposits.putUUID(itemFramePos.x + ' ' + itemFramePos.y + ' ' + itemFramePos.z + ' ' + hitDirection, itemFrame.uuid);
		level.persistentData.put('item_deposits', itemDeposits);
		console.log(level.persistentData);
		
		return 1;
	}

	event.register(Commands.literal('killItemDeposit')
		.requires(source => source.hasPermission(2))
		.executes(context => _killItemDeposit(context.source.player))
	);

	function _killItemDeposit(player) {
		const level = player.level;
		// Narrow level to ServerLevel
		if (!(level instanceof $ServerLevel)) {
			return 0;
		}
		if (!level.persistentData.contains('item_deposits')) {
			player.displayClientMessage('There are no item deposits in this dimension', true);
			return 0;
		}
		const hitResult = global.PlayerUtil.raycast(player);
		if (hitResult.type === $HitResult$Type.MISS) {
			player.displayClientMessage('Look at an item deposit to kill it', true);
			return 0;
		}
		
		const itemDepositPos = hitResult.blockPos.relative(hitResult.direction);
		try {
			killItemDeposit(level, itemDepositPos, hitResult.direction);
		} catch (e) {
			player.displayClientMessage("No item deposit found at this location", true);
			return 0;
		}

		return 1;
	}
});

/**
 * @param {import("net.minecraft.server.level.ServerLevel").$ServerLevel$$Type} level
 * @param {import("net.minecraft.core.BlockPos").$BlockPos$$Original} blockPos
 * @param {import("net.minecraft.core.Direction").$Direction$$Original} facingDirection
 */
function killItemDeposit(level, blockPos, facingDirection) {
	const itemDeposits = level.persistentData.getCompound('item_deposits');
	const key = blockPos.x + ' ' + blockPos.y + ' ' + blockPos.z + ' ' + facingDirection;
	console.log(key);
	if (!itemDeposits.contains(key)) {
		throw new Error('No item deposit found at the location: ' + key);
	}

	const itemFrameUUID = itemDeposits.getUUID(key);
	const itemFrame = level.getEntityByUUID(itemFrameUUID);
	const itemDepositData = itemFrame.persistentData.getCompound('data');
	level.getEntityByUUID(itemDepositData.getUUID('item_display')).kill();
	level.getEntityByUUID(itemDepositData.getUUID('text_display')).kill();
	itemFrame.kill();
	itemDeposits.remove(key);
	if (itemDeposits.isEmpty()) {
		level.persistentData.remove('item_deposits');
	} else {
		level.persistentData.put('item_deposits', itemDeposits);
	}
	console.log(level.persistentData);
}
