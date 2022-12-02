import {useForm} from 'react-hook-form'
import {Form, FormFooter} from '../helpers/formHelpers'
import {RenderCounter} from './RenderCounter'

type StressValues = Record<string, string>
export function StressTest() {
	const f = useForm<StressValues>({
		reValidateMode: 'onSubmit', // prevents rerender of invalid components on form-change
	})
	const onSubmit = f.handleSubmit((data) => alert(JSON.stringify(data)))

	return (
		<Form form={f} onSubmit={onSubmit}>
			{Array(180)
				.fill(0)
				.map((_, i) => (
					<input
						className="stress"
						data-state={f.formState.errors[`${i}`] ? 'error' : ''}
						{...f.register(`${i}`, {required: true})}
						placeholder={RenderCounter({short: true})}
					/>
				))}
			<FormFooter concise />
		</Form>
	)
}
