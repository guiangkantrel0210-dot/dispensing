import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { PharmacyStore } from '../types';
import { MapPin, Navigation, Phone, Clock, DollarSign, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { playDispenserSound } from '../services/api';

interface PharmacyMapProps {
  pharmacies: PharmacyStore[];
  selectedPharmacyId: string;
  onSelectPharmacy: (id: string) => void;
  onReserveRefill: (pharmacy: PharmacyStore) => void;
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
  onReserveRefill
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA9EKz3QbF2zThppy-ONcep5_0Xf4aJrxo';
  const selectedPharmacy = pharmacies.find(p => p.id === selectedPharmacyId) || pharmacies[0];
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Metro central coordinates

  const handleReserve = (pharmacy: PharmacyStore) => {
    playDispenserSound('success');
    setReservationSuccess(pharmacy.name);
    onReserveRefill(pharmacy);
    setTimeout(() => {
      setReservationSuccess(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Nearest Pharmacies & Price Comparison</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare bioequivalent generic prices for Amlodipine 10mg & Losartan 50mg along your taxi route.
          </p>
        </div>

        <div className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
          Save up to 70% with Community Clinic Programs
        </div>
      </div>

      {/* Main Layout: Interactive Map + Pharmacy Price Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Map View Container */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative h-[420px] shadow-xl">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat: selectedPharmacy.lat, lng: selectedPharmacy.lng }}
                center={{ lat: selectedPharmacy.lat, lng: selectedPharmacy.lng }}
                defaultZoom={13}
                gestureHandling="cooperative"
                disableDefaultUI={false}
                mapId="maaoew_pharmacy_map"
                className="w-full h-full"
              >
                {pharmacies.map((pharmacy) => {
                  const isSelected = pharmacy.id === selectedPharmacyId;
                  return (
                    <AdvancedMarker
                      key={pharmacy.id}
                      position={{ lat: pharmacy.lat, lng: pharmacy.lng }}
                      onClick={() => onSelectPharmacy(pharmacy.id)}
                      title={pharmacy.name}
                    >
                      <Pin
                        background={isSelected ? '#06b6d4' : '#10b981'}
                        borderColor="#0f172a"
                        glyphColor="#0f172a"
                        scale={isSelected ? 1.25 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </APIProvider>
          ) : (
            /* Fallback SVG Interactive Visual Map */
            <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="z-10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Route Coverage: Downtown & Transit Corridor</span>
                <span className="text-cyan-400 font-mono">GPS Anchored</span>
              </div>

              {/* Pins visualization */}
              <div className="z-10 grid grid-cols-2 gap-4 my-auto">
                {pharmacies.map((pharmacy) => {
                  const isSelected = pharmacy.id === selectedPharmacyId;
                  return (
                    <button
                      key={pharmacy.id}
                      onClick={() => onSelectPharmacy(pharmacy.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-emerald-400'}`} />
                        <span className="truncate">{pharmacy.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {pharmacy.distanceMiles} mi · {pharmacy.drivingMinutes} min drive
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                        ${pharmacy.comboGenericTotal.toFixed(2)}/mo
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Floating Map Card for currently selected pharmacy */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs shadow-xl flex items-center justify-between z-10">
            <div>
              <div className="font-bold text-white">{selectedPharmacy.name}</div>
              <div className="text-[11px] text-slate-400">
                {selectedPharmacy.address} · <span className="text-cyan-300 font-mono">{selectedPharmacy.distanceMiles} miles ({selectedPharmacy.drivingMinutes} min drive)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-emerald-400 font-bold text-sm">
                ${selectedPharmacy.comboGenericTotal.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">Generic Combo / mo</div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Price Comparison & Pharmacy Roster */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Compare Prescriptions & Dispensary Options
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {pharmacies.map((pharmacy) => {
              const isSelected = pharmacy.id === selectedPharmacyId;
              const savings = (pharmacy.amlodipineBrandPrice + pharmacy.losartanBrandPrice) - pharmacy.comboGenericTotal;

              return (
                <div
                  key={pharmacy.id}
                  onClick={() => onSelectPharmacy(pharmacy.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{pharmacy.name}</span>
                        {pharmacy.inStock && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            In Stock
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {pharmacy.address}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono text-slate-400">
                        {pharmacy.distanceMiles} mi · <span className="text-cyan-300">{pharmacy.drivingMinutes}m taxi drive</span>
                      </div>
                      <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                        ${pharmacy.comboGenericTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Price Comparison Breakdown Strip */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Amlodipine 10mg</div>
                      <div className="flex items-center justify-between font-mono mt-0.5">
                        <span className="text-emerald-400 font-semibold">${pharmacy.amlodipineGenericPrice.toFixed(2)}</span>
                        <span className="text-slate-500 line-through text-[11px]">${pharmacy.amlodipineBrandPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Losartan 50mg</div>
                      <div className="flex items-center justify-between font-mono mt-0.5">
                        <span className="text-emerald-400 font-semibold">${pharmacy.losartanGenericPrice.toFixed(2)}</span>
                        <span className="text-slate-500 line-through text-[11px]">${pharmacy.losartanBrandPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-cyan-300 font-mono">
                      Program: {pharmacy.discountProgramName}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">
                      Save ${savings.toFixed(2)} / mo
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReserve(pharmacy);
                      }}
                      className="flex-1 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Reserve Refill Pickup
                    </button>

                    <a
                      href={`tel:${pharmacy.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Call Pharmacy"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {reservationSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Refill successfully reserved at {reservationSuccess}! Pharmacist notified.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
