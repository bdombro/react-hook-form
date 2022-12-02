import {useForm, useFormContext, useWatch} from 'react-hook-form'
import {ErrorMessage, FieldGroup, Form, FormFooter} from '../helpers/formHelpers'
import {numericStringMask} from '../helpers/numericStringMask'
import {RenderCounter} from './RenderCounter'

interface RegistrationValues {
	name: string
	phone: string
	title: string
	terms: {
		// nested fields work too!
		privacy: boolean
		drPatient: boolean
	}
}
export function Registration() {
	const f = useForm<RegistrationValues>({
		shouldUnregister: true, // unregister inputs when unmounted
	})
	const onSubmit = f.handleSubmit((data) => alert(JSON.stringify(data)))

	return (
		<Form form={f} onSubmit={onSubmit}>
			<TitleField />
			<NameField />
			<PhoneField />
			<TermsFields />
			<FormFooter />
		</Form>
	)
}

function NameField() {
	const f = useFormContext<RegistrationValues>() // access the form through context!
	return (
		<FieldGroup>
			<label htmlFor="name" className="block">
				Name <RenderCounter />
			</label>
			<input {...f.register('name', {required: true})} placeholder="Kotaro" />
			<ErrorMessage>{f.formState.errors.name && (f.formState.errors.name?.message || 'Name is required')}</ErrorMessage>
		</FieldGroup>
	)
}

function PhoneField() {
	const f = useFormContext<RegistrationValues>() // access the form through context!
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.value = numericStringMask(e.target.value, '(###) ###-####')
			.replace(/-$/, '')
			.replace(/\) $/, '')
			.replace(/\($/, '')
	}

	return (
		<FieldGroup>
			<label htmlFor="phone" className="block">
				Phone <RenderCounter />
			</label>
			<input {...f.register('phone', {required: true, onChange})} />
			<ErrorMessage>
				{f.formState.errors.phone && (f.formState.errors.phone?.message || 'Name is required')}
			</ErrorMessage>
		</FieldGroup>
	)
}

function TitleField() {
	const f = useFormContext<RegistrationValues>() // access the form through context!
	return (
		<FieldGroup>
			<label htmlFor="title" className="block">
				Title <RenderCounter />
			</label>
			<select {...f.register('title', {required: true})}>
				<option value="">-- please select --</option>
				<option value="Mr">Mr</option>
				<option value="Mrs">Ms</option>
				<option value="Dr">Dr</option>
			</select>
			<ErrorMessage>
				{f.formState.errors.title && (f.formState.errors.title?.message || 'Title is required')}
			</ErrorMessage>
		</FieldGroup>
	)
}

function TermsFields() {
	return (
		<fieldset>
			<legend>
				Agree to the terms <RenderCounter />
			</legend>
			<PrivacyTermsField />
			<DrPatientTermsField />
		</fieldset>
	)
}

function PrivacyTermsField() {
	const f = useFormContext<RegistrationValues>() // access the form through context!
	return (
		<FieldGroup>
			<div>
				<input {...f.register('terms.privacy', {required: true})} type="checkbox" />
				<label htmlFor="terms.privacy">
					I agree to the Privacy Policy <RenderCounter />
				</label>
			</div>
			<ErrorMessage>{f.formState.errors.terms?.privacy && 'Accepting these terms are required.'}</ErrorMessage>
		</FieldGroup>
	)
}

function DrPatientTermsField() {
	const f = useFormContext<RegistrationValues>() // access the form through context!
	const title = useWatch<RegistrationValues>({
		control: f.control,
		name: 'title',
	})

	return title === 'Dr' ? (
		<FieldGroup>
			<div>
				<input {...f.register('terms.drPatient', {required: true})} type="checkbox" />
				<label htmlFor="terms.drPatient">
					I agree to the Physician-Patient Priviledge terms <RenderCounter />
				</label>
			</div>
			<ErrorMessage>{f.formState.errors.terms?.drPatient && 'Accepting these terms are required.'}</ErrorMessage>
		</FieldGroup>
	) : null
}
