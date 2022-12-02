/** A cyclical resistent json stringify */
export function jsonify(value: any, space: number) {
	const visitedObjs: any = []
	function replacerFn(key: string, obj: any) {
		const refIndex = visitedObjs.indexOf(obj)
		if (refIndex >= 0) return `cyclic-ref:${refIndex}`
		if (typeof obj === 'object' && obj !== null) visitedObjs.push(obj)
		return obj
	}
	return JSON.stringify(value, replacerFn, space)
}
