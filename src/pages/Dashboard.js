import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')

	const handleClick = () => {
    history.push('/game'); // Replace '/other-page' with the path of the page you want to navigate to
  };

	// async function populateQuote() {
	// 	const req = await fetch('http://localhost:1337/api/quote', {
	// 		headers: {
	// 			'x-access-token': localStorage.getItem('token'),
	// 		},
	// 	})

	// 	const data = await req.json()
	// 	if (data.status === 'ok') {
	// 		setQuote(data.quote)
	// 	} else {
	// 		alert(data.error)
	// 	}
	// }

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/signin')
			} else {
        console.log("user detail----------------------",user)
				// populateQuote()
			}
		}
	}, [])

	// async function updateQuote(event) {
	// 	event.preventDefault()

	// 	const req = await fetch('http://localhost:1337/api/quote', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'x-access-token': localStorage.getItem('token'),
	// 		},
	// 		body: JSON.stringify({
	// 			quote: tempQuote,
	// 		}),
	// 	})

	// 	const data = await req.json()
	// 	if (data.status === 'ok') {
	// 		setQuote(tempQuote)
	// 		setTempQuote('')
	// 	} else {
	// 		alert(data.error)
	// 	}
	// }

	return (
		<div>
			<h1>Welcome to Game Click here to Continue</h1>
			<button onClick={handleClick}>Go to Other Page</button>
		</div>
	)
}

export default Dashboard
