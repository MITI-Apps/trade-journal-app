import { useState } from "react";
import { useNavigate } from "react-router-dom";


const AddTrade = ({trades, setTrades, modalBox, setModalBox}) => {
    const [pair, setPair] = useState("");
    const [bias, setBias] = useState("");
    const [reason, setReason] = useState("");
    const [result, setResult] = useState("");
    const [pnl, setPnl] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault()

       // --- 1. NEW DATA PROTECTION ACCURACY CHECKS ---
      const numericalPnl = parseFloat(pnl);
      if (result === "Win" && numericalPnl < 0){
        setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A winning trade cannot have a negative PnL value.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
        });
        return;// this loops away from the function and stops it from running entirely
      }
      if (result === "Loss" && numericalPnl > 0){
        setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A losing trade cannot have a positive PnL value.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
        });
        return; // Stops the function instantly and blocks the save
      }
      if (result === "Breakeven" && numericalPnl !== 0){
        setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A breakeven trade PnL value must be exactly 0.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
        });
        return; // Stops the function instantly and blocks the save
      }

      const newTrade = {
        id: Date.now(),
        pair,
        bias,
        reason,
        result,
        pnl,
        createdAt: new Date().toISOString()
      };
      setTrades([...trades, newTrade]);
      setTimeout(() => {     // this slows down the redirect, so users can see toast
        navigate("/");
      }, 800);
      // console.log(newTrade);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      setPair("");
      setBias("");
      setReason("");
      setResult("");
      setPnl("");
      
    };
 
    return (
      <div className="add-trade-container">
        {showToast && (
          <div className="success-toast">
            <span>✓</span>Trade Logged Successfully!
          </div>
        )}
        <h2>Log New Trade</h2>
        
        <form onSubmit={handleSubmit} className="trade-form">
          <div className="form-group">
            <label>Trading Pair</label>
            <input
              type="text"
              placeholder="e.g. XAU/USD, BTC/USDT"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Market Bias</label>
            <select
              value={bias}
              onChange={(e) => setBias(e.target.value)}
              required
            >
              <option value="">Select Direction</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trade Confluence / Reason</label>
            <textarea
              placeholder="What setups or patterns did you spot in the market?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Trade Outcome</label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              required
            >
              <option value="">Select Result</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Breakeven">Breakeven</option>
            </select>
          </div>
          <div className="form-group">
            <label>Profit / Loss (PnL)</label>
            <input
              type="text"
              placeholder="PnL (e.g +5%, -2%)"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              required
            />
          </div>

          <div className="form-actions-row">
            
            {/* Primary Submit Button */}
            <button type="submit" className="submit-trade-btn">
              Save Trade Entry
            </button>
            
            {/* Secondary Reset Button */}
            <button 
              type="button" 
              className="clear-trade-btn"
              onClick={() => {
                setPair("");
                setBias("");
                setReason("");
                setResult("");
                setPnl("");
              }}
            >
              Clear Form
            </button>

          </div>
        </form>
      </div>
    );
};

export default AddTrade;