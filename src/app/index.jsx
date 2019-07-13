import React, { useState } from 'react'
import { Form, Field } from '../form'

// import { Form as RFFform, Field as RFFfield } from 'react-final-form'

export const App = () => {
	const [view, setView] = useState(true)
	const [values, setValues] = useState(true)

	const onSubmit = values => {
		console.log(values)
	}

	return (
		<div>
			<button onClick={() => setView(s => !s)}>change view</button>
			<button onClick={() => setValues(s => !s)}>values?</button>
			<h1>my awesome form</h1>
			{view && (
				<Form
					// getValues={values ? v => console.log(v) : () => null}
					onSubmit={onSubmit}
					initialState={{
						name: 'dima',
						password: 'veryHardPassword',
						notCalc: 'no',
					}}
				>
					{({ handleSubmit }) => (
						<div>
							<Field name="name">
								{({ input }) => <input type="text" {...input} />}
							</Field>
							<Field name="password" component={Input} />
							<Field
								validate={value =>
									value.length < 10 ? 'меньше 10' : undefined
								}
								name="notCalc"
								component={Input}
							/>
							{values && (
								<Field
									name="calculate"
									calculate={{
										target: ['name', 'password', 'dsa'],
										fn: (n, p, d) => n + '123' + p,
									}}
									component={Input}
								/>
							)}
							<button onClick={handleSubmit}>submit form</button>
						</div>
					)}
				</Form>
			)}
		</div>
	)
}

const Input = ({ input, error }) => {
	// console.log('RENDER', input.name, error)
	return (
		<div>
			<input type="text" {...input} />
			{error}
		</div>
	)
}
