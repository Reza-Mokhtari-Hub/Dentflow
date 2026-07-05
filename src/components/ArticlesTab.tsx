import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Loader2, 
  Check, 
  Calendar, 
  Clock, 
  Search, 
  AlertCircle,
  X
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

interface ArticlesTabProps {
  articles: BlogPost[];
  setArticles: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  useLocalDb: boolean;
}

export default function ArticlesTab({ articles, setArticles, useLocalDb }: ArticlesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<BlogPost> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ایمپلنت");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("ایمپلنت");
  const [formReadTime, setFormReadTime] = useState("مطالعه ۵ دقیقه");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDate, setFormDate] = useState("");

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const categories = ["ایمپلنت", "زیبایی", "سلامت دهان", "ارتودنسی", "اطفال", "عمومی"];

  const openCreateForm = () => {
    setEditingArticle(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormCategory("ایمپلنت");
    setFormReadTime("مطالعه ۵ دقیقه");
    setFormImageUrl("https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop");
    setFormDate(new Date().toLocaleDateString("fa-IR"));
    setIsEditing(true);
  };

  const openEditForm = (article: BlogPost) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormExcerpt(article.excerpt);
    setFormCategory(article.category);
    setFormReadTime(article.readTime);
    setFormImageUrl(article.imageUrl);
    setFormDate(article.date);
    setIsEditing(true);
  };

  // Generate article using Gemini API
  const handleGenerateWithAI = async () => {
    if (!topicPrompt.trim()) {
      showStatus("error", "لطفاً موضوع مقاله را وارد کنید.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicPrompt, category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error("خطا در پاسخ سرور");
      }

      const data = await response.json();
      
      // Auto fill form fields
      setFormTitle(data.title || "");
      setFormExcerpt(data.excerpt || "");
      setFormCategory(data.category || selectedCategory);
      setFormReadTime(data.readTime || "مطالعه ۵ دقیقه");
      setFormImageUrl(data.imageUrl || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop");
      setFormDate(new Date().toLocaleDateString("fa-IR"));
      
      // If form is not open, open it
      if (!isEditing) {
        setIsEditing(true);
      }
      
      setTopicPrompt("");
      showStatus("success", "مقاله با موفقیت توسط هوش مصنوعی تولید و فرم زیر پر شد! لطفاً آن را مرور و ثبت کنید.");
    } catch (error) {
      console.error(error);
      showStatus("error", "خطا در برقراری ارتباط با هوش مصنوعی جمینای. لطفاً اتصال اینترنت یا کلید API را بررسی کنید.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formExcerpt.trim()) {
      showStatus("error", "لطفاً تمامی فیلدهای الزامی را پر کنید.");
      return;
    }

    setActionLoading(true);
    const payload = {
      title: formTitle,
      excerpt: formExcerpt,
      category: formCategory,
      readTime: formReadTime,
      imageUrl: formImageUrl || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop",
      date: formDate || new Date().toLocaleDateString("fa-IR")
    };

    if (useLocalDb) {
      // Local Database Flow
      if (editingArticle && editingArticle.id) {
        const updated = articles.map(p => p.id === editingArticle.id ? { ...p, ...payload } : p);
        setArticles(updated);
        localStorage.setItem("df_local_articles", JSON.stringify(updated));
        showStatus("success", "مقاله با موفقیت ویرایش شد (محلی).");
      } else {
        const newId = articles.length > 0 ? Math.max(...articles.map(p => p.id)) + 1 : 1;
        const newPost = { id: newId, ...payload } as BlogPost;
        const updated = [newPost, ...articles];
        setArticles(updated);
        localStorage.setItem("df_local_articles", JSON.stringify(updated));
        showStatus("success", "مقاله جدید با موفقیت اضافه شد (محلی).");
      }
      setIsEditing(false);
      setActionLoading(false);
      return;
    }

    try {
      // Real API Flow
      let response;
      if (editingArticle && editingArticle.id) {
        response = await fetch(`/api/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        const savedData = await response.json();
        if (editingArticle && editingArticle.id) {
          setArticles(prev => prev.map(p => p.id === editingArticle.id ? savedData : p));
          showStatus("success", "مقاله با موفقیت بروزرسانی شد.");
        } else {
          setArticles(prev => [savedData, ...prev]);
          showStatus("success", "مقاله جدید با موفقیت ایجاد و ذخیره شد.");
        }
        setIsEditing(false);
      } else {
        throw new Error("خطا در ذخیره‌سازی مقاله");
      }
    } catch (err) {
      console.error(err);
      showStatus("error", "خطا در ارتباط با سرور. ذخیره انجام نشد.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;

    if (useLocalDb) {
      const updated = articles.filter(p => p.id !== id);
      setArticles(updated);
      localStorage.setItem("df_local_articles", JSON.stringify(updated));
      showStatus("success", "مقاله با موفقیت حذف شد (محلی).");
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setArticles(prev => prev.filter(p => p.id !== id));
        showStatus("success", "مقاله با موفقیت حذف شد.");
      } else {
        throw new Error("خطا در حذف مقاله");
      }
    } catch (err) {
      console.error(err);
      showStatus("error", "خطا در حذف مقاله از سرور.");
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right font-sans" id="articles-editor-container">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" id="articles-editor-header">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 justify-end">
            <span>مدیریت مقالات و مجله علمی دنت فلو</span>
            <BookOpen className="w-5 h-5 text-teal-600" />
          </h3>
          <p className="text-xs text-slate-400 font-bold">
            در این بخش می‌توانید مقالات علمی کلینیک را ویرایش، اضافه یا حذف کنید و یا با استفاده از هوش مصنوعی جمینای مقالات جدید تولید کنید.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold rounded-2xl flex items-center gap-2 justify-center shadow-md shadow-teal-600/15 transition-all self-end sm:self-auto cursor-pointer"
          id="btn-open-add-article"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن مقاله جدید</span>
        </button>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 justify-end ${
              statusMessage.type === "success" 
                ? "bg-emerald-50 border border-emerald-100 text-emerald-700" 
                : "bg-rose-50 border border-rose-100 text-rose-700"
            }`}
          >
            <span>{statusMessage.text}</span>
            <AlertCircle className="w-4 h-4 shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generator Box */}
      <div className="bg-gradient-to-r from-teal-50/50 to-indigo-50/30 border border-teal-100/70 rounded-3xl p-5 space-y-4" id="ai-article-generator">
        <div className="flex items-center gap-2 justify-end">
          <span className="text-slate-800 font-black text-sm">تولید سریع مقاله دندانپزشکی با هوش مصنوعی جمینای (Gemini)</span>
          <div className="p-1.5 bg-teal-100 text-teal-700 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1">
            <input
              type="text"
              placeholder="مثال: روش‌های خانگی سفید کردن دندان، مزایای ایمپلنت دیجیتال، پیشگیری از پوسیدگی دندان کودکان..."
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-teal-500 rounded-2xl text-xs font-bold text-slate-800 outline-none text-right"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-3 bg-white border border-slate-200 focus:border-teal-500 rounded-2xl text-xs font-extrabold text-slate-800 outline-none text-right cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="px-4 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white text-xs font-black rounded-2xl flex items-center gap-2 justify-center transition-all cursor-pointer shadow-md shadow-teal-600/10 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال تولید...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تولید هوشمند</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Form Modal or Row */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="bg-white border-2 border-teal-600/30 p-6 rounded-3xl space-y-5 shadow-lg shadow-teal-900/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h4 className="text-sm font-black text-slate-800">
                  {editingArticle ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">عنوان مقاله <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="یک عنوان جذاب برای مقاله وارد کنید..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-right"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">دسته‌بندی <span className="text-rose-500">*</span></label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-right cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">مدت زمان مطالعه</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="مثال: مطالعه ۵ دقیقه"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-right"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">تاریخ انتشار</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="مثال: ۱۵ تیر ۱۴۰۵"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-right"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">آدرس تصویر (URL)</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="مثال: https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-left"
                  />
                </div>

                {/* Excerpt */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 block">خلاصه مقاله <span className="text-rose-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="خلاصه کوتاهی از مقاله جهت نمایش در کارت وبلاگ بنویسید..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-800 outline-none text-right resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-start border-t border-slate-50 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold rounded-xl cursor-pointer transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-md shadow-teal-600/15"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>ثبت و ذخیره مقاله</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and List */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4" id="articles-list-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3" id="articles-search-bar">
          <span className="text-xs font-black text-slate-500 self-end sm:self-auto">لیست مقالات موجود ({filteredArticles.length} مورد)</span>
          
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="جستجو در عنوان، خلاصه یا دسته..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-2xl text-xs font-bold text-slate-800 outline-none text-right"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Articles Table/Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-bold space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p>هیچ مقاله‌ای یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="admin-articles-grid">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-teal-100 hover:shadow-sm transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="space-y-1 text-right min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg">
                      {article.category}
                    </span>
                    <h5 className="text-xs font-black text-slate-800 line-clamp-1">
                      {article.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(article)}
                      className="p-1.5 hover:bg-amber-50 text-amber-600 hover:text-amber-700 rounded-xl transition-colors cursor-pointer"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
