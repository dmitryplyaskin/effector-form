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
			<h1>{values ? 'my awesome form' : 'react-final-form used in rst'}</h1>
			{view && (
				<Form
					getValues={values ? v => console.log(v) : () => null}
					onSubmit={onSubmit}
					initialState={{ name: 'dima', password: 'veryHardPassword' }}
				>
					{({ handleSubmit }) => (
						<div>
							<Field name="name">
								{({ input }) => <input type="text" {...input} />}
							</Field>
							<Field name="password" component={Input} />
							<button onClick={handleSubmit}>submit form</button>
						</div>
					)}
				</Form>
			)}
		</div>
	)
}

const Input = ({ input }) => {
	console.log('RENDER', input.name)
	return <input type="text" {...input} />
}
