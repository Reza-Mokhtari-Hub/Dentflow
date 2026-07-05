import React, { useState } from "react";
import { Lock, ShieldAlert, Key, CheckSquare } from "lucide-react";
import { motion } from "motion/react";

interface SecurityTabProps {
  storedAdminUsername: string;
  setStoredAdminUsername: (val: string) => void;
  adminToken: string | null;
}

export default function SecurityTab({
  storedAdminUsername,
  setStoredAdminUsername,
  adminToken,
}: SecurityTabProps) {
  const [currentUsernameInput, setCurrentUsernameInput] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  
  const [newUsernameInput, setNewUsernameInput] = useState(storedAdminUsername);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUsernameInput || !currentPasswordInput) {
      setMessage({
        type: "error",
        text: "لطفاً نام کاربری فعلی و کلمه عبور فعلی خود را وارد نمایید.",
      });
      return;
    }

    if (!newUsernameInput.trim()) {
      setMessage({
        type: "error",
        text: "نام کاربری جدید نمی‌تواند خالی باشد.",
      });
      return;
    }

    if (!newPasswordInput) {
      setMessage({
        type: "error",
        text: "کلمه عبور جدید نمی‌تواند خالی باشد.",
      });
      return;
    }

    if (newPasswordInput.length < 4) {
      setMessage({
        type: "error",
        text: "کلمه عبور جدید باید حداقل ۴ کاراکتر باشد.",
      });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setMessage({
        type: "error",
        text: "کلمه عبور جدید با تکرار آن مطابقت ندارد.",
      });
      return;
    }

    if (!adminToken) {
      setMessage({
        type: "error",
        text: "برای تغییر رمز عبور باید ابتدا دوباره وارد پنل شوید.",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentUsername: currentUsernameInput,
          currentPassword: currentPasswordInput,
          newUsername: newUsernameInput,
          newPassword: newPasswordInput,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setMessage({
          type: "error",
          text: data.error || "تغییر کلمه عبور با خطا مواجه شد.",
        });
        return;
      }

      const cleanNewUsername = newUsernameInput.trim();
      setStoredAdminUsername(cleanNewUsername);
      localStorage.setItem("df_admin_username", cleanNewUsername);
      localStorage.removeItem("df_admin_password");

      setMessage({
        type: "success",
        text: "گذرواژه و اطلاعات ورود به پنل با موفقیت تغییر یافت. برای ورودهای بعدی از اطلاعات جدید استفاده نمایید.",
      });

      setCurrentUsernameInput("");
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "در ارتباط با سرور خطایی رخ داد.",
      });
    }
  };

  return (
    <div className="space-y-6 text-right" id="security-management-tab" dir="rtl">
      <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl">
        <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-600 animate-pulse" />
          <span>تنظیمات امنیت، حفاظت و تغییر رمز عبور پنل مدیریت</span>
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
          برای حفظ محرمانگی پرونده مراجعین و نوبت‌های کلینیک، پیشنهاد می‌شود رمز عبور پیش‌فرض (admin) را به کلمه عبور اختصاصی خود تغییر دهید.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <Key className="w-5 h-5 text-teal-600" />
          <h4 className="text-sm font-black text-slate-800">فرم تغییر مشخصات ورود به سیستم</h4>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          {/* Current credentials validation */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <span className="text-[11px] font-extrabold text-slate-500 block">تایید هویت فعلی (جهت امنیت):</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">نام کاربری فعلی:</label>
                <input
                  type="text"
                  placeholder="مثال: admin"
                  value={currentUsernameInput}
                  onChange={(e) => setCurrentUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">کلمه عبور فعلی:</label>
                <input
                  type="password"
                  placeholder="••••"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* New Credentials */}
          <div className="space-y-3 text-xs pt-2">
            <span className="text-[11px] font-extrabold text-teal-700 block">مشخصات جدید ورود:</span>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold block">نام کاربری جدید:</label>
              <input
                type="text"
                value={newUsernameInput}
                onChange={(e) => setNewUsernameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">کلمه عبور جدید:</label>
                <input
                  type="password"
                  placeholder="رمز عبور قوی"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">تکرار کلمه عبور جدید:</label>
                <input
                  type="password"
                  placeholder="تکرار رمز عبور"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-rose-50 border-rose-100 text-rose-600"
              }`}
            >
              {message.type === "success" ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer border-none shadow-md shadow-teal-600/10 transition-colors"
          >
            اعمال و ثبت کلمه عبور جدید
          </button>
        </form>
      </div>
    </div>
  );
}
