import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddTrade from "./pages/AddTrade";
import Trades from "./pages/Trades";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
function App() {
  const [trades, setTrades] = useLocalStorage("mylist", []);
  const [filter, setFilter] = useLocalStorage("filter", "all");
  const [sort, setSort] = useLocalStorage("sort", "latest");
  const [search, setSearch] = useLocalStorage("search", "");
  
  const [lastDeleted, setLastDeleted] = useState(null);
  const [backedUpTrades, setBackedUpTrades] = useState([]);
  const [timeRange, setTimeRange] = useLocalStorage("timeRange", "all");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });
  
  const deleteTrade = (id) => {
    const tradeToDelete = trades.find((trade) => trade.id === id)
    
    setModalConfig({
      isOpen: true,
      title: "Delete Trade Log",
      message: `Are you sure you want to delete the trade for ${tradeToDelete.pair}?`,
      onConfirm: () => {
        setLastDeleted(tradeToDelete);
        const filteredTrades = trades.filter((trade)=> trade.id !== id);
        setTrades(filteredTrades);
        setModalConfig((prev) => ({...prev, isOpen: false}))
        setTimeout(() => {
          setLastDeleted(null);
        }, 6000);        
      }
    })
  }
  const clearAllTrades = () => {
    if (trades.length === 0) return;
    setModalConfig({
      isOpen: true,
      title: "Wipe Trade History",
      message: `Are you absolutely sure you want to delete ALL ${trades.length} trades? This action is destructive.`,
      onConfirm: () => {
        setBackedUpTrades(trades);
        setTrades([]);
        setModalConfig((prev) => ({...prev, isOpen: false}));
        setTimeout(() => {
          setBackedUpTrades([]);
        }, 8000);        
      }
    })
    
  };
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> 
        <Link to="/add">Add Trade</Link> 
        <Link to="/trades">Trades</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard 
        trades={trades}
        setTimeRange={setTimeRange}
        timeRange={timeRange}
        />} />
        <Route path="/add" element={
          <AddTrade trades={trades} setTrades={setTrades} />
        } />
        <Route path="/trades" element={
          <Trades trades={trades} 
          deleteTrade={deleteTrade}
          filter={filter}
          setFilter={setFilter}
          setTrades={setTrades}
          clearAllTrades={clearAllTrades}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          />
        } />
      </Routes>
      {lastDeleted && (
        <div className="undo-toast">
          <span className="undo-text">
            Trade Deleted
          </span>
          <button 
            className="undo-btn-action"
            onClick={() => {
              setTrades((prev) => [...prev, lastDeleted]);
              setLastDeleted(null);
          }}>
            Undo
          </button>
        </div>
      )}

      {backedUpTrades.length > 0 && (
        <div className="undo-toast master-clear-toast">
          <span className="undo-text">
            Wiped {backedUpTrades.length} trades from history.
          </span>
          <button 
            className="undo-btn-action alert-action"
            onClick={() => {
              setTrades(backedUpTrades);
              setBackedUpTrades([]);
          }}>
            Undo Clear All
          </button>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{modalConfig.title}</h3>
            <p>{modalConfig.message}</p>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setModalConfig((prev) => ({...prev, isOpen: false}))}
              >
                Cancel
              </button>
              <button
                className="modal-confirm-btn"
                onClick={modalConfig.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;