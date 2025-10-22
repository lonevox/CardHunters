let ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation");

global.Util = {
	RL: function (namespace, path) {
		return ResourceLocation.fromNamespaceAndPath(namespace, path);
	},

	MCRL: function (path) {
		return ResourceLocation.fromNamespaceAndPath('minecraft', path);
	},

	KubeRL: function (path) {
		return ResourceLocation.fromNamespaceAndPath('kube', path);
	},

	getNamespace: function (resourceLocation) {
		return resourceLocation.split(':')[0];
	},

	getPath: function (resourceLocation) {
		return resourceLocation.split(':')[1];
	},
}
