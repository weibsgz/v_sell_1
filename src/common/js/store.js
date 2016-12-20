export function saveToLocal(id, key, value) {
	let seller = window.localStorage.__seller__;

	if (!seller) {
		seller = {};
		seller[id] = {};

		//结构:{id:{}}
	} else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);

	/*{__seller__: "{"12345":{"favorite":true}}"}*/
};

export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	//如果娶不到seller.id
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
};