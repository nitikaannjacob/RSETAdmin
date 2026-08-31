import React, { useState, useEffect } from 'react';
import { BusRouteInfo } from '../types';
import { 
  Bus, 
  MapPin, 
  Radio, 
  RefreshCw, 
  Phone, 
  Navigation, 
  Info, 
  CheckCircle2, 
  Clock, 
  Play, 
  Pause,
  Sparkles
} from 'lucide-react';

interface BusTrackingViewProps {
  busRoutes: BusRouteInfo[];
  onUpdateRoute: (updatedRoute: BusRouteInfo) => void;
}

export const BusTrackingView: React.FC<BusTrackingViewProps> = ({
  busRoutes,
  onUpdateRoute
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || 'route-42');
  const activeRoute = busRoutes.find(r => r.id === selectedRouteId) || busRoutes[0];

  const [liveStatus, setLiveStatus] = useState<'active' | 'inactive'>(activeRoute.status);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(activeRoute.currentStopIndex);
  const [etaMins, setEtaMins] = useState<number>(activeRoute.etaNextStopMins);
  const [pushToast, setPushToast] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [callModal, setCallModal] = useState<boolean>(false);

  // Sync state when route changes
  useEffect(() => {
    setLiveStatus(activeRoute.status);
    setCurrentStopIndex(activeRoute.currentStopIndex);
    setEtaMins(activeRoute.etaNextStopMins);
  }, [activeRoute.id]);

  // Live Transit Simulation Loop
  useEffect(() => {
    let interval: any;
    if (isSimulating && liveStatus === 'active') {
      interval = setInterval(() => {
        setEtaMins(prev => {
          if (prev <= 1) {
            // Advance to next stop
            setCurrentStopIndex(curr => {
              const nextStop = (curr + 1) % activeRoute.stops.length;
              return nextStop;
            });
            return 5;
          }
          return prev - 1;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, liveStatus, activeRoute.stops.length]);

  const handlePushUpdate = () => {
    const updated: BusRouteInfo = {
      ...activeRoute,
      status: liveStatus,
      currentStopIndex,
      etaNextStopMins: etaMins
    };
    onUpdateRoute(updated);
    setPushToast(`Telematics broadcasted: ${activeRoute.routeNumber} is now at ${activeRoute.stops[currentStopIndex]?.name} (~${etaMins} mins to next stop).`);
    setTimeout(() => setPushToast(null), 3500);
  };

  const handleCallDriver = () => {
    setCallModal(true);
  };

  // Calculate progress percentage for track bar
  const progressPct = Math.round((currentStopIndex / Math.max(1, activeRoute.stops.length - 1)) * 100);

  return (
    <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full space-y-6">
      {/* Toast Notification */}
      {pushToast && (
        <div className="p-3 bg-[#000f27] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{pushToast}</span>
          </div>
          <button onClick={() => setPushToast(null)} className="text-white/70 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Call Driver Modal */}
      {callModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f27]/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#c4c6cf]/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
              <Phone className="w-8 h-8 text-emerald-700 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#000f27]">Connecting to Driver</h4>
              <p className="text-sm font-semibold text-[#1b1b1e] mt-1">{activeRoute.driver.name}</p>
              <p className="text-xs font-mono text-[#5c5f60]">{activeRoute.driver.phone}</p>
              <p className="text-[11px] text-[#5c5f60] mt-2">Vehicle Reg: {activeRoute.driver.vehicleNumber}</p>
            </div>
            <button
              onClick={() => setCallModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold shadow-md hover:opacity-90"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Route Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#000f27] tracking-tight">
              {activeRoute.routeNumber}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              liveStatus === 'active'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-[#efedf1] text-[#5c5f60] border-[#c4c6cf]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${liveStatus === 'active' ? 'bg-emerald-500 animate-ping' : 'bg-[#5c5f60]'}`} />
              {liveStatus === 'active' ? 'Live Active' : 'Inactive'}
            </span>

            {/* Route Switcher Pills */}
            <div className="flex items-center gap-1.5 ml-2">
              {busRoutes.map(route => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    route.id === activeRoute.id
                      ? 'bg-[#000f27] text-white shadow-sm'
                      : 'bg-[#efedf1] text-[#5c5f60] hover:bg-[#e3e2e5]'
                  }`}
                >
                  {route.routeNumber.replace('Bus ', '')}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#5c5f60]">{activeRoute.routeName} • Pass {activeRoute.passNumber}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
              isSimulating
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                : 'bg-white text-[#000f27] border-[#c4c6cf] hover:bg-[#faf9fc]'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? 'Live Simulation Active' : 'Simulate Route Transit'}
          </button>

          <div className="w-12 h-12 bg-[#d6e3ff] rounded-2xl flex items-center justify-center text-[#011b3e] shadow-sm">
            <Bus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: 8 Cols Controls & Schedule + 4 Cols Student Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Schedule + Controls + Driver (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Schedule Bento Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#c4c6cf]/30 flex flex-col md:flex-row gap-6 justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#faf9fc] rounded-full opacity-60 pointer-events-none" />
            
            <div className="flex-1 space-y-1">
              <p className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">Morning Pickup</p>
              <p className="text-2xl font-bold text-[#000f27] tracking-tight">{activeRoute.morningPickup.time}</p>
              <p className="text-xs text-[#5c5f60] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#000f27] shrink-0" />
                <span>{activeRoute.morningPickup.location}</span>
              </p>
            </div>

            <div className="hidden md:block w-px bg-[#efedf1] self-stretch" />
            <div className="md:hidden h-px w-full bg-[#efedf1]" />

            <div className="flex-1 space-y-1">
              <p className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">Evening Departure</p>
              <p className="text-2xl font-bold text-[#000f27] tracking-tight">{activeRoute.eveningDeparture.time}</p>
              <p className="text-xs text-[#5c5f60] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#000f27] shrink-0" />
                <span>{activeRoute.eveningDeparture.location}</span>
              </p>
            </div>
          </div>

          {/* Manual Override Controls */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#c4c6cf]/30 space-y-6">
            <h3 className="font-bold text-base text-[#000f27] flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#0b2447]" />
              Manual Override Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Status Toggle */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block">
                  Live Status
                </label>
                <div className="flex items-center gap-2 bg-[#f5f3f6] p-1.5 rounded-xl border border-[#efedf1]">
                  <button
                    type="button"
                    onClick={() => setLiveStatus('active')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      liveStatus === 'active'
                        ? 'bg-white text-[#000f27] shadow-sm border border-emerald-300'
                        : 'text-[#5c5f60] hover:text-[#000f27]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveStatus('inactive')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      liveStatus === 'inactive'
                        ? 'bg-white text-[#000f27] shadow-sm border border-[#c4c6cf]'
                        : 'text-[#5c5f60] hover:text-[#000f27]'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Current Stop Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block">
                  Current Stop
                </label>
                <select
                  value={currentStopIndex}
                  onChange={(e) => setCurrentStopIndex(parseInt(e.target.value))}
                  className="w-full bg-[#f5f3f6] border border-[#c4c6cf] rounded-xl px-4 py-2.5 text-xs font-bold text-[#000f27] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none"
                >
                  {activeRoute.stops.map((stop, index) => (
                    <option key={stop.id} value={index}>
                      {index + 1}. {stop.name} ({stop.time})
                    </option>
                  ))}
                </select>
              </div>

              {/* Update ETA & Push Button */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block">
                  Update ETA to Next Stop (Mins)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={etaMins}
                    onChange={(e) => setEtaMins(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 bg-[#f5f3f6] border border-[#c4c6cf] rounded-xl px-4 py-2.5 font-bold text-xl text-[#000f27] text-center focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePushUpdate}
                    className="bg-[#000f27] hover:bg-[#0b2447] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Push Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info Card */}
          <div className="bg-[#f5f3f6] rounded-2xl p-5 flex items-center justify-between border border-[#efedf1]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#000f27] rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                {activeRoute.driver.initials}
              </div>
              <div>
                <p className="font-bold text-sm text-[#000f27]">
                  {activeRoute.driver.name} <span className="text-xs font-normal text-[#5c5f60]">(Driver)</span>
                </p>
                <p className="text-xs font-mono text-[#5c5f60] mt-0.5">{activeRoute.driver.phone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCallDriver}
              className="bg-[#000f27] hover:bg-[#0b2447] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              Call Driver
            </button>
          </div>
        </div>

        {/* Right Column: Student Preview (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c4c6cf]/30 sticky top-24 space-y-5">
            {/* Student Preview Header */}
            <div className="flex items-center justify-between border-b border-[#efedf1] pb-4">
              <div>
                <h3 className="font-bold text-sm text-[#000f27] flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#000f27]" />
                  Student Mobile Preview
                </h3>
                <p className="text-[11px] text-[#5c5f60] mt-0.5">{activeRoute.routeName}</p>
              </div>
              <span className="text-emerald-800 font-mono text-[11px] font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                ~{etaMins}m away
              </span>
            </div>

            {/* Live Route Vertical Stepper / Timeline */}
            <div className="py-2 px-1">
              <div className="relative pl-6 space-y-6">
                {/* Continuous Vertical Connecting Line */}
                <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-[#efedf1]" />
                
                {/* Active Progress Fill on Connecting Line */}
                <div 
                  className="absolute left-[13px] top-3 w-0.5 bg-[#000f27] transition-all duration-500 ease-in-out" 
                  style={{ 
                    height: `${(currentStopIndex / Math.max(1, activeRoute.stops.length - 1)) * 100}%` 
                  }}
                />

                {/* Stop Items */}
                {activeRoute.stops.map((stop, idx) => {
                  const isCurrent = idx === currentStopIndex;
                  const isPassed = idx < currentStopIndex;
                  const isNext = idx === currentStopIndex + 1;

                  return (
                    <div 
                      key={stop.id} 
                      onClick={() => setCurrentStopIndex(idx)}
                      className={`relative flex items-start gap-3.5 group cursor-pointer transition-all ${
                        isCurrent ? 'scale-[1.02]' : ''
                      }`}
                    >
                      {/* Node Icon on the vertical line */}
                      <div className="absolute -left-6 top-0.5 flex items-center justify-center">
                        {isCurrent ? (
                          <div className="relative flex items-center justify-center">
                            <div className="w-7 h-7 bg-[#000f27] rounded-full flex items-center justify-center text-white shadow-md ring-4 ring-[#d6e3ff]">
                              <Bus className="w-3.5 h-3.5 animate-bounce" />
                            </div>
                            <span className="absolute -inset-1 rounded-full bg-[#000f27]/20 animate-ping pointer-events-none" />
                          </div>
                        ) : isPassed ? (
                          <div className="w-4 h-4 rounded-full bg-[#000f27] border-2 border-white shadow-sm flex items-center justify-center text-white mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white border-2 border-[#c4c6cf] group-hover:border-[#000f27] shadow-sm mt-1 transition-colors" />
                        )}
                      </div>

                      {/* Stop Content Box */}
                      <div className={`flex-1 p-2.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-[#000f27]/5 border-[#000f27]/30 shadow-xs' 
                          : 'bg-[#faf9fc] border-[#efedf1] hover:border-[#c4c6cf]'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold ${
                            isCurrent ? 'text-[#000f27]' : 'text-[#1b1b1e]'
                          }`}>
                            {stop.name}
                          </h4>
                          <span className="text-[10px] font-mono font-medium text-[#5c5f60] shrink-0">
                            {stop.time}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-[#5c5f60]">Stop {idx + 1} of {activeRoute.stops.length}</span>
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Current Location
                            </span>
                          ) : isPassed ? (
                            <span className="text-[10px] font-medium text-[#5c5f60]">
                              Departed
                            </span>
                          ) : isNext ? (
                            <span className="text-[10px] font-bold text-[#0b2447] bg-[#d6e3ff]/40 px-1.5 py-0.5 rounded">
                              Next (~{etaMins}m)
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#74777f]">
                              En route
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informational Callout Box */}
            <div className="bg-[#f5f3f6] p-3.5 rounded-2xl border border-[#efedf1] flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-[#5c5f60] shrink-0 mt-0.5" />
              <p className="text-xs text-[#5c5f60] leading-relaxed">
                Live synced with student mobile apps. Click any stop or push an update from the left to test live tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
