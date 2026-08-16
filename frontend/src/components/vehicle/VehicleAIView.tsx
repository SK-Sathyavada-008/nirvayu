import React, { useState } from 'react';
import { 
  Upload, 
  Car, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Activity,
  Camera
} from 'lucide-react';
import { VEHICLE_TEST_PRESETS } from '../../data/mockData';
import type { VehicleAnalysisResult } from '../../types';
import { apiService } from '../../services/api';

export const VehicleAIView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(VEHICLE_TEST_PRESETS[0].image);
  const [analysisResult, setAnalysisResult] = useState<VehicleAnalysisResult>(VEHICLE_TEST_PRESETS[0].analysis);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>(VEHICLE_TEST_PRESETS[0].id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setActivePresetId('');
    setIsAnalyzing(true);

    try {
      const result = await apiService.analyzeVehicle(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Vehicle analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: typeof VEHICLE_TEST_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setActivePresetId(preset.id);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(preset.analysis);
      setIsAnalyzing(false);
    }, 450);
  };

  const getSeverityStyle = (score: number) => {
    if (score >= 80) return { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', label: 'Critical High Emitter' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Moderate Emitter' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Compliant / Clean Fleet' };
  };

  const statusStyle = getSeverityStyle(analysisResult.emission_risk_score);

  return (
    <div className="space-y-6">
      {/* Header & Advisory Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Car className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Vehicle Tailpipe Emission Vision AI Screening
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multimodal optical screening model assessing visible exhaust plumes, soot opacity, and commercial fleet profiles.
              </p>
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="text-[11px] leading-tight">
            <strong>Screening Advisory:</strong> This is an AI-based visual screening system, <u>NOT</u> a legally certified emissions test.
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Test Scenario Presets (1-Click AI Evaluation):
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Prototype Presets
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VEHICLE_TEST_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-900"
                />
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">{p.analysis.vehicle_type}</span>
                  <span className={`text-[10px] font-semibold mt-1 inline-block ${
                    p.analysis.emission_risk_score >= 80 ? 'text-rose-400' : p.analysis.emission_risk_score >= 60 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    Risk Score: {p.analysis.emission_risk_score}/100
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Stage: Upload & Image Viewer on Left, AI Assessment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Preview & Upload Zone */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Optical Evidence Capture
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">1080p Optical Input</span>
            </div>

            {/* Image Preview Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Vehicle Tailpipe Analysis"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isAnalyzing ? 'opacity-40 blur-xs' : 'opacity-100'}`}
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Car className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No image loaded</p>
                </div>
              )}

              {/* Loading Scanner Animation Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-xs">
                  <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-white">Extracting Optical Plume Vector...</span>
                  <span className="text-[10px] text-emerald-400 mt-1 font-mono">Evaluating Ringelmann Scale</span>
                </div>
              )}
            </div>

            {/* File Upload Trigger */}
            <label className="border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center transition-colors">
              <Upload className="w-5 h-5 text-emerald-400 mb-1.5" />
              <span className="text-xs font-bold text-slate-200">Upload Live Vehicle Photo</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP from traffic camera or roadside audit</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Column: AI Analysis Results Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Vision Screening Findings
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {analysisResult.vehicle_type}
                </h3>
              </div>

              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.label}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Emission Risk Score</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-black font-mono ${statusStyle.text}`}>
                    {analysisResult.emission_risk_score}
                  </span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Smoke Plume Severity</span>
                <span className="text-xs font-bold text-white block mt-1 truncate">
                  {analysisResult.smoke_severity}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Screening Confidence</span>
                <span className="text-xs font-bold text-emerald-400 block mt-1 font-mono">
                  {(analysisResult.confidence * 100).toFixed(0)}% Statistical Match
                </span>
              </div>
            </div>

            {/* AI Technical Observations */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Gemini Vision AI Observations</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {analysisResult.observations}
              </p>
            </div>

            {/* Recommended Municipal Protocol */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended Authority Action</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {analysisResult.recommended_action}
              </p>
            </div>

            {/* Legal / Regulatory Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
              <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                {analysisResult.disclaimer || "This is an AI-based visual screening system, NOT a legally certified emissions test."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
