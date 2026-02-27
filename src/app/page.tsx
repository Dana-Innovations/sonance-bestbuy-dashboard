"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Area, AreaChart,
} from "recharts";

const TEAL = "#00A3E1";
const CHARCOAL = "#343d46";
const SILVER = "#e2e2e2";
const COLORS = ["#00A3E1", "#343d46", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"];

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function fmtCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = useMemo(() => {
    const filtered = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : [...products];

    const total = filtered.length;
    const onSale = filtered.filter((p) => p.onSale).length;
    const inStore = filtered.filter((p) => p.inStore).length;
    const online = filtered.filter((p) => p.online).length;
    const prices = filtered.map((p) => p.regularPrice).filter(Boolean) as number[];
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const rated = filtered.filter((p) => p.rating != null);
    const avgRating = rated.length ? rated.reduce((a, p) => a + (p.rating as number), 0) / rated.length : 0;
    const totalReviews = filtered.reduce((a, p) => a + (p.reviewCount || 0), 0);

    const catMap: Record<string, number> = {};
    filtered.forEach((p) => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
    const categoryData = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name: name.length > 25 ? name.slice(0, 22) + "..." : name, fullName: name, value }));

    const colorMap: Record<string, number> = {};
    filtered.forEach((p) => { colorMap[p.color] = (colorMap[p.color] || 0) + 1; });
    const colorData = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    const priceBuckets = [
      { range: "< $100", min: 0, max: 100 },
      { range: "$100-$500", min: 100, max: 500 },
      { range: "$500-$1K", min: 500, max: 1000 },
      { range: "$1K-$2K", min: 1000, max: 2000 },
      { range: "$2K-$3K", min: 2000, max: 3000 },
      { range: "$3K+", min: 3000, max: Infinity },
    ];
    const priceDistribution = priceBuckets.map((b) => ({
      range: b.range,
      count: filtered.filter((p) => p.regularPrice >= b.min && p.regularPrice < b.max).length,
    }));

    const saleProducts = filtered
      .filter((p) => p.onSale && p.regularPrice && p.salePrice)
      .map((p) => ({
        name: p.model || p.name.split(" - ")[1]?.slice(0, 30) || p.name.slice(0, 30),
        savings: Math.round(((p.regularPrice - p.salePrice) / p.regularPrice) * 100),
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
      }))
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 10);

    const topRated = [...filtered]
      .filter((p) => p.rating != null && p.reviewCount >= 3)
      .sort((a, b) => (b.rating as number) - (a.rating as number) || b.reviewCount - a.reviewCount)
      .slice(0, 8);

    return {
      total, onSale, inStore, online, avgPrice, minPrice, maxPrice,
      avgRating, totalReviews, rated: rated.length,
      categoryData, colorData, priceDistribution, saleProducts, topRated,
    };
  }, [selectedCategory]);

  const allCategories = useMemo(() => {
    const catMap: Record<string, number> = {};
    products.forEach((p) => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: "linear-gradient(135deg, #F5F5F5 0%, #e8ecef 50%, #F5F5F5 100%)" }}>
      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: TEAL }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight" style={{ color: CHARCOAL }}>
                Sonance <span className="font-medium">Best Buy</span> Dashboard
              </h1>
            </div>
            <p className="text-sm font-normal ml-11" style={{ color: "#718096" }}>
              Product catalog analytics &middot; {products.length} products &middot; Updated Feb 2026
            </p>
          </div>
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)} className="self-start md:self-auto px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-all" style={{ background: TEAL, color: "white" }}>
              Clear Filter: {selectedCategory}
            </button>
          )}
        </div>
        <div className="accent-bar mt-4" />
      </div>

      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Total Products", value: fmt(stats.total), accent: false },
            { label: "On Sale", value: fmt(stats.onSale), accent: true },
            { label: "In Store", value: fmt(stats.inStore), accent: false },
            { label: "Online", value: fmt(stats.online), accent: false },
            { label: "Avg Price", value: fmtCurrency(stats.avgPrice), accent: false },
            { label: "Price Range", value: `${fmtCurrency(stats.minPrice)}-${fmtCurrency(stats.maxPrice)}`, accent: false },
            { label: "Avg Rating", value: stats.avgRating.toFixed(1) + " \u2605", accent: true },
            { label: "Total Reviews", value: fmt(stats.totalReviews), accent: false },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card-sm p-4">
              <div className="stat-label mb-2">{kpi.label}</div>
              <div className="stat-value" style={{ color: kpi.accent ? TEAL : CHARCOAL, fontSize: kpi.label === "Price Range" ? "1.1rem" : undefined }}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass-card p-5 lg:col-span-2">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Products by Category</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#718096" }} />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#4a5568" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} cursor={{ fill: "rgba(0,163,225,0.05)" }} />
                  <Bar dataKey="value" fill={TEAL} radius={[0, 6, 6, 0]} cursor="pointer" onClick={(data: { fullName: string }) => setSelectedCategory(data.fullName)} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Color Distribution</h2>
            <div className="h-[320px] flex flex-col items-center">
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie data={stats.colorData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} stroke="none">
                    {stats.colorData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center px-2">
                {stats.colorData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: "#4a5568" }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card p-5">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Price Distribution</h2>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.priceDistribution} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#718096" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#718096" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="count" stroke={TEAL} strokeWidth={2} fill="url(#tealGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Best Deals &mdash; Discount %</h2>
            {stats.saleProducts.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No sale items in this category</p>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.saleProducts} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#718096" }} angle={-25} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: "#718096" }} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass-card p-5 lg:col-span-2 overflow-x-auto">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Top Rated Products</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: SILVER }}>
                  <th className="text-left py-2 font-medium text-xs uppercase tracking-wider" style={{ color: "#718096" }}>Product</th>
                  <th className="text-right py-2 font-medium text-xs uppercase tracking-wider" style={{ color: "#718096" }}>Rating</th>
                  <th className="text-right py-2 font-medium text-xs uppercase tracking-wider" style={{ color: "#718096" }}>Reviews</th>
                  <th className="text-right py-2 font-medium text-xs uppercase tracking-wider" style={{ color: "#718096" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.topRated.map((p) => (
                  <tr key={p.sku} className="border-b" style={{ borderColor: "#f3f3f3" }}>
                    <td className="py-2.5 pr-4 max-w-[300px] truncate" title={p.name}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: CHARCOAL }}>
                        {p.model || p.name.split(" - ").slice(1).join(" - ").slice(0, 50)}
                      </a>
                    </td>
                    <td className="py-2.5 text-right font-medium" style={{ color: TEAL }}>{(p.rating as number).toFixed(1)} &#9733;</td>
                    <td className="py-2.5 text-right" style={{ color: "#718096" }}>{p.reviewCount}</td>
                    <td className="py-2.5 text-right font-medium">{fmtCurrency(p.regularPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: CHARCOAL }}>Filter by Category</h2>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
              {allCategories.map(([cat, count]) => (
                <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left" style={{ background: selectedCategory === cat ? TEAL : "rgba(0,0,0,0.02)", color: selectedCategory === cat ? "white" : CHARCOAL }}>
                  <span className="truncate mr-2">{cat}</span>
                  <span className="text-xs font-medium flex-shrink-0 rounded-full px-2 py-0.5" style={{ background: selectedCategory === cat ? "rgba(255,255,255,0.2)" : "rgba(0,163,225,0.1)", color: selectedCategory === cat ? "white" : TEAL }}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#a0aec0" }}>
            Sonance &middot; Dana Innovations &middot; Data sourced from Best Buy API
          </p>
        </div>
      </div>
    </div>
  );
}