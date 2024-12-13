import React, { useState } from "react";
import "./ZakatCalculator.css";

export default function ZakatCalculator() {
  const [cashAndSavings, setCashAndSavings] = useState(0);
  const [goldInTola, setGoldInTola] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [debtsOwed, setDebtsOwed] = useState(0);
  const [zakatAmount, setZakatAmount] = useState(null);
  const [nisabValue, setNisabValue] = useState(0);

  const goldPricePerTola = 284100; // gold price in PKR
  const silverPricePerTola = 3351; // silver price in PKR
  const nisabTola = 7.5; // Nisab in tola of gold

  const fetchDebts = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const email = userData.email; 

    try {
      const response = await fetch("http://localhost:5000/api/auth/showdebts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        const totalDebts = data.debts.reduce((sum, debt) => sum + debt.amount, 0);
        setDebtsOwed(totalDebts);
      } else {
        console.error("Error fetching debts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
  };

  const calculateNisabValue = () => {
    return nisabTola * goldPricePerTola;
  };

  const handleCalculate = () => {
    const totalWealth =
      cashAndSavings + goldInTola * goldPricePerTola + businessAssets - debtsOwed;

    const nisab = calculateNisabValue();
    setNisabValue(nisab);

    if (totalWealth >= nisab) {
      const zakat = (totalWealth * 2.5) / 100;
      setZakatAmount(zakat);
    } else {
      setZakatAmount(0);
    }
  };

  return (
    <div className="zakat-calculator">
      <h1>Zakat Calculator (PKR)</h1>
      <p>
        Calculate your Zakat based on the current price of gold and your total
        assets. The Nisab threshold is determined by 7.5 tola of gold.
      </p>
      <form>
        <div>
          <label>Cash and Savings (PKR):</label>
          <input
            type="number"
            value={cashAndSavings}
            onChange={(e) => setCashAndSavings(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label>Gold Price per Tola (PKR):</label>
          <input type="number" value={goldPricePerTola.toFixed(2)} readOnly />

          <label>Gold in Tola:</label>
          <input
            type="number"
            value={goldInTola}
            onChange={(e) => setGoldInTola(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label>Business Assets (PKR):</label>
          <input
            type="number"
            value={businessAssets}
            onChange={(e) => setBusinessAssets(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label>Debts You Owe (PKR):</label>
          <button type="button" onClick={fetchDebts}>Fetch Debts</button>
          <input
            type="number"
            value={debtsOwed}
            readOnly
          />
        </div>

        <button type="button" onClick={handleCalculate}>
          Calculate Zakat
        </button>
      </form>

      {zakatAmount !== null && (
        <div className="zakat-result">
          {zakatAmount > 0 ? (
            <>
              <h2>Your Zakat Amount: {zakatAmount.toFixed(2)} PKR</h2>
              <p>
                Your total wealth meets the Nisab threshold of {nisabValue.toFixed(
                  2
                )} PKR. Zakat is due.
              </p>
            </>
          ) : (
            <>
              <h2>No Zakat Due</h2>
              <p>
                Your total wealth is below the Nisab threshold of {nisabValue.toFixed(
                  2
                )} PKR.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
