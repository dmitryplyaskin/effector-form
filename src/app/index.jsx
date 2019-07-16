import React, { useState } from 'react'
import styled from 'styled-components'
import { Form, Field } from '../form'
import { Input } from './input'
import { FieldArray } from '../form/field_array'
// import { Form as RFFform, Field as RFFfield } from 'react-final-form'

export const App = () => {
	const [view, setView] = useState(true)
	const [, forceUpdate] = useState(true)

	const onSubmit = values => {
		console.log(values)
	}

	return (
		<div>
			<button onClick={() => setView(s => !s)}>change view</button>
			<button onClick={() => forceUpdate({})}>forceUpdate</button>
			<h1>my awesome form</h1>
			{view && (
				<Form
					// getValues={values ? v => console.log(v) : () => null}
					onSubmit={onSubmit}
					initialState={{
						name: 'dima',
						notCalc: '1234567890',
						password: 'veryHardPassword',
					}}
				>
					{({ handleSubmit }) => (
						<Wrapper>
							<Field label="name" name="name" component={Input} />
							<Field label="password" name="password" component={Input} />
							{/* <Field
								validate={value =>
									value.length < 10 ? 'меньше 10' : undefined
								}
								name="notCalc"
								label="notCalc"
								component={Input}
							/> */}
							<Field
								name="calculate"
								label="calculate"
								calculate={{
									target: ['name', 'password'],
									fn: (n, p) => n + '123' + p,
								}}
								component={Input}
							/>
							<FieldArray name="fields">
								{({ fields }) => (
									<>
										{console.log(fields.map(x => console.log(x)))}
										{fields.map((name, i) => (
											<Field
												key={i}
												label={name}
												name={`${name}.fields`}
												component={Input}
											/>
										))}
										<button onClick={fields.push}>add field +</button>
									</>
								)}
							</FieldArray>

							<button onClick={handleSubmit}>submit form</button>
						</Wrapper>
					)}
				</Form>
			)}
		</div>
	)
}

const Wrapper = styled.div`
	padding: 20px;
`
