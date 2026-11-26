'use client';

import React, { useState } from 'react';
import { Eye, Plus, Trash2, ArrowRight, CheckCircle2, Clock } from '../icons';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../lib/constants';

export const WatchlistView = ({
  watchlist = [],
  currentPrices,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onOpenCreateAlert,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('22K');
  const [note, setNote] = useState('');
  const [targetBuyPrice, setTargetBuyPrice] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!targetBuyPrice) return;
    onAddToWatchlist({
      metal,
      purity: metal === 'silver' ? 'silver' : purity,
      note: note.trim() || `${metal === 'gold' ? `${purity} Gold` : 'Silver'} Purchase Target`,
      targetBuyPrice: parseFloat(targetBuyPrice),
    });
    setNote('');
    setTargetBuyPrice('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Personal Bullion Watchlist</h3>
          <p className="text-xs text-slate-500">Track purchase targets for jewellery, gold coins & silver bars</p>
        </div>
        <Button variant="gold" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Watchlist Item
        </Button>
      </div>

      {/* Watchlist cards */}
      {watchlist.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D6A84F] flex items-center justify-center mx-auto mb-3">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your watchlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Pin specific purchase goals (e.g. Wedding gold necklace, Diwali silver coin) to monitor price dips.
          </p>
          <div className="mt-5">
            <Button variant="gold" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add First Goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {watchlist.map((item) => {
            const isGold = item.metal === 'gold';
            const currentSpot = isGold
              ? currentPrices?.gold?.[item.purity]?.pricePerGram || 8050
              : currentPrices?.silver?.silver?.pricePerGram || 98.50;

            const isPriceReached = currentSpot <= item.targetBuyPrice;
            const diff = currentSpot - item.targetBuyPrice;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isGold ? 'gold-badge text-slate-950' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isGold ? item.purity : 'Ag'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {isGold ? `${item.purity} Gold` : '999 Silver'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Added {new Date(item.addedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 mt-3 line-clamp-2">
                    {item.note}
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target Buy Price:</span>
                      <span className="font-extrabold text-slate-900">
                        {formatINR(item.targetBuyPrice, item.metal === 'silver')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Current Spot Rate:</span>
                      <span className="font-bold text-slate-700">
                        {formatINR(currentSpot, item.metal === 'silver')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isPriceReached ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Target Reached!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      ₹{Math.abs(Math.round(diff))} above target
                    </span>
                  )}

                  <button
                    onClick={() =>
                      onOpenCreateAlert({
                        metal: item.metal,
                        purity: item.purity,
                        currentPrice: item.targetBuyPrice,
                      })
                    }
                    className="text-xs font-bold text-[#9A6F20] hover:underline"
                  >
                    Set Alert →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to Watchlist Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add to Bullion Watchlist"
        subtitle="Track a purchase target for jewellery or investment"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Metal</label>
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
              </select>
            </div>

            {metal === 'gold' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Purity</label>
                <select
                  value={purity}
                  onChange={(e) => setPurity(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                >
                  <option value="22K">22K Standard</option>
                  <option value="24K">24K Bullion</option>
                  <option value="18K">18K Hallmark</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Goal Description / Jewellery Note
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding Gold Bangle (20g)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Buying Price (₹/g)
            </label>
            <input
              type="number"
              placeholder="e.g. 7150"
              required
              value={targetBuyPrice}
              onChange={(e) => setTargetBuyPrice(e.target.value)}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Save to Watchlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
