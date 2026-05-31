import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
const Trades = ({
  trades, 
  deleteTrade, 
  filter, 
  setFilter, 
  setTrades,
  clearAllTrades,
  search,
  setSearch,
  sort,
  setSort,
  modalBox,
  setModalBox
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    pair: "",
    bias: "",
    reason: "",
    result: "",
    pnl: ""
  });
  const getTimeAgo = (dateString) => {
    const now = Date.now();
    const past = new Date(dateString).getTime();
    const diff = now - past;

    const seconds = Math.floor(diff / (1000));
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if(seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  }


  // console.log(trades);
  const filteredTrades = trades
    .filter((trade) => {
      if(filter === "all") return true;
      if(filter === "win") return trade.result === "Win";
      if(filter === "loss") return trade.result === "Loss";
      if(filter === "breakeven") return trade.result === "Breakeven";

      return true;
    })
    .filter((trade)=> trade.pair.toLowerCase().includes(search.toLowerCase()))

  const sortedTrades = [...filteredTrades].sort((a, b) => { 
    if (sort === "latest") return b.id - a.id; 
    if (sort === "oldest") return a.id - b.id; 
    if (sort === "highest") return parseFloat(b.pnl) - parseFloat(a.pnl); 
    if (sort === "lowest") return parseFloat(a.pnl) - parseFloat(b.pnl); 
    return 0;
  });
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({...prev, [name]: value}))
  };

  const saveEdit = (id) => {
    // --- 1. NEW EDIT DATA PROTECTION ACCURACY CHECKS ---
    const numericalPnL = parseFloat(editForm.pnl);

    if (editForm.result === "Win" && numericalPnL <= 0) {
      setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A winning trade cannot have a negative or a zero PnL value.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
      });
      return; // Blocks the edit from saving
    }

    if (editForm.result === "Loss" && numericalPnL >= 0) {
      setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A losing trade cannot have a positive or a zero PnL value.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
      });
      return; // Blocks the edit from saving
    }

    if (editForm.result === "Breakeven" && numericalPnL !== 0) {
      setModalBox({
          isOpen: true,
          title: "❌ Accuracy Conflict",
          message: "A breakeven trade PnL value must be exactly 0.",
          onConfirm: () => {
            setModalBox((prev) => ({...prev, isOpen: false}))
          }
      });
      return;
    }

    const updatedTrades = trades.map((trade) => {
      if(trade.id === id ){
        return {...trade, ...editForm};
      }
      return trade;
    });
    // updating the whole list
    setTrades(updatedTrades);
    // exit edit mode
    setEditingId(null);
    setEditForm({
      pair: "",
      bias: "",
      reason: "",
      result: "",
      pnl: ""
    });
  }
  
  return (
    <div>
      <h2>Trades</h2>
      <div className="controls">
        {/* LEFT SIDE */}
        <div className="left-controls">
          <input
            type="text"
            placeholder="Search trades (e.g XAU, BTC)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              Clear
            </button>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="right-controls">
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest PnL</option>
            <option value="lowest">Lowest PnL</option>
          </select>

          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "win" ? "active" : ""}
              onClick={() => setFilter("win")}
            >
              Win
            </button>
            <button
              className={filter === "loss" ? "active" : ""}
              onClick={() => setFilter("loss")}
            >
              Loss
            </button>
            <button
              className={filter === "breakeven" ? "active" : ""}
              onClick={() => setFilter("breakeven")}
            >
              BE
            </button>
          </div>
          <button className="clear-all-btn" onClick={clearAllTrades}>
            Clear All
          </button>
        </div>
      </div>
      {sortedTrades.length === 0 ? (
        <div className="no-data-card">
          <p className="no-data">No trades found 😅</p>
          <small className="no-data-helper">
            Double-check your spelling, adjust your search keywords, or reset your current filters.
          </small>
        </div>
      ) : (
        sortedTrades.map((trade) => (
          <ul key={trade.id} className={`trade-card ${trade.result.toLowerCase()}`}>
            <li>
                {editingId === trade.id ? (
                  <div className="edit-form">
                    <div className="edit-fields-row">
                      <div className="edit-group">
                        <label htmlFor="pair">Trading Pair</label>
                        <input name="pair" id="pair" value={editForm.pair} onChange={handleEditChange} />
                      </div>

                      <div className="edit-group">
                        <label htmlFor="bias">Market Bias</label>
                        <select id="bias" name="bias" value={editForm.bias} onChange={handleEditChange}>
                          <option value="Long">Long</option>
                          <option value="Short">Short</option>
                        </select>
                      </div>

                      <div className="edit-group">
                        <label htmlFor="result">Trade Outcome</label>
                        <select id="result" name="result" value={editForm.result} onChange={handleEditChange}>
                          <option value="Win">Win</option>
                          <option value="Loss">Loss</option>
                          <option value="Breakeven">Breakeven</option>
                        </select>
                      </div>

                      <div className="edit-group">
                        <label htmlFor="pnl">Profit / Loss (PnL)</label>
                        <input id="pnl" name="pnl" value={editForm.pnl} onChange={handleEditChange} />
                      </div>

                      <div className="edit-group full-width">
                        <label htmlFor="reason">Trade Confluence / Reason</label>
                        <textarea id="reason" name="reason" value={editForm.reason} onChange={handleEditChange} />
                      </div>
                    </div>

                    <div className="edit-rightside">
                      <button className="save-btn" onClick={() => saveEdit(trade.id)}>Save</button>
                      <button className="cancel-btn" onClick={() => {
                        setEditingId(null);
                        setEditForm({ pair: "", bias: "", reason: "", result: "", pnl: "" });
                      }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="trade-header">
                      <h3>Pair: {trade.pair}</h3>

                      <div className="trade-header-right">
                        
                        <span 
                          className="trade-time"
                          title={new Date(trade.createdAt).toLocaleString()} /* Converts to readable local calendar time */
                        >
                          {getTimeAgo(trade.createdAt)}
                        </span>
                        
                        <div className="actions">
                          <button 
                            onClick={() => {
                            setEditingId(trade.id);
                            setEditForm({
                              pair: trade.pair,
                              bias: trade.bias,
                              reason: trade.reason,
                              result: trade.result,
                              pnl: trade.pnl
                            });
                          }}>
                            <Pencil size={16} strokeWidth={2.5} />
                          </button>

                          <button onClick={() => deleteTrade(trade.id)}>
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="trade-card-body">
                      <div className="trade-details-row">
                        <span className={`badge ${trade.bias.toLowerCase()}`}>
                          {trade.bias}
                        </span>
                        <span className={`badge result-${trade.result.toLowerCase()}`}>
                          {trade.result}
                        </span>
                      </div>
                      <div className="trade-reason">
                        <strong>Reason:</strong>
                        <ul>
                          {trade.reason.split("\n").map((line, index)=> (
                            <li key={index}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="trade-pnl-display">
                        <span className="pnl-label">PnL: </span>
                        <span className={`pnl-value ${parseFloat(trade.pnl) >= 0 ? "pnl-positive" : "pnl-negative"}`}>
                          {parseFloat(trade.pnl) >= 0 ? 
                           `+${parseFloat(trade.pnl)}%` : 
                           `-${Math.abs(parseFloat(trade.pnl))}%`
                           }
                        </span>
                      </div>
                    </div>
                    
                  </>
                )}

            </li>
          </ul>
        ))
      )}
    </div>
  );
};

export default Trades;