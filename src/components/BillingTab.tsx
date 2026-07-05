import React from "react";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Printer 
} from "lucide-react";
import { motion } from "motion/react";

interface BillingTabProps {
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  isAddingTransaction: boolean;
  setIsAddingTransaction: (val: boolean) => void;
  newTxForm: any;
  setNewTxForm: React.Dispatch<React.SetStateAction<any>>;
  patients: any[];
  invoicePatientId: string;
  setInvoicePatientId: (val: string) => void;
  invoiceItems: any[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<any[]>>;
  invoiceDiscount: number;
  setInvoiceDiscount: (val: number) => void;
  invoiceCreated: any | null;
  setInvoiceCreated: (val: any | null) => void;
  isViewingInvoicePreview: boolean;
  setIsViewingInvoicePreview: (val: boolean) => void;
  billingTypeFilter: string;
  setBillingTypeFilter: (val: string) => void;
  clinicConfig: any;
}

export default function BillingTab({
  transactions,
  setTransactions,
  isAddingTransaction,
  setIsAddingTransaction,
  newTxForm,
  setNewTxForm,
  patients,
  invoicePatientId,
  setInvoicePatientId,
  invoiceItems,
  setInvoiceItems,
  invoiceDiscount,
  setInvoiceDiscount,
  invoiceCreated,
  setInvoiceCreated,
  isViewingInvoicePreview,
  setIsViewingInvoicePreview,
  billingTypeFilter,
  setBillingTypeFilter,
  clinicConfig,
}: BillingTabProps) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!newTxForm.amount || !newTxForm.description) {
      alert("لطفاً مبلغ و شرح تراکنش را وارد فرمایید.");
      return;
    }
    const amountNum = parseInt(newTxForm.amount) || 0;
    const newTx = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newTxForm.type,
      amount: amountNum,
      category: newTxForm.category,
      date: newTxForm.date || "1405/04/12",
      description: newTxForm.description,
      patientId: newTxForm.patientId || undefined
    };
    setTransactions([newTx, ...transactions]);
    setNewTxForm({
      type: "income",
      amount: "",
      category: "treatment",
      date: "1405/04/12",
      description: "",
      patientId: ""
    });
    setIsAddingTransaction(false);
    alert("سند حسابداری با موفقیت به دفتر روزنامه صندوق الحاق شد.");
  };

  const handleGenerateInvoicePreview = () => {
    const activePatient = patients.find(p => p.id === invoicePatientId) || patients[0];
    if (!activePatient) {
      alert("بیماری یافت نشد.");
      return;
    }
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const discountAmt = (subtotal * invoiceDiscount) / 100;
    const taxedAmt = ((subtotal - discountAmt) * 9) / 100;
    const grandTotal = subtotal - discountAmt + taxedAmt;
    setInvoiceCreated({
      patient: activePatient,
      items: invoiceItems,
      subtotal,
      discountAmt,
      taxedAmt,
      grandTotal,
      serialNo: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("fa-IR")
    });
    setIsViewingInvoicePreview(true);
  };

  return (
    <div className="space-y-6 text-right" id="billing-management-tab" dir="rtl">
      <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl">
        <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-teal-600 animate-pulse" />
          <span>سامانه مدیریت مالی، صندوق کلینیک و صدور فاکتور رسمی</span>
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
          گردش حساب زنده، سود خالص، مخارج جاری، و صدور پیش‌فاکتور یا فاکتور رسمی با اعمال تخفیف و مالیات برای مراجعین دنت فلو در این داشبورد یکپارچه قابل مدیریت است.
        </p>
      </div>

      {/* Billing KPI Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="billing-stats-dashboard">
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl text-right">
          <span className="text-slate-400 font-extrabold text-[11px] block">کل درآمدهای صندوق کلینیک</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 block mt-2 font-mono">
            {totalIncome.toLocaleString("fa-IR")}{" "}
            <span className="text-xs font-bold text-slate-500">تومان</span>
          </span>
        </div>

        <div className="bg-white border border-rose-100 p-5 rounded-2xl text-right">
          <span className="text-slate-400 font-extrabold text-[11px] block">مجموع هزینه‌ها و مخارج جاری</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 block mt-2 font-mono">
            {totalExpense.toLocaleString("fa-IR")}{" "}
            <span className="text-xs font-bold text-slate-500">تومان</span>
          </span>
        </div>

        <div className="bg-white border border-teal-100 p-5 rounded-2xl text-right">
          <span className="text-slate-400 font-extrabold text-[11px] block">تراز مالی و سود خالص (Live Net)</span>
          <span className={`text-xl sm:text-2xl font-black block mt-2 font-mono ${netProfit >= 0 ? "text-teal-600" : "text-rose-600"}`}>
            {netProfit.toLocaleString("fa-IR")}{" "}
            <span className="text-xs font-bold text-slate-500">تومان</span>
          </span>
        </div>

        <div className="bg-white border border-amber-100 p-5 rounded-2xl text-right">
          <span className="text-slate-400 font-extrabold text-[11px] block">تعداد تراکنش‌های ثبت‌شده</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 block mt-2 font-mono">
            {transactions.length.toLocaleString("fa-IR")}{" "}
            <span className="text-xs font-bold text-slate-500">تراکنش</span>
          </span>
        </div>
      </div>

      {/* Financial Layout: Transaction Ledger and Invoice Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Transaction Ledger (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>دفتر معین صندوق و حسابداری کلینیک</span>
            </h4>
            <button
              onClick={() => setIsAddingTransaction(!isAddingTransaction)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-colors flex items-center gap-1 cursor-pointer border-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTransaction ? "انصراف" : "ثبت تراکنش دستی"}</span>
            </button>
          </div>

          {/* Add Manual Transaction Collapsible Form */}
          {isAddingTransaction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-xl border border-teal-100 bg-teal-50/20 space-y-3 text-xs text-right"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">نوع تراکنش:</label>
                  <select
                    value={newTxForm.type}
                    onChange={(e) => setNewTxForm({ ...newTxForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none text-right"
                  >
                    <option value="income">دریافت / درآمد صندوق</option>
                    <option value="expense">مخارج / هزینه‌های جاری</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">مبلغ تراکنش (تومان):</label>
                  <input
                    type="number"
                    placeholder="مثال: 500000"
                    value={newTxForm.amount}
                    onChange={(e) => setNewTxForm({ ...newTxForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">دسته‌بندی:</label>
                  <select
                    value={newTxForm.category}
                    onChange={(e) => setNewTxForm({ ...newTxForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none text-right"
                  >
                    <option value="treatment">درآمد حاصل از درمان بیمار</option>
                    <option value="materials">خرید مواد و ملزومات دندانپزشکی</option>
                    <option value="salary">حقوق پرسنل و کارانه پزشکان</option>
                    <option value="rent">اجاره کلینیک و قبوض عمومی</option>
                    <option value="other">سایر امور متفرقه صندوق</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">تاریخ ثبت (شمسی):</label>
                  <input
                    type="text"
                    value={newTxForm.date}
                    onChange={(e) => setNewTxForm({ ...newTxForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">شرح تراکنش (ملاحظات):</label>
                <input
                  type="text"
                  placeholder="مثال: تسویه قسط اول کامپوزیت خانم حسینی"
                  value={newTxForm.description}
                  onChange={(e) => setNewTxForm({ ...newTxForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <button
                onClick={handleAddTransaction}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl cursor-pointer border-none"
              >
                ثبت سند مالی دفتری
              </button>
            </motion.div>
          )}

          {/* Transaction Filter and table list */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">فیلتر تراکنش‌ها:</span>
            <select
              value={billingTypeFilter}
              onChange={(e) => setBillingTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50 focus:outline-none text-right"
            >
              <option value="all">همه تراکنش‌ها (درآمد و هزینه)</option>
              <option value="income">صرفاً درآمدها و دریافتی‌ها</option>
              <option value="expense">صرفاً هزینه‌ها و مخارج صندوق</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[380px] overflow-y-auto pr-1">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-black">
                  <th className="p-3">کد سند</th>
                  <th className="p-3">تاریخ</th>
                  <th className="p-3">شرح بابت</th>
                  <th className="p-3">مبلغ (تومان)</th>
                  <th className="p-3 text-center">نوع</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => billingTypeFilter === "all" ? true : t.type === billingTypeFilter)
                  .map((t) => {
                    const isInc = t.type === "income";
                    return (
                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 font-bold text-slate-700">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{t.id}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">{t.date}</td>
                        <td className="p-3 leading-relaxed text-slate-800 text-[11px]">{t.description}</td>
                        <td className={`p-3 font-mono ${isInc ? "text-emerald-600" : "text-rose-600"}`}>
                          {isInc ? "+" : "-"}{t.amount.toLocaleString("fa-IR")}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            isInc ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}>
                            {isInc ? "دریافت" : "پرداخت"}
                          </span>
                        </td>
                        <td className="p-3 text-left">
                          <button
                            onClick={() => {
                              if (confirm("آیا از حذف این سند مالی اطمینان دارید؟")) {
                                setTransactions(transactions.filter(tx => tx.id !== t.id));
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer border-none bg-transparent"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL: Official Invoice Builder (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>صدور صورتحساب و پیش‌فاکتور بیمار</span>
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-bold block">انتخاب مراجع یا بیمار:</label>
              <select
                value={invoicePatientId}
                onChange={(e) => setInvoicePatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none text-right"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.phone})</option>
                ))}
              </select>
            </div>

            {/* Invoice Items list */}
            <div className="space-y-2">
              <span className="text-slate-500 font-bold block">اقلام و تعرفه درمان‌های صورتحساب:</span>
              {invoiceItems.map((item, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block text-[10px]">عنوان خدمت درمان:</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...invoiceItems];
                        updated[index].title = e.target.value;
                        setInvoiceItems(updated);
                      }}
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">تعداد واحد:</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const updated = [...invoiceItems];
                          updated[index].qty = parseInt(e.target.value) || 1;
                          setInvoiceItems(updated);
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">قیمت واحد (تومان):</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...invoiceItems];
                          updated[index].unitPrice = parseInt(e.target.value) || 0;
                          setInvoiceItems(updated);
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded font-bold font-mono text-left"
                      />
                    </div>
                  </div>
                  {invoiceItems.length > 1 && (
                    <button
                      onClick={() => setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index))}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold bg-transparent border-none cursor-pointer pt-1 block"
                    >
                      حذف این قلم
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setInvoiceItems([...invoiceItems, { title: "خدمت جدید (ترمیم/معاینه/جراحی)", qty: 1, unitPrice: 1500000 }])}
              className="w-full py-1.5 rounded-lg border border-dashed border-teal-300 text-teal-700 bg-teal-50/20 hover:bg-teal-50/50 font-bold transition-colors cursor-pointer"
            >
              + افزودن ردیف یا درمان جدید به فاکتور
            </button>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">درصد تخفیف بیمار (%):</label>
                <input
                  type="number"
                  value={invoiceDiscount}
                  onChange={(e) => setInvoiceDiscount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">مالیات ارزش افزوده (VAT):</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" disabled>
                  <option>۹ درصد قانونی</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerateInvoicePreview}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-teal-400" />
                <span>پیش‌نمایش صورتحساب رسمی دنت فلو</span>
              </button>
            </div>
          </div>

          {/* Paper Invoice Preview modal or section */}
          {isViewingInvoicePreview && invoiceCreated && (
            <motion.div
              id="printable-invoice-block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-800 p-6 rounded-2xl text-right space-y-6 text-xs text-slate-800 shadow-xl shadow-slate-900/15"
            >
              <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #printable-invoice-block, #printable-invoice-block * {
                    visibility: visible !important;
                  }
                  #printable-invoice-block {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 24px;
                    border: none !important;
                    box-shadow: none !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}} />
              {/* Invoice Paper Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 gap-2">
                <div>
                  <h2 className="text-base font-black text-slate-900">کلینیک تخصصی دیجیتال دنت فلو</h2>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">صورتحساب رسمی ارائه خدمات دندانپزشکی زیبایی و جراحی</p>
                </div>
                <div className="text-left font-bold text-slate-500 space-y-0.5">
                  <div>شماره فاکتور: <span className="font-mono text-slate-800 text-[11px]">{invoiceCreated.serialNo}</span></div>
                  <div>تاریخ: <span className="font-mono text-slate-800 text-[11px]">{invoiceCreated.date}</span></div>
                </div>
              </div>

              {/* Patient info inside Invoice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-bold text-slate-700">
                <div>خریدار / مراجع: <span className="text-slate-900 font-extrabold">{invoiceCreated.patient.fullName}</span></div>
                <div>تلفن همراه: <span className="text-slate-900 font-mono" dir="ltr">{invoiceCreated.patient.phone}</span></div>
                <div>کد ملی: <span className="text-slate-900 font-mono">{invoiceCreated.patient.nationalId}</span></div>
                <div>پزشک معالج: <span className="text-slate-900 font-extrabold">{clinicConfig.doctorName}</span></div>
              </div>

              {/* Invoice table */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-right text-[11px] font-bold text-slate-800">
                  <thead className="bg-slate-100 border-b border-slate-800">
                    <tr>
                      <th className="p-2">ردیف</th>
                      <th className="p-2">شرح خدمت درمان دهان و دندان</th>
                      <th className="p-2 text-center">تعداد / واحد</th>
                      <th className="p-2">مبلغ واحد</th>
                      <th className="p-2">مبلغ کل (تومان)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceCreated.items.map((it: any, index: number) => (
                      <tr key={index} className="border-b border-slate-200 last:border-none">
                        <td className="p-2 font-mono text-slate-400">{index + 1}</td>
                        <td className="p-2 font-extrabold text-slate-900">{it.title}</td>
                        <td className="p-2 text-center font-mono">{it.qty}</td>
                        <td className="p-2 font-mono">{it.unitPrice.toLocaleString("fa-IR")}</td>
                        <td className="p-2 font-mono text-slate-900">{(it.qty * it.unitPrice).toLocaleString("fa-IR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation box */}
              <div className="flex justify-end">
                <div className="w-full sm:w-2/3 border border-slate-800 rounded-xl overflow-hidden font-bold text-slate-700">
                  <div className="grid grid-cols-2 p-2 border-b border-slate-200 bg-slate-50/50">
                    <span>جمع کل خدمات:</span>
                    <span className="font-mono text-slate-900 text-left">{invoiceCreated.subtotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 border-b border-slate-200 text-rose-600 bg-rose-50/10">
                    <span>کسر تخفیف ({invoiceDiscount}%):</span>
                    <span className="font-mono text-left">-{invoiceCreated.discountAmt.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 border-b border-slate-200 bg-slate-50/50">
                    <span>مالیات ارزش افزوده (۹٪):</span>
                    <span className="font-mono text-slate-900 text-left">+{invoiceCreated.taxedAmt.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-teal-50 text-teal-800 text-xs sm:text-sm font-black">
                    <span>مبلغ قابل پرداخت نهایی:</span>
                    <span className="font-mono text-left">{invoiceCreated.grandTotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              </div>

              {/* Stamp and controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-slate-800 pt-4">
                <div className="text-[10px] text-slate-400 font-extrabold text-center sm:text-right">
                  * این سند معتبر بوده و از طرف مراجع مالی کلینیک دیجیتال دنت فلو مورد تایید می‌باشد.
                </div>
                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => {
                      const finalTx = {
                        id: `T-INV-${Math.floor(1000 + Math.random() * 9000)}`,
                        type: "income",
                        amount: invoiceCreated.grandTotal,
                        category: "treatment",
                        date: invoiceCreated.date,
                        description: `تسویه صورتحساب شماره ${invoiceCreated.serialNo} بیمار ${invoiceCreated.patient.fullName}`,
                        patientId: invoiceCreated.patient.id
                      };
                      setTransactions([finalTx, ...transactions]);
                      setIsViewingInvoicePreview(false);
                      setInvoiceCreated(null);
                      alert("فاکتور تایید نهایی شد و تراز کل گراند توتال به عنوان دریافت درآمد وارد صندوق دفتری کلینیک شد.");
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ثبت و صدور نهایی صورتحساب</span>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl cursor-pointer border-none flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>چاپ فاکتور</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
