import React, { useState } from "react";
import axios from "axios";
import "../Budget/Budget.css";

export default function Budget() {
	const [amount, setAmount] = useState(0);
	const [duration, setDuration] = useState("1 month");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const userData = JSON.parse(localStorage.getItem("userData"));
		const email = userData?.email;

		const currentDate = new Date().toISOString();

		if (email) {
			try {
				// Send POST request to the backend with email in the request body
				const response = await axios.post("http://localhost:5000/api/auth/budget", {
					email,
					budget: {
						amount,
						duration,
						date: currentDate, 
					},
				});
				console.log("Budget saved successfully", response.data);
			} catch (error) {
				console.error("Error saving budget:", error);
			}
		} else {
			console.error("Email not found in local storage");
		}
	};

	return (
		<div className='budget'>
			<h1>Set Your Budget</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label className='amount'>Amount:</label>
					<input
						type='number'
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						required
					/>
				</div>
				<div>
					<label className='duration'>Duration:</label>
					<input
						type='text'
						value={duration}
						onChange={(e) => setDuration(e.target.value)}
						required
					/>
				</div>
				<button type='submit'>Save Budget</button>
			</form>
		</div>
	);
}
