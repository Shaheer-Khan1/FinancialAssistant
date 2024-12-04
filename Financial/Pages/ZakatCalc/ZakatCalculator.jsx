import React, { useState, useEffect } from "react";
import "../ZakatCalc/ZakatCalculator.css";
export default function ZakatCalculator() {
	const [goldPricePerTola, setGoldPricePerTola] = useState(null);
	const [silverPricePerTola, setSilverPricePerTola] = useState(null);
	const [cash, setCash] = useState(0);
	const [goldInTola, setGoldInTola] = useState(0);
	const [silverInTola, setSilverInTola] = useState(0);
	const [businessAssets, setBusinessAssets] = useState(0);
	const [debtsOwed, setDebtsOwed] = useState(0);
	const [debtsReceivable, setDebtsReceivable] = useState(0);
	const [zakatAmount, setZakatAmount] = useState(null);
	const [nisabValue, setNisabValue] = useState(0);

	const nisabTola = 7.3; // Nisab in tola of gold

	// Fetch Gold and Silver Prices from CoinGecko API
	useEffect(() => {
		fetch("https://api.coingecko.com/api/v3/simple/price?ids=gold,silver&vs_currencies=usd")
			.then((response) => response.json())
			.then((data) => {
				const goldPriceInUSD = data.gold.usd;
				const silverPriceInUSD = data.silver.usd;

				// Convert prices to per tola (1 tola = 11.663g, 1 ounce = 31.1035g)
				setGoldPricePerTola((goldPriceInUSD * 31.1035) / 11.663); // USD per tola
				setSilverPricePerTola((silverPriceInUSD * 31.1035) / 11.663); // USD per tola
			})
			.catch((error) => {
				console.error("Error fetching gold and silver prices:", error);
			});
	}, []);

	const calculateNisabValue = () => {
		return nisabTola * goldPricePerTola; // Nisab in currency value based on current gold price per tola
	};

	const handleCalculate = () => {
		const totalAssets = cash + goldInTola * goldPricePerTola + silverInTola * silverPricePerTola + businessAssets + debtsReceivable - debtsOwed;

		const nisab = calculateNisabValue();
		setNisabValue(nisab);

		if (totalAssets >= nisab) {
			const zakat = (totalAssets * 2.5) / 100;
			setZakatAmount(zakat);
		} else {
			setZakatAmount(0);
		}
	};

	return (
		<div className='zakatcalculator'>
			<h1>Zakat Calculator</h1>
			<form>
				<div className='form-1'>
					<label>Cash and Savings (in your currency):</label>
					<input
						type='number'
						value={cash}
						onChange={(e) => setCash(parseFloat(e.target.value))}
					/>
				</div>
				<div>
					<label>Gold Price per Tola (in your currency):</label>
					<input
						className='gold-price'
						type='number'
						value={goldPricePerTola || ""}
						readOnly
					/>

					<label>Gold (in tola):</label>
					<input
						type='number'
						value={goldInTola}
						onChange={(e) => setGoldInTola(parseFloat(e.target.value))}
					/>
				</div>

				<div className=' silver-container'>
					<label>Silver Price per Tola (in your currency):</label>
					<input
						className='silver-price'
						type='number'
						value={silverPricePerTola || ""}
						readOnly
					/>

					<label>Silver (in tola):</label>
					<input
						type='number'
						value={silverInTola}
						onChange={(e) => setSilverInTola(parseFloat(e.target.value))}
					/>
				</div>

				<div>
					<label>Business Assets (in your currency):</label>
					<input
						type='number'
						value={businessAssets}
						onChange={(e) => setBusinessAssets(parseFloat(e.target.value))}
					/>
				</div>

				<div>
					<label>Debts Owed to You (Receivable): </label>
					<input
						type='number'
						value={debtsReceivable}
						onChange={(e) => setDebtsReceivable(parseFloat(e.target.value))}
					/>

					<label>Debts You Owe:</label>
					<input
						type='number'
						value={debtsOwed}
						onChange={(e) => setDebtsOwed(parseFloat(e.target.value))}
					/>
				</div>

				<button
					type='button'
					onClick={handleCalculate}>
					Calculate Zakat
				</button>
			</form>

			{zakatAmount !== null && (
				<div className='zakat-result-container'>
					{zakatAmount > 0 ? (
						<>
							<h2>Your Zakat Amount: {zakatAmount.toFixed(2)} (in your currency)</h2>
							<p>Your total wealth meets the Nisab threshold of {nisabValue.toFixed(2)} (in your currency). Zakat is due.</p>
						</>
					) : (
						<>
							<h2>No Zakat Due</h2>
							<p>Your total wealth is below the Nisab threshold of {nisabValue.toFixed(2)} (in your currency).</p>
						</>
					)}
				</div>
			)}
		</div>
	);
}
