/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
	let url = window.location.search;
	let obj = {};
	/*[?&] 一个字符是?或者&
	[^?&]+ 非?或者& 一个或者多个 以 = 链接 非?或者& 一个或者多个*/
	let reg = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(reg);
	// ['?id=12345', '&a=b']
	//match返回存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		});
	}
	return obj;
};