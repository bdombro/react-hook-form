import React from 'react'

import {useFormContext, FormProvider, UseFormReturn, useFormState} from 'react-hook-form'
import {jsonify} from './jsonify'
import {RenderCounter} from '../components/RenderCounter'
import {Spinner} from '../components/Spinner'

export function Form({
	children,
	form,
	onSubmit,
}: React.PropsWithChildren<{
	form: UseFormReturn<any>
	onSubmit: React.FormEventHandler<HTMLFormElement>
}>) {
	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit}>{children}</form>
		</FormProvider>
	)
}

/** Makes a formMethod object JSON stringable */
export function formSanitizeObj<O extends any>(obj: O): O {
	if (Array.isArray(obj)) return obj.map(formSanitizeObj) as O
	if (typeof obj !== 'object') return obj

	return Object.fromEntries(
		Object.entries(obj as any).map(([k, v]) => {
			if (Array.isArray(v)) return [k, v.map(formSanitizeObj)]
			if (typeof v !== 'object') return [k, v]
			// Else is an object
			const {ref, ...rest} = v as any
			return [k, formSanitizeObj(rest)]
		}),
	) as O
}

export function FieldGroup({children}: React.PropsWithChildren<{}>) {
	return <div className="field-group">{children}</div>
}

export function ErrorMessage({children}: React.PropsWithChildren<{}>) {
	return children ? <p className="error">{children}</p> : null
}

export function FormFooter({concise}: {concise?: boolean}) {
	const f = useFormContext<any>() // access the form through context!
	return (
		<>
			{Object.keys(f.formState.errors).length > 0 && <ErrorMessage>Please correct errors in form.</ErrorMessage>}
			<div className="button-group">
				<button type="submit" disabled={f.formState.isSubmitting}>
					Submit
					{f.formState.isSubmitting && <Spinner />}
				</button>
				<button type="button" data-active={false} disabled={f.formState.isSubmitting} onClick={f.reset}>
					Reset
				</button>
			</div>
			<p children={<RenderCounter />} />
			<FormValueDump concise={concise} />
			<FormErrorDump concise={concise} />
		</>
	)
}

function FormValueDump({concise}: {concise?: boolean}) {
	const f = useFormContext<any>() // access the form through context!
	return (
		<fieldset style={{wordBreak: 'break-word', marginBottom: '2rem'}}>
			<legend>form.getValues()</legend>
			<p>
				{concise ? (
					Object.values(f.getValues()).join(',') || '(empty)'
				) : (
					<pre>{JSON.stringify(f.getValues(), null, 2)}</pre>
				)}
			</p>
		</fieldset>
	)
}

function FormErrorDump({concise}: {concise?: boolean}) {
	const state = useFormState<any>() // access the form through context!
	return (
		<fieldset style={{wordBreak: 'break-word', marginBottom: '2rem'}}>
			<legend>formState.errors</legend>
			<p>
				{concise ? (
					Object.values(state.errors)
						.map((e: any) => e?.message || 'required')
						.join(',') || '(empty)'
				) : (
					<pre>
						{Object.keys(state.errors)}
						{jsonify(formSanitizeObj(state.errors), 2)}
					</pre>
				)}
			</p>
		</fieldset>
	)
}
