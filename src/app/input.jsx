import React from 'react'
import styled from 'styled-components'

export const Input = ({ label, input, meta, error }) => {
	return (
		<Wrapper>
			{label && <Label>{label}</Label>}
			<InputI {...input} type="text" />
			{error && <Error>{error}</Error>}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin: 10px 0;
	width: 300px;
`
const InputI = styled.input`
	font-size: 14px;
	padding: 10px 5px;
	border-radius: 3px;
	border: 1px solid #cecece;
`
const Label = styled.span`
	font-size: 14px;
	margin-bottom: 5px;
`
const Error = styled.span`
	margin-top: 5px;
	font-size: 12px;
	color: red;
`
