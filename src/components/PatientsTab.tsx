import React from "react";
import { 
  FolderHeart, 
  Search, 
  Plus, 
  Stethoscope, 
  Sliders, 
  FileText, 
  CheckSquare, 
  PlusCircle, 
  Save 
} from "lucide-react";
import { motion } from "motion/react";

interface PatientsTabProps {
  patients: any[];
  setPatients: React.Dispatch<React.SetStateAction<any[]>>;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  isAddingPatient: boolean;
  setIsAddingPatient: (val: boolean) => void;
  newPatientForm: any;
  setNewPatientForm: React.Dispatch<React.SetStateAction<any>>;
  activeToothNum: number | null;
  setActiveToothNum: (num: number | null) => void;
  isAddingPrescription: boolean;
  setIsAddingPrescription: (val: boolean) => void;
  rxDiagnosis: string;
  setRxDiagnosis: (val: string) => void;
  rxDrugs: any[];
  setRxDrugs: React.Dispatch<React.SetStateAction<any[]>>;
  newDrug: any;
  setNewDrug: React.Dispatch<React.SetStateAction<any>>;
  newPlanTitle: string;
  setNewPlanTitle: (val: string) => void;
  newPlanCost: string;
  setNewPlanCost: (val: string) => void;
  patientsSearch: string;
  setPatientsSearch: (val: string) => void;
  clinicConfig: any;
}

export default function PatientsTab({
  patients,
  setPatients,
  selectedPatientId,
  setSelectedPatientId,
  isAddingPatient,
  setIsAddingPatient,
  newPatientForm,
  setNewPatientForm,
  activeToothNum,
  setActiveToothNum,
  isAddingPrescription,
  setIsAddingPrescription,
  rxDiagnosis,
  setRxDiagnosis,
  rxDrugs,
  setRxDrugs,
  newDrug,
  setNewDrug,
  newPlanTitle,
  setNewPlanTitle,
  newPlanCost,
  setNewPlanCost,
  patientsSearch,
  setPatientsSearch,
  clinicConfig,
}: PatientsTabProps) {
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <div className="space-y-6 text-right" id="patients-ehr-tab" dir="rtl">
      <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl">
        <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <FolderHeart className="w-5 h-5 text-teal-600" />
          <span>سامانه پرونده الکترونیک سلامت (EHR) و چارت دندان دیجیتال</span>
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
          در این بخش می‌توانید پرونده‌های درمانی بیماران را جستجو، ایجاد و مدیریت کنید. وضعیت تک‌تک دندان‌های مراجع بر روی چارت گرافیکی ۳۲ عددی قابل ترسیم و نسخه‌های دارویی و طرح درمان نیز قابل برنامه‌ریزی هستند.
        </p>
      </div>

      {/* EHR Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* RIGHT SIDEBAR: Patients List (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-800">لیست بیماران ثبت شده</span>
            <button
              onClick={() => setIsAddingPatient(!isAddingPatient)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-colors flex items-center gap-1 cursor-pointer border-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingPatient ? "انصراف" : "بیمار جدید"}</span>
            </button>
          </div>

          {/* Search patient input */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا شماره تماس..."
              value={patientsSearch}
              onChange={(e) => setPatientsSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-slate-50 text-slate-800 text-right placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          {/* Add Patient Collapsible Form */}
          {isAddingPatient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-xl border border-teal-100 bg-teal-50/20 space-y-3 text-xs text-right"
            >
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">نام و نام خانوادگی بیمار:</label>
                <input
                  type="text"
                  value={newPatientForm.fullName}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, fullName: e.target.value })}
                  placeholder="مثال: زهرا مرادی"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">شماره تماس:</label>
                  <input
                    type="text"
                    value={newPatientForm.phone}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                    placeholder="0912..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">کد ملی:</label>
                  <input
                    type="text"
                    value={newPatientForm.nationalId}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, nationalId: e.target.value })}
                    placeholder="001..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">سن بیمار (سال):</label>
                  <input
                    type="number"
                    value={newPatientForm.age}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                    placeholder="32"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">جنسیت:</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-right"
                  >
                    <option value="female">زن</option>
                    <option value="male">مرد</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">گروه خونی:</label>
                  <select
                    value={newPatientForm.bloodType}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-right"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">تاریخچه پزشکی / حساسیت:</label>
                  <input
                    type="text"
                    value={newPatientForm.history}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, history: e.target.value })}
                    placeholder="مثال: دیابت - حساسیت به آسپرین"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!newPatientForm.fullName || !newPatientForm.phone) {
                    alert("لطفاً نام بیمار و شماره تلفن را وارد نمایید.");
                    return;
                  }
                  const pId = `P-${Math.floor(100 + Math.random() * 900)}`;
                  const defaultChart: { [key: number]: string } = {};
                  for (let i = 1; i <= 32; i++) {
                    defaultChart[i] = "healthy";
                  }
                  const created = {
                    id: pId,
                    fullName: newPatientForm.fullName,
                    phone: newPatientForm.phone,
                    nationalId: newPatientForm.nationalId || "---",
                    age: parseInt(newPatientForm.age) || 30,
                    gender: newPatientForm.gender,
                    history: newPatientForm.history || "بدون بیماری زمینه ای",
                    bloodType: newPatientForm.bloodType,
                    dentalChart: defaultChart,
                    treatmentPlan: [],
                    prescriptions: []
                  };
                  setPatients([created, ...patients]);
                  setSelectedPatientId(pId);
                  setNewPatientForm({
                    fullName: "",
                    phone: "",
                    nationalId: "",
                    age: "",
                    gender: "female",
                    history: "بدون بیماری زمینه ای",
                    bloodType: "O+"
                  });
                  setIsAddingPatient(false);
                  alert("پرونده دیجیتال جدید مراجع با موفقیت در سامانه دنت فلو ذخیره شد.");
                }}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all cursor-pointer border-none"
              >
                ثبت و ایجاد پرونده دیجیتال
              </button>
            </motion.div>
          )}

          {/* Patient Cards List */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {patients
              .filter(p => 
                p.fullName.includes(patientsSearch) || 
                p.phone.includes(patientsSearch) ||
                p.id.includes(patientsSearch)
              )
              .map((p) => {
                const isSel = p.id === selectedPatientId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setActiveToothNum(null);
                    }}
                    className={`p-3.5 rounded-2xl text-right cursor-pointer border transition-all ${
                      isSel
                        ? "bg-teal-50/80 border-teal-200 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                          isSel ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          {p.fullName[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800">{p.fullName}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5" dir="ltr">{p.phone}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-mono">{p.id}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* LEFT WORKSPACE: Active Patient EHR Workspace (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {activePatient ? (
            <div className="space-y-6">
              {/* General EHR Info Card */}
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl text-right space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-800">{activePatient.fullName}</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full font-mono">{activePatient.id}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-bold">
                    کد ملی بیمار: <span className="font-mono text-slate-700">{activePatient.nationalId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-600">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">سن بیمار:</span>
                    <span className="text-slate-800 text-sm font-extrabold mt-1 block">{activePatient.age} سال</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">جنسیت:</span>
                    <span className="text-slate-800 text-sm font-extrabold mt-1 block">{activePatient.gender === "female" ? "زن" : "مرد"}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">گروه خونی:</span>
                    <span className="text-rose-600 text-sm font-extrabold mt-1 block font-mono">{activePatient.bloodType}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">شماره همراه:</span>
                    <span className="text-slate-800 text-sm font-mono font-bold mt-1 block" dir="ltr">{activePatient.phone}</span>
                  </div>
                </div>

                <div className="bg-rose-50/30 p-3.5 rounded-xl border border-rose-100/50 text-xs">
                  <span className="text-rose-700 font-extrabold block">پیشینه پزشکی و حساسیت‌های دارویی (EHR Sensitivities):</span>
                  <p className="text-slate-600 font-bold mt-1 leading-relaxed">{activePatient.history}</p>
                </div>
              </div>

              {/* Dental Chart Component */}
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl text-right space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>چارت تصویری و دندانپزشکی ۳۲ عددی بیمار</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">جهت ویرایش وضعیت هر دندان، روی شماره آن کلیک نمایید.</span>
                </div>

                {/* Interactive teeth rendering */}
                <div className="space-y-6" dir="ltr">
                  {/* UPPER ARCH */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-center text-slate-400 font-bold">MAXILLA (آرک فک بالا)</div>
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                      {Array.from({ length: 16 }, (_, i) => i + 1).map((toothNum) => {
                        const status = activePatient.dentalChart?.[toothNum] || "healthy";
                        const isAct = activeToothNum === toothNum;
                        let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
                        if (status === "decayed") colorClass = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
                        if (status === "filled") colorClass = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
                        if (status === "missing") colorClass = "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200";
                        if (status === "crowned") colorClass = "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";

                        return (
                          <button
                            key={toothNum}
                            onClick={() => setActiveToothNum(toothNum)}
                            className={`w-7 h-9 sm:w-10 sm:h-12 rounded-xl border text-xs font-black flex flex-col items-center justify-between py-1 transition-all cursor-pointer ${colorClass} ${
                              isAct ? "ring-2 ring-teal-500 scale-105 border-transparent shadow-md" : ""
                            }`}
                          >
                            <span className="text-[8px] text-slate-400 font-bold uppercase">{status === "healthy" ? "H" : status[0].toUpperCase()}</span>
                            <span className="text-[10px] sm:text-xs font-mono">{toothNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOWER ARCH */}
                  <div className="space-y-2 pt-2 border-t border-dashed border-slate-100">
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                      {Array.from({ length: 16 }, (_, i) => i + 17).map((toothNum) => {
                        const status = activePatient.dentalChart?.[toothNum] || "healthy";
                        const isAct = activeToothNum === toothNum;
                        let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
                        if (status === "decayed") colorClass = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
                        if (status === "filled") colorClass = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
                        if (status === "missing") colorClass = "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200";
                        if (status === "crowned") colorClass = "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";

                        return (
                          <button
                            key={toothNum}
                            onClick={() => setActiveToothNum(toothNum)}
                            className={`w-7 h-9 sm:w-10 sm:h-12 rounded-xl border text-xs font-black flex flex-col items-center justify-between py-1 transition-all cursor-pointer ${colorClass} ${
                              isAct ? "ring-2 ring-teal-500 scale-105 border-transparent shadow-md" : ""
                            }`}
                          >
                            <span className="text-[10px] sm:text-xs font-mono">{toothNum}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase">{status === "healthy" ? "H" : status[0].toUpperCase()}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-center text-slate-400 font-bold">MANDIBLE (آرک فک پایین)</div>
                  </div>
                </div>

                {/* Interactive Tooth Editor Drawer / Controls */}
                {activeToothNum !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700">تغییر وضعیت درمان دندان شماره <span className="font-mono text-teal-600 text-sm">{activeToothNum}</span>:</span>
                      <button
                        onClick={() => setActiveToothNum(null)}
                        className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer border-none bg-transparent"
                      >
                        بستن پنل ویرایش
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      {[
                        { id: "healthy", label: "سالم (Healthy)", color: "bg-emerald-600 text-white" },
                        { id: "decayed", label: "پوسیده (Decayed)", color: "bg-rose-600 text-white" },
                        { id: "filled", label: "پرشده (Filled)", color: "bg-blue-600 text-white" },
                        { id: "missing", label: "کشیده شده (Missing)", color: "bg-slate-500 text-white" },
                        { id: "crowned", label: "روکش (Crowned)", color: "bg-purple-600 text-white" }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            const updatedChart = { ...activePatient.dentalChart, [activeToothNum]: st.id };
                            const updatedList = patients.map(p => p.id === activePatient.id ? { ...p, dentalChart: updatedChart } : p);
                            setPatients(updatedList);
                            alert(`وضعیت دندان شماره ${activeToothNum} به «${st.label.split(" ")[0]}» بروزرسانی شد.`);
                          }}
                          className={`py-2 rounded-lg font-bold transition-all text-[11px] cursor-pointer border-none ${st.color} hover:opacity-90`}
                        >
                          {st.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Chart Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />سالم (Healthy)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />پوسیده (Decayed)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />پرشده (Filled)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 block" />کشیده شده (Missing)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 block" />روکش شده (Crowned)</span>
                </div>
              </div>

              {/* Grid for treatment plan and prescription writer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Area: Treatment Plan */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl text-right space-y-4">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    <span>برنامه و طرح درمان‌های فعال</span>
                  </h4>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {(!activePatient.treatmentPlan || activePatient.treatmentPlan.length === 0) ? (
                      <p className="text-xs text-slate-400 font-bold py-4 text-center">طرح درمانی برای این بیمار ثبت نشده است.</p>
                    ) : (
                      activePatient.treatmentPlan.map((plan: any) => {
                        let badgeColor = "bg-slate-100 text-slate-600";
                        let statusLabel = "برنامه‌ریزی";
                        if (plan.status === "in_progress") {
                          badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                          statusLabel = "در حال کار";
                        } else if (plan.status === "completed") {
                          badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                          statusLabel = "تکمیل شده";
                        }

                        return (
                          <div
                            key={plan.id}
                            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs font-bold"
                          >
                            <div className="space-y-0.5 text-right">
                              <span className="font-extrabold text-slate-800 block">{plan.title}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">هزینه: {plan.cost.toLocaleString("fa-IR")} تومان</span>
                            </div>
                            <button
                              onClick={() => {
                                const updatedPlan = activePatient.treatmentPlan.map((p: any) => {
                                  if (p.id === plan.id) {
                                    const nextStatus = p.status === "planned" ? "in_progress" : p.status === "in_progress" ? "completed" : "planned";
                                    return { ...p, status: nextStatus };
                                  }
                                  return p;
                                });
                                setPatients(patients.map(p => p.id === activePatient.id ? { ...p, treatmentPlan: updatedPlan } : p));
                              }}
                              className={`px-2.5 py-1 rounded-lg border font-black text-[10px] cursor-pointer transition-all ${badgeColor}`}
                            >
                              {statusLabel}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-right">
                    <span className="text-slate-500 font-bold block">افزودن طرح درمان جدید:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="عنوان درمان..."
                        value={newPlanTitle}
                        onChange={(e) => setNewPlanTitle(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="مبلغ حدودی (تومان)..."
                        value={newPlanCost}
                        onChange={(e) => setNewPlanCost(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newPlanTitle || !newPlanCost) {
                          alert("لطفاً عنوان درمان و هزینه را مشخص کنید.");
                          return;
                        }
                        const updatedPlan = [
                          ...(activePatient.treatmentPlan || []),
                          { id: Date.now(), title: newPlanTitle, cost: parseInt(newPlanCost) || 1000000, status: "planned" }
                        ];
                        setPatients(patients.map(p => p.id === activePatient.id ? { ...p, treatmentPlan: updatedPlan } : p));
                        setNewPlanTitle("");
                        setNewPlanCost("");
                        alert("آیتم طرح درمان جدید به پرونده بیمار پیوست شد.");
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer border-none"
                    >
                      پیوست طرح درمان به پرونده
                    </button>
                  </div>
                </div>

                {/* Right Area: Electronic Prescriptions */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl text-right space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>نسخه‌نویسی الکترونیکی (Rx Pad)</span>
                    </h4>
                    <button
                      onClick={() => setIsAddingPrescription(!isAddingPrescription)}
                      className="text-[10px] font-black text-teal-600 hover:underline cursor-pointer bg-transparent border-none"
                    >
                      {isAddingPrescription ? "انصراف" : "صدور نسخه جدید"}
                    </button>
                  </div>

                  {isAddingPrescription ? (
                    <div className="space-y-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">تشخیص پزشک:</label>
                        <input
                          type="text"
                          value={rxDiagnosis}
                          onChange={(e) => setRxDiagnosis(e.target.value)}
                          placeholder="مثال: التهاب شدید دندان پوسیده شماره ۱۳"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 focus:outline-none bg-white"
                        />
                      </div>

                      {/* Drugs draft */}
                      {rxDrugs.length > 0 && (
                        <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold block">اقلام نسخه در حال آماده‌سازی:</span>
                          {rxDrugs.map((dr, index) => (
                            <div key={index} className="flex items-center justify-between gap-1 text-[11px] py-1 border-b border-slate-50 font-bold text-right">
                              <span>{dr.name} ({dr.dose})</span>
                              <button
                                onClick={() => setRxDrugs(rxDrugs.filter((_, idx) => idx !== index))}
                                className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Drug form */}
                      <div className="bg-teal-50/30 p-2.5 rounded-lg border border-teal-100 space-y-2">
                        <span className="text-[10px] text-teal-700 font-black block">افزودن قلم دارو:</span>
                        <input
                          type="text"
                          placeholder="نام دارو (مثال: Amoxicillin 500mg)..."
                          value={newDrug.name}
                          onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                          className="w-full px-2.5 py-1 rounded-md border border-slate-200 font-bold focus:outline-none bg-white text-right"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="دستور مصرف..."
                            value={newDrug.dose}
                            onChange={(e) => setNewDrug({ ...newDrug, dose: e.target.value })}
                            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="مدت..."
                            value={newDrug.duration}
                            onChange={(e) => setNewDrug({ ...newDrug, duration: e.target.value })}
                            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!newDrug.name) return;
                            setRxDrugs([...rxDrugs, newDrug]);
                            setNewDrug({ name: "", dose: "هر ۸ ساعت یک عدد", duration: "۵ روز" });
                          }}
                          className="w-full py-1 bg-teal-600 text-white rounded font-bold cursor-pointer border-none"
                        >
                          افزودن به اقلام نسخه
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (rxDrugs.length === 0) {
                            alert("لطفاً حداقل یک قلم دارو به نسخه اضافه کنید.");
                            return;
                          }
                          const newRx = {
                            id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
                            date: new Date().toLocaleDateString("fa-IR"),
                            diagnosis: rxDiagnosis || "معاینه عمومی دهان و دندان",
                            drugs: rxDrugs
                          };
                          const updatedPrescriptions = [newRx, ...(activePatient.prescriptions || [])];
                          setPatients(patients.map(p => p.id === activePatient.id ? { ...p, prescriptions: updatedPrescriptions } : p));
                          setRxDiagnosis("");
                          setRxDrugs([]);
                          setIsAddingPrescription(false);
                          alert("نسخه الکترونیکی با موفقیت صادر و در پرونده بیمار ذخیره شد.");
                        }}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-xl transition-all border-none cursor-pointer"
                      >
                        ثبت و صدور نهایی نسخه الکترونیک
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                      {(!activePatient.prescriptions || activePatient.prescriptions.length === 0) ? (
                        <p className="text-xs text-slate-400 font-bold py-6 text-center">تاریخچه نسخه‌ای برای این بیمار یافت نشد.</p>
                      ) : (
                        activePatient.prescriptions.map((rx: any) => (
                          <div key={rx.id} className="p-3 rounded-xl border border-dashed border-teal-100 bg-teal-50/10 space-y-2 text-xs text-right">
                            <div className="flex items-center justify-between gap-1 border-b border-teal-100/30 pb-1.5">
                              <span className="font-mono text-[10px] text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-black">{rx.id}</span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono">{rx.date}</span>
                            </div>
                            <div className="text-[11px] text-right">
                              <span className="text-slate-400 block font-bold">تشخیص بیماری:</span>
                              <span className="text-slate-700 font-extrabold mt-0.5 block">{rx.diagnosis}</span>
                            </div>
                            <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-100/80">
                              <span className="text-[10px] text-slate-400 font-bold block text-right">اقلام تجویز شده:</span>
                              {rx.drugs.map((dr: any, idx: number) => (
                                <div key={idx} className="text-[11px] text-slate-600 font-bold border-b border-slate-50 last:border-none py-1 flex items-center justify-between">
                                  <span>• {dr.name}</span>
                                  <span className="text-[10px] text-slate-400 font-bold">({dr.dose} / {dr.duration})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-400 font-bold">
              هیچ پرونده‌ای انتخاب نشده است یا لیست بیماران خالی است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
