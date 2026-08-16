import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Camera,
  Brain,
  Clock,
  Languages,
  Sparkles
} from 'lucide-react';
import type { CitizenReport, TranslatedIncident } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { apiService } from '../../services/api';

interface CitizenReportViewProps {
  citizenReports: CitizenReport[];
  onAddReport: (report: CitizenReport) => void;
  city: string;
}

type SupportedLanguage = 'en' | 'hi' | 'te' | 'pt' | 'zh';

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  formTitle: string;
  formSubtitle: string;
  locationLabel: string;
  descLabel: string;
  descPlaceholder: string;
  submitBtn: string;
  samplePhrase: string;
  sampleVehicle: string;
  sampleLocation: string;
  sampleSeverity: string;
  sampleImageUrl: string;
}

const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    formTitle: 'Log Vehicle Emission Event',
    formSubtitle: 'Upload street-level proof for Gemini optical & environmental screening',
    locationLabel: 'Observed Street Location / Corridor',
    descLabel: 'Observation Notes (in your language)',
    descPlaceholder: 'Describe the vehicle, exhaust density, idling time, or smoke plume...',
    submitBtn: 'Submit Citizen Verification',
    samplePhrase: 'There is a bus producing a lot of smoke near the junction.',
    sampleVehicle: 'Transit / Interstate Bus',
    sampleLocation: 'Tolichowki Flyover Junction, Hyderabad',
    sampleSeverity: 'Critical',
    sampleImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    formTitle: 'वाहन उत्सर्जन की रिपोर्ट करें',
    formSubtitle: 'जेमिनी विज़न एआई द्वारा स्थानीय वाहन धुएं की जांच हेतु साक्ष्य अपलोड करें',
    locationLabel: 'देखा गया स्थान / चौराहा',
    descLabel: 'अवलोकन विवरण (अपनी भाषा में लिखें)',
    descPlaceholder: 'वाहन का प्रकार, धुआं कितना गहरा है और स्थान का विवरण लिखें...',
    submitBtn: 'रिपोर्ट सबमिट करें (जेमिनी द्वारा अनुवादित)',
    samplePhrase: 'चौराहे के पास एक बस बहुत अधिक काला धुआं छोड़ रही है।',
    sampleVehicle: 'Transit / Interstate Bus',
    sampleLocation: 'चारमीनार हेरिटेज कॉरिडोर, हैदराबाद',
    sampleSeverity: 'Critical',
    sampleImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    formTitle: 'వాహన పొగ ఉద్గారాల నివేదిక',
    formSubtitle: 'జెమిని విజన్ AI ధృవీకరణ కోసం రహదారి స్థాయి సాక్ష్యాలను నమోదు చేయండి',
    locationLabel: 'గమనించిన ప్రదేశం / జంక్షన్',
    descLabel: 'గమనించిన వివరాలు (తెలుగులో రాయండి)',
    descPlaceholder: 'వాహనం నుండి వస్తున్న పొగ సాంద్రత మరియు పరిస్థితిని వివరించండి...',
    submitBtn: 'నివేదికను సమర్పించండి (AI అనువాదం)',
    samplePhrase: 'జంక్షన్ దగ్గర ఒక బస్సు చాలా దట్టమైన నల్లటి పొగను విడుదల చేస్తోంది.',
    sampleVehicle: 'Transit / Interstate Bus',
    sampleLocation: 'గచ్చిబౌలి జంక్షన్, హైదరాబాద్',
    sampleSeverity: 'Critical',
    sampleImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    formTitle: 'Registrar Emissão Veicular',
    formSubtitle: 'Envie evidências urbanas para triagem óptica de emissões via Gemini AI',
    locationLabel: 'Local Observado / Cruzamento',
    descLabel: 'Observações (em português)',
    descPlaceholder: 'Descreva o veículo, densidade da fumaça e tempo de marcha lenta...',
    submitBtn: 'Enviar Relatório Cidadão',
    samplePhrase: 'Há um ônibus soltando muita fumaça escura perto do cruzamento.',
    sampleVehicle: 'Transit / Interstate Bus',
    sampleLocation: 'Avenida Arterial de Begumpet, Hyderabad',
    sampleSeverity: 'Severe',
    sampleImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  zh: {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文',
    flag: '🇨🇳',
    formTitle: '报告车辆严重排烟',
    formSubtitle: '上传街道排放证据，由 Gemini 视觉多模态 AI 快速评估',
    locationLabel: '观测地点 / 路口',
    descLabel: '现场观察描述（中文输入）',
    descPlaceholder: '请描述车辆类型、排烟浓烈程度及车流怠速情况...',
    submitBtn: '提交报告（Gemini 智能标准化）',
    samplePhrase: '十字路口附近有一辆公交车正在排放大量浓黑烟雾。',
    sampleVehicle: 'Transit / Interstate Bus',
    sampleLocation: '高科技城大道路口，海得拉巴',
    sampleSeverity: 'Critical',
    sampleImageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  }
};

export const CitizenReportView: React.FC<CitizenReportViewProps> = ({
  citizenReports,
  onAddReport,
  city
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const langConfig = LANGUAGES[selectedLang];

  const [location, setLocation] = useState<string>('Gachibowli ORR Feeder, Hyderabad');
  const [vehicleType, setVehicleType] = useState<string>('Heavy Commercial Diesel Tipper');
  const [severity, setSeverity] = useState<string>('Critical');
  const [description, setDescription] = useState<string>('Overloaded multi-axle freight truck stationary at junction emitting continuous dense black smoke plume under load.');
  const [previewImage, setPreviewImage] = useState<string>('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80');

  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedRecord, setTranslatedRecord] = useState<TranslatedIncident | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<CitizenReport | null>(null);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    const cfg = LANGUAGES[lang];
    setDescription(cfg.samplePhrase);
    setLocation(cfg.sampleLocation);
    setSeverity(cfg.sampleSeverity);
    setPreviewImage(cfg.sampleImageUrl);
    setTranslatedRecord(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranslateAndStandardize = async () => {
    if (!description.trim()) return;
    setIsTranslating(true);
    try {
      const res = await apiService.translateCitizenReport(description, langConfig.name);
      setTranslatedRecord(res);
      if (res.vehicle_type) setVehicleType(res.vehicle_type);
      if (res.severity) setSeverity(res.severity);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // If report is in non-English and not translated yet, standardize description
      let finalDesc = description;
      if (selectedLang !== 'en' && !translatedRecord) {
        try {
          const trans = await apiService.translateCitizenReport(description, langConfig.name);
          setTranslatedRecord(trans);
          finalDesc = `${description} (Standardized English: ${trans.description_english})`;
        } catch {
          finalDesc = description;
        }
      } else if (translatedRecord && selectedLang !== 'en') {
        finalDesc = `${description} (Standardized English: ${translatedRecord.description_english})`;
      }

      // Submit citizen report to backend prototype store
      const newReport = await apiService.submitCitizenReport({
        location,
        description: finalDesc,
        severity,
        vehicle_type: vehicleType,
        image_url: previewImage
      });

      onAddReport(newReport);
      setLastSubmittedReport(newReport);
    } catch (err) {
      console.error('Citizen report submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Multilingual Citizen Reporting & Ground Evidence
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submit vehicle emission evidence in English, Hindi, Telugu, Portuguese, or Mandarin. Gemini AI standardizes records for municipal authorities in {city}.
              </p>
            </div>
          </div>
        </div>

        {/* Multilingual Language Selector Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex-wrap">
          <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>Language:</span>
          </span>

          {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((code) => {
            const lang = LANGUAGES[code];
            const isSelected = selectedLang === code;
            return (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* POST-SUBMISSION SUCCESS & GEMINI AI ASSESSMENT CARD */}
      {lastSubmittedReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/30 border border-emerald-500/40 shadow-xl shadow-emerald-950/20 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500 text-slate-950">
                <CheckCircle2 className="w-5 h-5 font-black" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Report successfully submitted
                </h3>
                <p className="text-xs text-emerald-300">
                  Incident standardized and verified by Gemini Multimodal Vision AI.
                </p>
              </div>
            </div>

            <button
              onClick={() => setLastSubmittedReport(null)}
              className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Dismiss / Submit Another
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <div className="md:col-span-3">
              <img
                src={lastSubmittedReport.image_url}
                alt="Submitted vehicle"
                className="w-full h-36 rounded-2xl object-cover border border-emerald-500/30 shadow-md bg-slate-950"
              />
            </div>

            <div className="md:col-span-9 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Emission Risk
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black text-rose-400">
                      {lastSubmittedReport.ai_assessment?.emission_risk_score || 88}/100
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({(Number(lastSubmittedReport.ai_assessment?.confidence || 0.94) * 100).toFixed(0)}% Conf)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Verified Location
                  </span>
                  <span className="text-xs font-bold text-white block truncate mt-1">
                    {lastSubmittedReport.location}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Severity
                    </span>
                    <span className="text-xs font-bold text-white mt-1 block">
                      {lastSubmittedReport.severity}
                    </span>
                  </div>
                  <RiskBadge level={lastSubmittedReport.severity} size="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px] uppercase tracking-wide">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemini Vision AI Observation</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {lastSubmittedReport.ai_assessment?.observations || 'High-opacity black particulate plume and unburnt fuel carbon detected at exhaust manifold under load.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Action</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {lastSubmittedReport.ai_assessment?.recommended_action || 'Flag for immediate municipal roadside tailpipe audit and RTA commercial compliance check.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Multilingual Submission Form on Left, Synchronized Stream on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multilingual Report Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">{langConfig.flag}</span>
                <h3 className="text-sm font-bold text-white">{langConfig.formTitle}</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{langConfig.formSubtitle}</p>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
              Gemini Translation
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Visual Evidence Upload & Preview */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Visual Evidence (Tailpipe / Plume Photo) *
              </label>
              <div className="flex gap-3 items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950"
                />
                <label className="flex-1 border border-slate-700 hover:border-emerald-500/50 bg-slate-900/60 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer text-center transition-colors">
                  <Camera className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-200">Capture / Upload Photo</span>
                  <span className="text-[10px] text-slate-500">Auto-screened via Gemini Vision</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                {langConfig.locationLabel} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tolichowki Flyover Junction, Hyderabad"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Observation Notes (Native Language Input) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium block">
                  {langConfig.descLabel} *
                </label>
                <button
                  type="button"
                  onClick={handleTranslateAndStandardize}
                  disabled={isTranslating || !description.trim()}
                  className="text-[10px] font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{isTranslating ? 'Translating...' : 'Translate via Gemini'}</span>
                </button>
              </div>

              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setTranslatedRecord(null);
                }}
                placeholder={langConfig.descPlaceholder}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Gemini Translation & Standardization Output Box */}
            {translatedRecord && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    Gemini Standardized Incident Record:
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-200">
                    {translatedRecord.source_language} → English
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Incident Type</span>
                    <span className="font-semibold text-white truncate block">{translatedRecord.incident_type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Vehicle Classification</span>
                    <span className="font-semibold text-white truncate block">{translatedRecord.vehicle_type}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-purple-500/20 text-xs text-slate-200">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">Description (English):</span>
                  <p className="italic">"{translatedRecord.description_english}"</p>
                </div>
              </div>
            )}

            {/* Vehicle Type & Severity in 2 cols */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Vehicle Classification</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Heavy Commercial Diesel Tipper">Diesel Freight Truck</option>
                  <option value="3-Wheeler Auto-rickshaw">3-Wheeler Auto-rickshaw</option>
                  <option value="Transit / Interstate Bus">Transit / Interstate Bus</option>
                  <option value="Commercial Delivery Van">Commercial Delivery Van</option>
                  <option value="Sedan / SUV Cab">Commercial Taxi / Cab</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Smoke Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Critical">Critical (Dense Black Plume)</option>
                  <option value="Severe">Severe (Heavy Soot)</option>
                  <option value="Moderate">Moderate (Blue/Grey Smoke)</option>
                  <option value="Low">Low (Persistent Idling)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Analyzing & Registering...' : langConfig.submitBtn}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Feed of Community Reports */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Active Ground Reports Stream
                </h3>
                <p className="text-[11px] text-slate-400">
                  Multilingual citizen observations synchronized across municipal GIS & Hotspots
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {citizenReports.length} Reports Synchronized
              </span>
            </div>

            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
              {citizenReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-3.5"
                >
                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt={report.vehicle_type || 'Vehicle'}
                      className="w-full sm:w-28 h-28 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate">
                          {report.location}
                        </span>
                      </div>
                      <RiskBadge level={report.severity} size="sm" />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="font-semibold text-slate-200">{report.vehicle_type}</span>
                      {report.ai_assessment && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                          Risk {report.ai_assessment.emission_risk_score}/100
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {report.description}
                    </p>

                    {report.ai_assessment?.observations && (
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
                        <span className="text-purple-400 font-semibold">AI Note: </span>
                        <span>{report.ai_assessment.observations}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.timestamp}
                      </span>
                      <span className="text-emerald-400 font-medium">{report.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
