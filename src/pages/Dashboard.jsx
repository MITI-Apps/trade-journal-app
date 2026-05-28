import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
const Dashboard = ({ trades, timeRange, setTimeRange }) => {
    const now = Date.now();
    let filteredTrades = trades;

    const rangeMap = {
        "7d": 7,
        "30d": 30,
        "90d": 90
    }

    if (timeRange !== "all"){
        const days = rangeMap[timeRange];
        const cutOff = now - (days * 24 * 60 * 60 * 1000)

        filteredTrades = trades.filter((trade) => {
            return new Date(trade.createdAt).getTime() >= cutOff;
        });
    }
    
    const totalTrades = filteredTrades.length;
    const wins = filteredTrades.filter((trade)=> trade.result === "Win").length;
    const losses = filteredTrades.filter((trade)=> trade.result === "Loss").length;
    const breakeven = filteredTrades.filter((trade)=> trade.result === "Breakeven").length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
    const totalPnL = filteredTrades.reduce((acc, trade)=> {
        const value = parseFloat(trade.pnl);
        return acc + (isNaN(value) ? 0 : value);
    } , 0);
    const avgPnL = totalTrades > 0 ? (totalPnL / totalTrades).toFixed(2) : 0;
    
    const CHART_COLORS = ["#22c55e", "#ef4444", "#64748b"];
    /** Classifying for display on pie chart */
    const data = [
        {name: "Wins", value: wins},
        {name: "Losses", value: losses},
        {name: "Breakeven", value: breakeven}
    ];
    // console.log({totalTrades, wins, losses, breakeven});
    // console.log(winRate);
    return (
        <div className="dashboard">
            <h2 className="dashboard-title">Performance Dashboard</h2>
            <div className="time-filter">
                <button
                  className={timeRange === "all" ? "active" : ""} 
                  onClick={() => setTimeRange("all")}
                >All</button>
                <button 
                  className={timeRange === "7d" ? "active" : ""} 
                  onClick={() => setTimeRange("7d")}
                >7D</button>
                <button 
                  className={timeRange === "30d" ? "active" : ""} 
                  onClick={() => setTimeRange("30d")}
                >30D</button>                
                <button 
                  className={timeRange === "90d" ? "active" : ""} 
                  onClick={() => setTimeRange("90d")}
                >90D</button>
            </div>

            {filteredTrades.length === 0 ? (
                <div className="no-data-card">
                    <p className="no-data">No trades logged in this period 📉</p>
                    <small className="no-data-helper">Switch timeframes or start logging new entries to see analytical metrics.</small>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="card total-card">
                        <h3>Total Trades</h3>
                        <p>{totalTrades}</p>
                        </div>

                        <div className="card win-card">
                        <h3>Wins</h3>
                        <p>{wins}</p>
                        </div>

                        <div className="card loss-card">
                        <h3>Losses</h3>
                        <p>{losses}</p>
                        </div>

                        <div className="card be-card">
                        <h3>Breakeven</h3>
                        <p>{breakeven}</p>
                        </div>

                        <div className="card winrate-card">
                        <h3>Win Rate</h3>
                        <p>{winRate}%</p>
                        </div>

                        <div className={`card pnl-card ${totalPnL >= 0 ? "postive-state" : "negative-state"}`}>
                        <h3>Total PnL</h3>
                        <p>{totalPnL >= 0 ? `+${(totalPnL).toFixed(2)}%` : `-${(Math.abs(totalPnL)).toFixed(2)}%`}</p>
                        </div>

                        <div className={`card pnl-card ${avgPnL >= 0 ? "postive-state" : "negative-state"}`}>
                        <h3>Avg PnL</h3>
                        <p>{avgPnL >= 0 ? `+${avgPnL}%` : `-${Math.abs(avgPnL)}%`}</p>
                        </div>

                    </div>
                    <div className="chart-wrapper">
                        <h3>Distribution Breakdown</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        outerRadius={120}
                                        //innerRadius={60} /* Transforms it into a gorgeous modern donut chart */
                                        //paddingAngle={4}
                                        label
                                    >
                                        {data.map((entry, index) => (
                                            <Cell 
                                            key={`cell-${index}`} 
                                            fill={CHART_COLORS[index]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                    contentStyle={{ background: '#222', borderRadius: '8px', color: '#fff', border: 'none' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default Dashboard;