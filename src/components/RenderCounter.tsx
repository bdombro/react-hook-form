import {useRef} from 'react'

export function RenderCounter({short}: {short?: boolean}) {
	const count = useRef(0)
	count.current++
	const text = short ? `R:${count.current}x` : `(Rendered ${count.current}x)`
	return text as any
}
