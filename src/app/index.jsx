import React, { useState } from 'react'
import { Form, Field } from '../form'

import { Form as RFFform, Field as RFFfield } from 'react-final-form'

export const App = () => {
	const [view, setView] = useState(true)
	const [form, setForm] = useState(true)

	return (
		<div>
			<button onClick={() => setView(s => !s)}>change view</button>
			<button onClick={() => setForm(s => !s)}>change form</button>
			<h1>{form ? 'my awesome form' : 'react-final-form used in rst'}</h1>
			{view &&
				(form ? (
					<Form initialState={{ name: 'dima', password: 'veryHardPassword' }}>
						{/* <Field name="name">
						{({ input }) => <input type="text" {...input} />}
					</Field>
					<Field name="password" component={Input} /> */}
						{Array.from({ length: 1000 }).map((_, i) => (
							<Field key={i} name={'name' + i} component={Input} />
						))}
					</Form>
				) : (
					<RFFform
						onSubmit={() => null}
						render={() => (
							<>
								{Array.from({ length: 1000 }).map((_, i) => (
									<RFFfield key={i} name={'name' + i} component={Input} />
								))}
							</>
						)}
					/>
				))}
		</div>
	)
}

const Input = ({ input }) => {
	console.log('RENDER', input.name)
	return <input type="text" {...input} />
}
