/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Smile, 
  Baby, 
  Zap, 
  Scissors,
  Award,
  HeartHandshake,
  Phone,
  MapPin,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  User,
  Check,
  CheckCircle,
  Instagram,
  ArrowRight,
  ArrowLeft,
  Map,
  Info,
  Stethoscope,
  PhoneCall,
  Lock,
  ThumbsUp,
  Sliders,
  Send,
  Sparkle,
  Trash2,
  Settings,
  Shield,
  Search,
  Edit3,
  Save,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from "recharts";

import { 
  servicesData, 
  smileCases, 
  testimonialsData, 
  faqData, 
  blogPosts, 
  stats,
  Service,
  SmileCase
} from "./data";

export default function App() {
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Gallery interactive states
  const [selectedCase, setSelectedCase] = useState<SmileCase>(smileCases[0]);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage of before/after split
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Testimonial slider state
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  // FAQ active accordion ID
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Services modal state
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Booking Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    serviceId: "implant",
    date: "",
    timeSlot: "morning",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Clinic Admin Dashboard States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<string>("all");
  const [adminActiveTab, setAdminActiveTab] = useState<"bookings" | "services" | "contact" | "ai" | "analytics">("bookings");

  // Determine if we should use local storage fallback (for Netlify / static hosts / server-less environments)
  const [useLocalDb, setUseLocalDb] = useState<boolean>(() => {
    const saved = localStorage.getItem("df_use_local_db");
    if (saved) return saved === "true";
    // Auto-detect Netlify, GitHub Pages or custom static environments
    const isStaticHost = 
      window.location.hostname.includes("netlify") || 
      window.location.hostname.includes("github.io") || 
      window.location.hostname.includes("vercel") || 
      window.location.hostname.includes("render");
    return isStaticHost;
  });

  // Client-side local DB initial data (mirrors original server sample records)
  const getLocalBookings = () => {
    const saved = localStorage.getItem("df_bookings");
    if (saved) {
      return JSON.parse(saved);
    }
    const initialBookings = [
      {
        id: "DF-749210",
        fullName: "امیرحسین رضایی",
        phone: "09121112233",
        serviceId: "implant",
        date: "2026-07-06",
        timeSlot: "morning",
        notes: "نیاز به ایمپلنت فوری سوئیسی فک بالا دارم. آیا امکان درمان بدون درد وجود دارد؟",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        adminComment: ""
      },
      {
        id: "DF-183029",
        fullName: "مهسا کریمی",
        phone: "09354445566",
        serviceId: "laminate",
        date: "2026-07-07",
        timeSlot: "afternoon",
        notes: "برای معاینه لمینت سرامیکی E-Max نوبت می‌خواهم.",
        status: "approved",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        adminComment: "تایید شد. منتظر تشریف‌فرمایی شما در ساعت ۱۴:۳۰ هستیم. لطفاً مدارک دندانپزشکی قبلی را همراه داشته باشید."
      },
      {
        id: "DF-394021",
        fullName: "سینا باقری",
        phone: "09197778899",
        serviceId: "orthodontics",
        date: "2026-07-10",
        timeSlot: "afternoon",
        notes: "درباره هزینه الاینر نامرئی ارتودنسی سوال دارم.",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        adminComment: ""
      }
    ];
    localStorage.setItem("df_bookings", JSON.stringify(initialBookings));
    return initialBookings;
  };

  const saveLocalBookings = (bookingsList: any[]) => {
    localStorage.setItem("df_bookings", JSON.stringify(bookingsList));
    setAdminBookings(bookingsList);
  };

  // Dynamic Clinic Configuration
  const [clinicConfig, setClinicConfig] = useState(() => {
    const saved = localStorage.getItem("df_clinic_config");
    return saved ? JSON.parse(saved) : {
      phone: "۰۲۱-۲۲۰۰۰۰۰۰ | ۰۲۱-۲۲۰۰۰۰۰۱",
      phoneRaw: "02122000000",
      address: "تهران، الهیه، خیابان فرشته، ساختمان پزشکان مریم، طبقه سوم",
      telegram: "۰۹۱۲۳۴۵۶۷۸۹",
      workingHours: "شنبه تا چهارشنبه ۹:۰۰ الی ۲۱:۰۰ | پنجشنبه ۹:۰۰ الی ۱۵:۰۰",
      doctorName: "دکتر مختاری",
      doctorTitle: "جراح و دندانپزشک زیبایی - فلوشیپ ایمپلنتولوژی دیجیتال از سوئیس",
      aboutDesc: "هدف ما در دنت فلو برطرف کردن ترس‌ها و دغدغه‌های همیشگی شما از دندانپزشکی است. ما معتقدیم کیفیت و دقت در درمان حق بیمار است و با گردهم‌آوری بهترین متخصصان، به کارگیری فناوری سه‌بعدی دیجیتال و دکوراسیون پزشکی آرامش‌بخش، فضایی رویایی برای درمان به وجود آورده‌ایم.",
      installmentInfo: "۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره و سود"
    };
  });

  // Dynamic Services Data
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem("df_services");
    return saved ? JSON.parse(saved) : servicesData;
  });

  // Dynamic AI Bot Configurations
  const [aiName, setAiName] = useState(() => localStorage.getItem("df_ai_name") || "دستیار هوشمند دنت فلو");
  const [aiGreeting, setAiGreeting] = useState(() => localStorage.getItem("df_ai_greeting") || "سلام! من دستیار هوشمند و تخصصی کلینیک دندانپزشکی دنت فلو هستم. هر سوالی درباره طرح درمان، هزینه‌ها، اقساط، ترس از دندانپزشکی یا خدمات ما دارید بپرسید؛ من با عشق راهنمایی‌تان می‌کنم! ✨");
  const [aiPrompt, setAiPrompt] = useState(() => {
    return localStorage.getItem("df_ai_prompt") || `شما دستیار تخصصی، دلسوز و فوق‌العاده باهوش کلینیک دندانپزشکی دیجیتال "دنت فلو" (DentFlow) هستید. نام شما "دستیار هوشمند دنت فلو" است.
وظایف شما:
۱. پاسخ به سوالات مراجعین و بیماران درباره مشکلات دندانی، بیماری‌های دهان، خدمات کلینیک، هزینه‌ها، و شرايط اقساطی به زبان فارسی شیوا، صمیمی، دلسوزانه و کاملاً محترمانه.
۲. معرفی خدمات مختلف کلینیک دنت فلو (ایمپلنت دیجیتال سوئیسی، لمینت سرامیکی E-max، ونیر کامپوزیت IPS، ارتودنسی نامرئی الاینر، عصب‌کشی روتاری بدون درد، اطفال و جراحی‌های لثه).
۳. دندانپزشک ارشد کلینیک "دکتر مختاری" (جراح و دندانپزشک زیبایی، دارای فلوشیپ ایمپلنتولوژی دیجیتال از سوئیس با بیش از ۱۰ سال سابقه و ثبت بیش از ۵۰۰۰ مورد ترمیم موفق لبخند) است.
۴. شماره تماس کلینیک: ۰۲۱-۲۲۰۰۰۰۰۰ است. آدرس کلینیک در شهر تهران (منطقه الهیه، خیابان فرشته) می‌باشد.
۵. شرایط پرداخت اقساطی بسیار منعطف است: ۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره و سود.
۶. برای بیماران با ترس و اضطراب شدید دندانپزشکی، توضیح دهید که ما مجهز به سیستم "سدیشن" (سودیشن یا خواب مصنوعی بسیار ایمن و آرام‌بخش با نظارت متخصص بیهوشی) هستیم تا درمان کاملاً بدون درد و بدون کوچکترین استرسی سپری شود.

به یاد داشته باشید شما سفیر برند دنت فلو هستید و آرامش دادن به بیمار اولویت اول شماست.`;
  });

  // Patient Tracking & Booking Tabs States
  const [bookingTab, setBookingTab] = useState<"new" | "track">("new");
  const [trackCode, setTrackCode] = useState("");
  const [trackedBooking, setTrackedBooking] = useState<any | null>(null);
  const [trackError, setTrackError] = useState("");
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Admin Editing Booking details state
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [editAdminComment, setEditAdminComment] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTimeSlot, setEditTimeSlot] = useState<"morning" | "afternoon">("morning");

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section on scroll
      const sections = ["home", "services", "assistant", "about", "gallery", "articles", "faq", "booking"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map icon strings to Lucide components for clean rendering
  const renderServiceIcon = (iconName: string, className = "w-6 h-6 text-teal-600") => {
    switch (iconName) {
      case "ShieldCheck": return <ShieldCheck className={className} id={`icon-${iconName}`} />;
      case "Sparkles": return <Sparkles className={className} id={`icon-${iconName}`} />;
      case "Activity": return <Activity className={className} id={`icon-${iconName}`} />;
      case "Smile": return <Smile className={className} id={`icon-${iconName}`} />;
      case "Baby": return <Baby className={className} id={`icon-${iconName}`} />;
      case "Zap": return <Zap className={className} id={`icon-${iconName}`} />;
      case "Scissors": return <Scissors className={className} id={`icon-${iconName}`} />;
      case "Award": return <Award className={className} id={`icon-${iconName}`} />;
      case "HeartHandshake": return <HeartHandshake className={className} id={`icon-${iconName}`} />;
      default: return <Stethoscope className={className} id="icon-default" />;
    }
  };

  // Image Before/After Slider Interaction Helpers
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleSliderMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIdx((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fetchAdminBookings = async () => {
    if (useLocalDb) {
      setAdminBookings(getLocalBookings());
      return;
    }
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setAdminBookings(data);
      } else {
        console.warn("API returned error, switching to local DB.");
        setUseLocalDb(true);
        localStorage.setItem("df_use_local_db", "true");
        setAdminBookings(getLocalBookings());
      }
    } catch (err) {
      console.warn("API fetch failed, switching to local DB:", err);
      setUseLocalDb(true);
      localStorage.setItem("df_use_local_db", "true");
      setAdminBookings(getLocalBookings());
    }
  };

  useEffect(() => {
    fetchAdminBookings();
  }, [useLocalDb]);

  const updateBookingStatus = async (id: string, status: string) => {
    if (useLocalDb) {
      const current = getLocalBookings();
      const updated = current.map((b: any) => b.id === id ? { ...b, status } : b);
      saveLocalBookings(updated);
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminBookings();
      } else {
        const current = getLocalBookings();
        const updated = current.map((b: any) => b.id === id ? { ...b, status } : b);
        saveLocalBookings(updated);
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      const current = getLocalBookings();
      const updated = current.map((b: any) => b.id === id ? { ...b, status } : b);
      saveLocalBookings(updated);
    }
  };

  const deleteBooking = async (id: string) => {
    if (useLocalDb) {
      const current = getLocalBookings();
      const updated = current.filter((b: any) => b.id !== id);
      saveLocalBookings(updated);
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAdminBookings();
      } else {
        const current = getLocalBookings();
        const updated = current.filter((b: any) => b.id !== id);
        saveLocalBookings(updated);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      const current = getLocalBookings();
      const updated = current.filter((b: any) => b.id !== id);
      saveLocalBookings(updated);
    }
  };

  const handleBookingTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) {
      setTrackError("لطفاً کد رهگیری خود را وارد کنید.");
      setTrackedBooking(null);
      return;
    }

    setIsTrackingLoading(true);
    setTrackError("");
    setTrackedBooking(null);

    if (useLocalDb) {
      setTimeout(() => {
        const current = getLocalBookings();
        const booking = current.find((b: any) => b.id.toUpperCase() === trackCode.trim().toUpperCase());
        if (booking) {
          setTrackedBooking(booking);
        } else {
          setTrackError("نوبتی با این کد رهگیری یافت نشد.");
        }
        setIsTrackingLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch(`/api/bookings/track/${encodeURIComponent(trackCode.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setTrackedBooking(data);
      } else {
        const current = getLocalBookings();
        const booking = current.find((b: any) => b.id.toUpperCase() === trackCode.trim().toUpperCase());
        if (booking) {
          setTrackedBooking(booking);
        } else {
          setTrackError(data.error || "نوبتی با این کد رهگیری یافت نشد.");
        }
      }
    } catch (err) {
      console.error("Error tracking booking:", err);
      const current = getLocalBookings();
      const booking = current.find((b: any) => b.id.toUpperCase() === trackCode.trim().toUpperCase());
      if (booking) {
        setTrackedBooking(booking);
      } else {
        setTrackError("کد رهگیری یافت نشد. وضعیت نوبت‌ها به صورت محلی بررسی گردید.");
      }
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const updateBookingDetails = async (id: string, updates: { status?: string; date?: string; timeSlot?: "morning" | "afternoon"; adminComment?: string }) => {
    if (useLocalDb) {
      const current = getLocalBookings();
      const updated = current.map((b: any) => b.id === id ? { ...b, ...updates } : b);
      saveLocalBookings(updated);
      setActiveEditingId(null);
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchAdminBookings();
        setActiveEditingId(null);
      } else {
        const current = getLocalBookings();
        const updated = current.map((b: any) => b.id === id ? { ...b, ...updates } : b);
        saveLocalBookings(updated);
        setActiveEditingId(null);
      }
    } catch (err) {
      console.error("Error updating booking details:", err);
      const current = getLocalBookings();
      const updated = current.map((b: any) => b.id === id ? { ...b, ...updates } : b);
      saveLocalBookings(updated);
      setActiveEditingId(null);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim().toLowerCase() === "admin" && adminPassword === "admin") {
      setIsAdminAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("نام کاربری یا کلمه عبور نادرست است.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "نام و نام خانوادگی الزامی است.";
    } else if (formData.fullName.trim().length < 4) {
      errors.fullName = "نام و نام خانوادگی باید حداقل ۴ کاراکتر باشد.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "شماره تماس الزامی است.";
    } else {
      const phoneRegex = /^(09)[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "شماره موبایل وارد شده معتبر نیست (مثال: 09123456789).";
      }
    }

    if (!formData.date) {
      errors.date = "لطفا تاریخ حدودی مورد نظر را انتخاب کنید.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    if (useLocalDb) {
      setTimeout(() => {
        const newId = "DF-" + Math.floor(100000 + Math.random() * 900000);
        const newBooking = {
          id: newId,
          ...formData,
          status: "pending",
          createdAt: new Date().toISOString(),
          adminComment: ""
        };
        const current = getLocalBookings();
        current.unshift(newBooking);
        saveLocalBookings(current);
        setBookingRef(newId);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 600);
      return;
    }
    
    // Real API reservation call to custom Express backend
    fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error("خطا در برقراری ارتباط با سرور");
      return res.json();
    })
    .then(data => {
      setBookingRef(data.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
      fetchAdminBookings(); // update live listing in doctor view
    })
    .catch(err => {
      console.warn("Backend booking failed, submitting locally:", err);
      const newId = "DF-" + Math.floor(100000 + Math.random() * 900000);
      const newBooking = {
        id: newId,
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        adminComment: ""
      };
      const current = getLocalBookings();
      current.unshift(newBooking);
      saveLocalBookings(current);
      setBookingRef(newId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    });
  };

  const selectServiceAndBook = (service: Service) => {
    setFormData((prev) => ({ ...prev, serviceId: service.id }));
    setActiveServiceModal(null);
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // AI Chat Assistant States
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "سلام! من دستیار هوشمند و تخصصی کلینیک دندانپزشکی دنت فلو هستم. هر سوالی درباره طرح درمان، هزینه‌ها، اقساط، ترس از دندانپزشکی یا خدمات ما دارید بپرسید؛ من با عشق راهنمایی‌تان می‌کنم! ✨"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const getLocalBotResponse = (userMsg: string): string => {
    const msg = userMsg.toLowerCase();
    
    if (msg.includes("ایمپلنت")) {
      const s = services.find(x => x.id === "implant");
      return `بله در کلینیک دنت فلو کاشت تخصصی ایمپلنت دندان با پیشرفته‌ترین تکنولوژی دیجیتال توسط ${clinicConfig.doctorName} انجام می‌شود. 

💎 جزئیات درمان:
${s?.details.map(d => `• ${d}`).join("\n") || ""}

💰 هزینه حدودی:
${s?.priceEst || "تماس بگیرید"} (با امکان پرداخت اقساطی!)
آیا مایلید یک نوبت مشاوره رایگان با پزشک برای شما رزرو کنم؟`;
    }
    
    if (msg.includes("لمینت") || msg.includes("ونیر") || msg.includes("کامپوزیت") || msg.includes("طرح لبخند")) {
      const s = services.find(x => x.id === "veneer") || services.find(x => x.id === "laminate");
      return `جهت اصلاح طرح لبخند، ما خدمات ونیر کامپوزیت‌های فوق‌طبیعی و لمینت‌های سرامیکی فوق‌نازک ضدخش را با برترین مواد در بخش مجهز کلینیک ارائه می‌دهیم.

💎 جزئیات خدمت:
${s?.details.map(d => `• ${d}`).join("\n") || ""}

💰 هزینه تخمینی:
${s?.priceEst || "تماس بگیرید"}
دوست دارید طرح لبخند دیجیتال خود را قبل از شروع کار ببینید؟`;
    }

    if (msg.includes("ارتودنسی")) {
      const s = services.find(x => x.id === "orthodontics");
      return `ارتودنسی تخصصی ثابت و نامرئی (با الاینرهای شفاف و شیشه‌ای بدون سیم‌کشی) برای کودکان و بزرگسالان در کلینیک ما ارائه می‌شود.

💎 ویژگی‌ها:
${s?.details.map(d => `• ${d}`).join("\n") || ""}

💰 هزینه ارتودنسی:
${s?.priceEst || "تماس بگیرید"}`;
    }

    if (msg.includes("بلیچ") || msg.includes("سفید") || msg.includes("جرم")) {
      const s = services.find(x => x.id === "bleaching");
      return `برای سفید کردن دندان‌ها از مجهزترین سیستم بلیچینگ مطب با لیزر بدون حساسیت دندان استفاده می‌کنیم.

💎 جزئیات:
${s?.details.map(d => `• ${d}`).join("\n") || ""}

💰 هزینه:
${s?.priceEst || "تماس بگیرید"}`;
    }

    if (msg.includes("اقساط") || msg.includes("قسط") || msg.includes("هزینه") || msg.includes("قیمت") || msg.includes("چک")) {
      return `در کلینیک دنت فلو شرایط پرداخت اقساطی بسیار منعطف و آسانی برای مراجعین گرانقدر در نظر گرفته شده است:

💳 ${clinicConfig.installmentInfo}

همچنین مشاوره حضوری و عکس‌برداری اولیه در صورت شروع درمان کاملاً رایگان می‌باشد. برای هرکدام از خدمات مورد نظرتان مایل به رزرو نوبت هستید؟`;
    }

    if (msg.includes("آدرس") || msg.includes("کجاست") || msg.includes("موقعیت") || msg.includes("لوکیشن") || msg.includes("تهران") || msg.includes("نشانی")) {
      return `📍 آدرس کلینیک دنت فلو:
${clinicConfig.address}

🕒 ساعات کاری:
${clinicConfig.workingHours}

تلفن تماس مستقیم جهت هماهنگی:
📞 ${clinicConfig.phone}`;
    }

    if (msg.includes("تلفن") || msg.includes("شماره") || msg.includes("تماس") || msg.includes("زنگ") || msg.includes("تلفن")) {
      return `📞 شماره‌های تماس مستقیم با پذیرش کلینیک دنت فلو:
${clinicConfig.phone}

همچنین می‌توانید از بخش انتهای صفحه نوبت خود را به صورت آنلاین و ۲۴ ساعته ثبت کنید تا همکاران ما در اسرع وقت با شما تماس بگیرند.`;
    }

    if (msg.includes("ترس") || msg.includes("استرس") || msg.includes("فوبیا") || msg.includes("درد") || msg.includes("بیهوشی") || msg.includes("سدیشن") || msg.includes("خواب")) {
      return `هیچ نگرانی نداشته باشید! هدف اصلی کلینیک دنت فلو درمان کاملاً بدون درد است.
ما مجهز به سیستم پیشرفته "سدیشن" (خواب مصنوعی بسیار آرامش‌بخش تحت نظر متخصص بیهوشی) هستیم. شما به خوابی عمیق و شیرین می‌روید و بدون اینکه متوجه شوید تمام کارهای دندانپزشکی‌تان انجام می‌شود. 

آیا مایلید مشاوره سدیشن با دکتر هماهنگ کنیم؟`;
    }

    if (msg.includes("پزشک") || msg.includes("دکتر") || msg.includes("متخصص") || msg.includes("کیست") || msg.includes("مختاری")) {
      return `پزشک ارشد و جراح زیبایی کلینیک ما ${clinicConfig.doctorName} هستند.
🎓 سوابق و مدارک پزشک:
- ${clinicConfig.doctorTitle}
- ثبت بیش از ۵,۰۰۰ لبخند موفق و رضایت‌بخش
- استفاده از برترین برندهای سوئیسی و آلمانی دندانپزشکی`;
    }

    if (msg.includes("سلام") || msg.includes("درود") || msg.includes("وقت بخیر") || msg.includes("روز بخیر")) {
      return `سلام! وقت زیبای شما بخیر. خیلی خوش آمدید به دنت فلو. ✨
چطور می‌توانم در زمینه سلامت و زیبایی دندان‌ها به شما کمک کنم؟`;
    }

    return `ممنون از سؤال شما. من پاسخ دقیق کلمه به کلمه برای این موضوع ندارم؛ اما به عنوان دستیار هوشمند ${clinicConfig.doctorName} در کلینیک دنت فلو، پیشنهاد می‌کنم برای راهنمایی کامل یا هماهنگی نوبت با شماره تلفن ${clinicConfig.phone} تماس بگیرید یا از فرم نوبت‌دهی پایین صفحه استفاده کنید.

اگر سوالی درباره خدمات ایمپلنت، لمینت، ارتودنسی، عصب‌کشی، دندانپزشکی کودکان یا شرایط اقساطی دارید بپرسید؛ من با کمال میل راهنمایی‌تان می‌کنم! ✨`;
  };

  const sendChatMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isChatLoading) return;
    
    const userMessage = textToSend.trim();
    // Add user message to state
    const newMessages = [...chatMessages, { role: "user" as const, text: userMessage }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);
    setChatError(null);

    try {
      // Map chat messages to history format for backend
      const history = chatMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          history,
          message: userMessage,
          customSystemInstruction: aiPrompt
        })
      });

      if (!res.ok) {
        throw new Error("ترافیک بالا یا عدم اتصال به سرور بک‌اند؛ استفاده از پردازشگر محلی دنت فلو.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setChatMessages(prev => [...prev, { role: "model" as const, text: data.text }]);
    } catch (err: any) {
      console.warn("Backend Chat failed, falling back to local rule-based AI:", err);
      // Simulate typing speed for better UI feel
      setTimeout(() => {
        const fallbackText = getLocalBotResponse(userMessage);
        setChatMessages(prev => [...prev, { role: "model" as const, text: fallbackText }]);
        setIsChatLoading(false);
      }, 700);
      return; // prevent setting loading to false immediately
    } finally {
      // only runs if not caught by timeout local simulation
      setIsChatLoading(false);
    }
  };

  const getServiceTitle = (id: string) => {
    switch(id) {
      case "implant": return "ایمپلنت دندان";
      case "laminate": return "لمینت سرامیکی";
      case "composite": return "ونیر کامپوزیت";
      case "orthodontics": return "ارتودنسی نامرئی";
      case "bleaching": return "بلیچینگ دندان";
      case "pediatric": return "دندانپزشکی اطفال";
      case "rootcanal": return "عصب‌کشی (درمان ریشه)";
      case "surgery": return "جراحی لثه / عقل";
      default: return "سایر خدمات دندانپزشکی";
    }
  };

  const filteredBookings = adminBookings.filter(b => {
    if (adminFilter === "all") return true;
    return b.status === adminFilter;
  });

  const adminStats = {
    total: adminBookings.length,
    pending: adminBookings.filter(b => b.status === "pending").length,
    approved: adminBookings.filter(b => b.status === "approved").length,
    cancelled: adminBookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div className="font-sans min-h-screen flex flex-col selection:bg-teal-100 selection:text-teal-800 bg-[#F0F9F9] text-slate-800" id="main-container" dir="rtl">
      
      {/* 1. Header & Navigation (Floating Premium Bento Glass Pill) */}
      <header 
        id="app-header"
        className="fixed top-4 left-4 right-4 z-50 transition-all duration-300 max-w-7xl mx-auto"
      >
        <div 
          className={`px-6 rounded-[24px] transition-all duration-300 ${
            isScrolled 
              ? "bg-white/75 backdrop-blur-md border border-white/50 shadow-xl shadow-teal-950/5 py-3" 
              : "bg-white/45 backdrop-blur-md border border-white/20 py-4"
          }`}
          id="nav-container"
        >
          <div className="flex items-center justify-between" id="nav-inner">
            
            {/* Logo right aligned in RTL */}
            <div className="flex items-center gap-2.5" id="logo-block">
              <a href="#home" className="flex items-center gap-2 group" id="logo-link">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform" id="logo-icon-wrapper">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} id="svg-tooth-logo">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex flex-col text-right" id="logo-text">
                  <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors" id="brand-title">DentFlow</span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-widest -mt-1" id="brand-subtitle">دندانپزشکی دیجیتال</span>
                </div>
              </a>
            </div>

            {/* Desktop Menu - centered */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600" id="desktop-nav">
              <a 
                id="link-home"
                href="#home" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "home" ? "text-teal-600" : ""}`}
              >
                خانه
                {activeSection === "home" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-services"
                href="#services" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "services" ? "text-teal-600" : ""}`}
              >
                خدمات ما
                {activeSection === "services" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-assistant"
                href="#assistant" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "assistant" ? "text-teal-600" : ""}`}
              >
                دستیار هوشمند
                {activeSection === "assistant" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-about"
                href="#about" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "about" ? "text-teal-600" : ""}`}
              >
                درباره کلینیک
                {activeSection === "about" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-gallery"
                href="#gallery" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "gallery" ? "text-teal-600" : ""}`}
              >
                گالری لبخند
                {activeSection === "gallery" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-articles"
                href="#articles" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "articles" ? "text-teal-600" : ""}`}
              >
                مقالات آموزشی
                {activeSection === "articles" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
              <a 
                id="link-booking"
                href="#booking" 
                className={`transition-colors hover:text-teal-600 relative py-1 ${activeSection === "booking" ? "text-teal-600" : ""}`}
              >
                رزرو نوبت
                {activeSection === "booking" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </a>
            </nav>

            {/* Book appointment CTA left aligned */}
            <div className="hidden sm:flex items-center gap-4" id="header-cta-block">
              <button
                id="btn-toggle-admin"
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                    setIsAdminAuthenticated(false);
                    setAdminPassword("");
                  } else {
                    setIsAdminMode(true);
                  }
                }}
                className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  isAdminMode 
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isAdminMode ? "نمای سایت" : "پنل مدیریت"}</span>
              </button>
              <a 
                id="btn-call-direct"
                href={`tel:${clinicConfig.phoneRaw}`} 
                className="hidden md:flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors font-bold"
              >
                <Phone className="w-4 h-4 text-teal-500" />
                <span>{clinicConfig.phone.split(" | ")[0]}</span>
              </a>
              <a 
                id="btn-header-booking"
                href="#booking" 
                className="relative overflow-hidden group bg-gradient-to-l from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/10 hover:shadow-lg transition-all"
              >
                <span className="relative z-10">رزرو نوبت آنلاین</span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </a>
            </div>

            {/* Mobile Hamburger menu */}
            <button 
              id="btn-mobile-menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile menu dropdown with smooth sliding animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              id="mobile-dropdown-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border border-slate-200/50 overflow-hidden mt-2 rounded-2xl shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 font-semibold text-right" id="mobile-nav-links">
                <a 
                  id="mobile-link-home"
                  href="#home" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  خانه
                </a>
                <a 
                  id="mobile-link-services"
                  href="#services" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  خدمات ما
                </a>
                <a 
                  id="mobile-link-assistant"
                  href="#assistant" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  دستیار هوشمند
                </a>
                <a 
                  id="mobile-link-about"
                  href="#about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  درباره کلینیک
                </a>
                <a 
                  id="mobile-link-gallery"
                  href="#gallery" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  گالری لبخند
                </a>
                <a 
                  id="mobile-link-articles"
                  href="#articles" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  مقالات آموزشی
                </a>
                <a 
                  id="mobile-link-booking"
                  href="#booking" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all"
                >
                  رزرو نوبت آنلاین
                </a>
                
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3" id="mobile-menu-footer">
                  <button
                    id="mobile-btn-admin"
                    onClick={() => {
                      if (isAdminMode) {
                        setIsAdminMode(false);
                        setIsAdminAuthenticated(false);
                        setAdminPassword("");
                      } else {
                        setIsAdminMode(true);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border font-bold text-sm transition-all cursor-pointer ${
                      isAdminMode 
                        ? "bg-amber-500 text-white border-amber-500" 
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isAdminMode ? "خروج به نمای اصلی سایت" : "ورود به پنل مدیریت کلینیک"}</span>
                  </button>
                  <a 
                    id="mobile-btn-call"
                    href={`tel:${clinicConfig.phoneRaw}`} 
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-teal-500" />
                    <span>{clinicConfig.phone.split(" | ")[0]}</span>
                  </a>
                  <a 
                    id="mobile-btn-booking"
                    href="#booking" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    رزرو نوبت آنلاین
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Toggleable view: Clinic Admin Dashboard or Patient Landing Website */}
      {isAdminMode ? (
        !isAdminAuthenticated ? (
          <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full text-right flex items-center justify-center min-h-[70vh]" id="admin-login-container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-teal-100 rounded-[32px] p-8 shadow-2xl shadow-teal-950/5 w-full space-y-6"
              id="admin-login-card"
            >
              <div className="text-center space-y-3" id="admin-login-header">
                <div className="inline-flex p-3 rounded-full bg-teal-50 text-teal-600 mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">ورود به پنل مدیریت دنت فلو</h2>
                <p className="text-xs text-slate-500 font-semibold">لطفاً اطلاعات کاربری خود را وارد کنید</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4" id="admin-login-form">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">نام کاربری:</label>
                  <input 
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="نام کاربری را وارد کنید..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white text-slate-800 text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">کلمه عبور:</label>
                  <input 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="رمز عبور را وارد کنید..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white text-slate-800 text-sm font-semibold"
                  />
                </div>

                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  ورود به پنل کادر درمان
                </button>
              </form>

              {/* Netlify Auto-Installer Alert & Button */}
              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 space-y-3 text-right" id="netlify-login-installer">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold">
                  <Settings className="w-4 h-4 text-teal-600 animate-spin-slow" />
                  <span>دستیار دیتابیس و نصب خودکار دنت فلو</span>
                </div>
                <p className="text-[10px] sm:text-xs text-teal-700 font-semibold leading-relaxed">
                  این اپلیکیشن کاملاً مستقل بوده و بدون نیاز به وب‌سرور روی هاست‌های ایستایی چون <span className="font-bold text-teal-900">Netlify</span> اجرا می‌شود. اطلاعات ورود پنل: نام کاربری <span className="font-bold text-teal-900">admin</span> و کلمه عبور <span className="font-bold text-teal-900">admin</span> است.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("df_bookings");
                    localStorage.setItem("df_use_local_db", "true");
                    setUseLocalDb(true);
                    setAdminBookings(getLocalBookings());
                    alert("🎉 پایگاه داده کلاینت‌ساید با موفقیت نصب و فعال شد! دکمه ورود را بزنید تا کل کنترل‌سنتر را بررسی کنید.");
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer text-center block border-none shadow-sm shadow-teal-600/10"
                >
                  🚀 نصب خودکار اطلاعات نمونه (ویژه نتفیلای)
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setIsAdminAuthenticated(false);
                  setAdminPassword("");
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به نمای اصلی سایت</span>
              </button>
            </motion.div>
          </main>
        ) : (
          <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-right" id="admin-dashboard-container">
            <div className="bg-white border border-teal-100 rounded-[32px] p-6 sm:p-10 shadow-2xl shadow-teal-950/5 space-y-8" id="admin-dashboard-card">
              
              {/* Admin Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-6 gap-4" id="admin-dashboard-header">
                <div className="space-y-2" id="admin-header-title">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100">
                    <Settings className="w-3.5 h-3.5 animate-spin-slow text-teal-600" />
                    <span>پنل مدیریت و پذیرش کلینیک دنت فلو</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">میز کار و کنترل سنتر کلینیک دنت فلو</h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                    در این بخش می‌توانید به عنوان مدیر یا کادر درمان، نوبت‌های بیماران، محتوای سایت، قیمت خدمات و دستورالعمل‌های دستیار صوتی/متنی هوش مصنوعی را در لحظه تغییر دهید.
                  </p>
                </div>
                <div className="flex items-center gap-3" id="admin-header-actions">
                  <button
                    id="btn-admin-logout"
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      setAdminPassword("");
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>خروج از حساب</span>
                  </button>
                  <button
                    id="btn-admin-exit"
                    onClick={() => {
                      setIsAdminMode(false);
                      setIsAdminAuthenticated(false);
                      setAdminPassword("");
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>بازگشت به نمای اصلی سایت</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation Controls */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4" id="admin-tabs-nav">
                {[
                  { id: "bookings", label: "نوبت‌های دریافتی", icon: Calendar },
                  { id: "services", label: "ویرایش خدمات و تعرفه‌ها", icon: Sliders },
                  { id: "contact", label: "اطلاعات تماس و کلینیک", icon: MapPin },
                  { id: "ai", label: "پیکربندی هوش مصنوعی", icon: Sparkles },
                  { id: "analytics", label: "آمار و آنالیز کلینیک", icon: Activity }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = adminActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminActiveTab(tab.id as any)}
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive
                          ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/15"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Execution Mode & Auto Database Installer Control Panel */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 text-right" id="database-installer-panel">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-teal-600 shrink-0">
                    <Settings className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-slate-800">
                        سامانه مدیریت پایگاه داده دنت فلو (مخصوص Netlify و آفلاین)
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        useLocalDb 
                          ? "bg-teal-100 text-teal-800 border border-teal-200" 
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {useLocalDb ? "فعال در حالت: دیتابیس کلاینت‌ساید (LocalStorage)" : "فعال در حالت: متصل به سرور بک‌اند"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {useLocalDb 
                        ? "این برنامه با موفقیت در حالت کامپایل ایستا (کلاینت‌ساید) جهت تضمین سازگاری کامل با Netlify و بدون نیاز به سرور ابری مجزا پیکربندی شده است."
                        : "برنامه در حال تلاش برای اتصال زنده به دیتابیس سرور Node.js است. در صورت نیاز به نسخه مستقل آفلاین می‌توانید از این کلید استفاده کنید."
                      }
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      localStorage.removeItem("df_bookings");
                      localStorage.setItem("df_use_local_db", "true");
                      setUseLocalDb(true);
                      const fresh = getLocalBookings();
                      setAdminBookings(fresh);
                      alert("🎉 پایگاه داده و نوبت‌های نمونه دنت فلو با موفقیت روی مرورگر نصب و راه‌اندازی شد! هم‌اکنون می‌توانید نوبت‌ها را ثبت، ویرایش، تایید یا حذف کنید.");
                    }}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-teal-600/10"
                  >
                    🚀 نصب مجدد دیتابیس محلی
                  </button>
                  <button
                    onClick={() => {
                      const nextMode = !useLocalDb;
                      setUseLocalDb(nextMode);
                      localStorage.setItem("df_use_local_db", nextMode.toString());
                    }}
                    className={`px-4 py-2.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer border ${
                      useLocalDb 
                        ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {useLocalDb ? "اتصال به دیتابیس سرور" : "فعالسازی حالت نتفیلای"}
                  </button>
                </div>
              </div>

              {/* TAB CONTENT: BOOKINGS */}
              {adminActiveTab === "bookings" && (
                <div className="space-y-8" id="tab-bookings-content">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-grid">
                    <div className="bg-[#F8FCFC] border border-slate-100 p-5 rounded-2xl flex flex-col justify-between" id="stat-total">
                      <span className="text-xs font-bold text-slate-500">کل نوبت‌های ثبت شده</span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 font-mono">{adminStats.total}</span>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex flex-col justify-between" id="stat-pending">
                      <span className="text-xs font-bold text-amber-700">در انتظار بررسی پذیرش</span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-2 font-mono">{adminStats.pending}</span>
                    </div>

                    <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-2xl flex flex-col justify-between" id="stat-approved">
                      <span className="text-xs font-bold text-teal-700">تایید نهایی شده</span>
                      <span className="text-2xl sm:text-3xl font-black text-teal-600 mt-2 font-mono">{adminStats.approved}</span>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl flex flex-col justify-between" id="stat-cancelled">
                      <span className="text-xs font-bold text-rose-700">لغو شده یا عدم پاسخ</span>
                      <span className="text-2xl sm:text-3xl font-black text-rose-600 mt-2 font-mono">{adminStats.cancelled}</span>
                    </div>
                  </div>

                  {/* Filter controls and count */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2" id="admin-filters">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto" id="admin-filter-buttons">
                      {[
                        { value: "all", label: "همه نوبت‌ها" },
                        { value: "pending", label: "در انتظار بررسی" },
                        { value: "approved", label: "تایید شده" },
                        { value: "cancelled", label: "لغو شده" }
                      ].map((f) => (
                        <button
                          key={f.value}
                          id={`filter-btn-${f.value}`}
                          onClick={() => setAdminFilter(f.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            adminFilter === f.value 
                              ? "bg-teal-600 text-white shadow-md shadow-teal-600/15" 
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 shrink-0 self-end sm:self-auto" id="filtered-count">
                      تعداد موارد یافته شده: {filteredBookings.length} مورد
                    </span>
                  </div>

                  {/* Live Bookings Table / Cards */}
                  <div className="space-y-4" id="admin-bookings-list">
                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200" id="empty-bookings">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-extrabold text-slate-500">هیچ درخواستی در این دسته‌بندی یافت نشد.</p>
                        <p className="text-xs text-slate-400 mt-1">مراجعین جدید به صورت زنده در این جدول ظاهر خواهند شد.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4" id="bookings-grid-list">
                        <AnimatePresence mode="popLayout">
                          {filteredBookings.map((b) => (
                            <motion.div
                              key={b.id}
                              id={`admin-booking-row-${b.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`p-5 rounded-2xl border transition-all ${
                                b.status === "approved" 
                                  ? "bg-teal-50/20 border-teal-100" 
                                  : b.status === "cancelled"
                                  ? "bg-rose-50/10 border-rose-100/50"
                                  : "bg-white border-slate-100 shadow-md shadow-teal-950/5 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4" id={`row-layout-${b.id}`}>
                                
                                {/* Main info */}
                                <div className="space-y-3 flex-1" id={`row-info-${b.id}`}>
                                  <div className="flex flex-wrap items-center gap-2" id={`row-badge-row-${b.id}`}>
                                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">{b.id}</span>
                                    
                                    {b.status === "pending" && (
                                      <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">در انتظار تماس پذیرش</span>
                                    )}
                                    {b.status === "approved" && (
                                      <span className="text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-lg">تایید و رزرو قطعی</span>
                                    )}
                                    {b.status === "cancelled" && (
                                      <span className="text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg">لغو شده</span>
                                    )}

                                    <span className="text-[10px] text-slate-400 font-bold" dir="ltr">
                                      {new Date(b.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm" id={`row-details-${b.id}`}>
                                    <div>
                                      <span className="text-slate-400 font-bold block text-[11px]">بیمار:</span>
                                      <span className="font-extrabold text-slate-900 block mt-0.5">{b.fullName}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-bold block text-[11px]">شماره تماس:</span>
                                      <a href={`tel:${b.phone}`} className="font-bold text-teal-600 hover:underline block mt-0.5 font-mono text-right" dir="ltr">{b.phone}</a>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-bold block text-[11px]">خدمت مورد نظر:</span>
                                      <span className="font-semibold text-slate-700 block mt-0.5">{getServiceTitle(b.serviceId)}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-bold block text-[11px]">تاریخ و شیفت:</span>
                                      <span className="font-bold text-slate-800 block mt-0.5">{b.date} ({b.timeSlot === "morning" ? "شیفت صبح" : "شیفت عصر"})</span>
                                    </div>
                                  </div>

                                  {b.notes && (
                                    <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100 font-semibold mt-2" id={`row-notes-${b.id}`}>
                                      <span className="font-extrabold text-slate-900 ml-1">توضیحات بیمار:</span>
                                      {b.notes}
                                    </div>
                                  )}

                                  {b.adminComment && (
                                    <div className="bg-teal-50/40 p-3 rounded-xl text-xs text-slate-700 border border-teal-100 font-semibold mt-2" id={`row-admin-comment-${b.id}`}>
                                      <span className="font-extrabold text-teal-800 ml-1">توضیحات و پاسخ مطب:</span>
                                      {b.adminComment}
                                    </div>
                                  )}
                                </div>

                                {/* Quick Admin Actions */}
                                <div className="flex flex-row lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100" id={`row-actions-${b.id}`}>
                                  
                                  <div className="flex flex-wrap gap-2 w-full justify-end" id={`action-btn-group-${b.id}`}>
                                    <button
                                      id={`btn-edit-trigger-${b.id}`}
                                      onClick={() => {
                                        setActiveEditingId(b.id);
                                        setEditDate(b.date);
                                        setEditTimeSlot(b.timeSlot);
                                        setEditAdminComment(b.adminComment || "");
                                      }}
                                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1 w-full sm:w-auto justify-center cursor-pointer border border-slate-200"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                      <span>ویرایش نوبت</span>
                                    </button>

                                    {b.status !== "approved" && (
                                      <button
                                        id={`btn-approve-${b.id}`}
                                        onClick={() => updateBookingStatus(b.id, "approved")}
                                        className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-colors flex items-center gap-1 w-full sm:w-auto justify-center cursor-pointer"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>تایید نوبت</span>
                                      </button>
                                    )}

                                    {b.status !== "cancelled" && (
                                      <button
                                        id={`btn-cancel-${b.id}`}
                                        onClick={() => updateBookingStatus(b.id, "cancelled")}
                                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold text-xs transition-colors flex items-center gap-1 w-full sm:w-auto justify-center cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        <span>لغو نوبت</span>
                                      </button>
                                    )}

                                    <button
                                      id={`btn-delete-${b.id}`}
                                      onClick={() => deleteBooking(b.id)}
                                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                      aria-label="حذف نوبت"
                                      title="حذف نوبت"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                </div>

                              </div>

                              {activeEditingId === b.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="border-t border-slate-100 pt-4 mt-4 text-right space-y-4"
                                  id={`edit-panel-${b.id}`}
                                >
                                  <div className="flex items-center gap-2 text-teal-600 font-extrabold text-xs">
                                    <Edit3 className="w-4 h-4" />
                                    <span>ویرایش اطلاعات، تاریخ، زمان و پیام تایید مطب دنت فلو</span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1">
                                      <label className="text-slate-500 font-bold block">تاریخ تایید شده نهایی:</label>
                                      <input 
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white text-slate-800 font-bold"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-slate-500 font-bold block">زمان/شیفت حضور مراجع:</label>
                                      <select
                                        value={editTimeSlot}
                                        onChange={(e) => setEditTimeSlot(e.target.value as "morning" | "afternoon")}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-slate-800"
                                      >
                                        <option value="morning">شیفت صبح (۱۰ الی ۱۴)</option>
                                        <option value="afternoon">شیفت عصر (۱۴ الی ۲۰)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-1 text-xs">
                                    <label className="text-slate-500 font-bold block">توضیحات مطب، ساعت حضور بیمار و توصیه‌های پزشک (پاسخ اختصاصی به بیمار):</label>
                                    <textarea
                                      value={editAdminComment}
                                      onChange={(e) => setEditAdminComment(e.target.value)}
                                      placeholder="مثال: نوبت شما برای ساعت ۱۱:۳۰ تایید شد. لطفاً یک ربع قبل از زمان مقرر با مدارک پزشکی خود تشریف بیاورید."
                                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white resize-none text-slate-700 font-semibold"
                                      rows={2.5}
                                    />
                                  </div>

                                  <div className="flex gap-2 justify-end text-xs">
                                    <button
                                      type="button"
                                      onClick={() => setActiveEditingId(null)}
                                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer transition-colors"
                                    >
                                      انصراف
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateBookingDetails(b.id, {
                                        date: editDate,
                                        timeSlot: editTimeSlot,
                                        adminComment: editAdminComment
                                      })}
                                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold cursor-pointer transition-colors flex items-center gap-1 shadow-md shadow-teal-600/10"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                      <span>ثبت و ذخیره تغییرات</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: SERVICES & PRICING */}
              {adminActiveTab === "services" && (
                <div className="space-y-6" id="services-editor-tab">
                  <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl text-right">
                    <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                      <span>مدیریت خدمات و قیمت‌های کلینیک دنت فلو</span>
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                      در این بخش می‌توانید لیست خدمات، جزئیات هر درمان و تعرفه‌های درج شده در سایت را ویرایش کنید. تغییرات اعمال شده بلافاصله در کل سایت و چت‌بات هوشمند منعکس خواهند شد.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((srv, sIdx) => (
                      <div key={srv.id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 text-right">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                            {srv.title}
                          </span>
                          <span className="text-xs font-mono font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">ID: {srv.id}</span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">عنوان خدمت:</label>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...services];
                                updated[sIdx].title = val;
                                setServices(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">تعرفه / قیمت حدودی:</label>
                            <input
                              type="text"
                              value={srv.priceEst}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...services];
                                updated[sIdx].priceEst = val;
                                setServices(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-teal-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">توضیح کوتاه:</label>
                            <textarea
                              value={srv.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...services];
                                updated[sIdx].description = val;
                                setServices(updated);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-medium text-slate-600 resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-500 font-bold block">جزئیات و ویژگی‌ها (۴ مورد):</label>
                            {srv.details.map((detail, dIdx) => (
                              <input
                                key={dIdx}
                                type="text"
                                value={detail}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...services];
                                  updated[sIdx].details[dIdx] = val;
                                  setServices(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-slate-100 bg-white font-semibold text-slate-700"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              localStorage.setItem("df_services", JSON.stringify(services));
                              alert("تغییرات خدمت «" + srv.title + "» با موفقیت در مرورگر ذخیره شد و در تمامی بخش‌های سایت اعمال گردید.");
                            }}
                            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border-none"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>ذخیره تغییرات این خدمت</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: CLINIC CONTACT & CONFIG */}
              {adminActiveTab === "contact" && (
                <div className="space-y-6" id="contact-editor-tab">
                  <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl text-right">
                    <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      <span>مدیریت اطلاعات تماس، آدرس و کادر کلینیک</span>
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                      در این بخش می‌توانید نشانی مطب، شماره‌های تلفن، پزشک ارشد، و توضیحات گالری و شرایط قسطی را به طور یکجا ادیت کنید. تغییرات بلافاصله در کل سایت، فرم‌ها، هدر، فوتر و چت‌بات اعمال می‌شوند.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">نام پزشک ارشد کلینیک:</label>
                        <input
                          type="text"
                          value={clinicConfig.doctorName}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, doctorName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-slate-800 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">تخصص و سوابق پزشک:</label>
                        <input
                          type="text"
                          value={clinicConfig.doctorTitle}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, doctorTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-bold text-slate-700 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">شماره تلفن‌های تماس (نمایشی):</label>
                        <input
                          type="text"
                          value={clinicConfig.phone}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-black text-slate-800 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">لینک خام تماس (مثال: 02122000000 بدون فاصله یا خط تیره):</label>
                        <input
                          type="text"
                          value={clinicConfig.phoneRaw}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, phoneRaw: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-mono font-bold text-slate-800 text-sm text-left"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">شماره تلگرام / پیام‌رسان‌ها:</label>
                        <input
                          type="text"
                          value={clinicConfig.telegram}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, telegram: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-black text-slate-800 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">ساعات کاری کلینیک:</label>
                        <input
                          type="text"
                          value={clinicConfig.workingHours}
                          onChange={(e) => setClinicConfig({ ...clinicConfig, workingHours: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-bold text-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">آدرس دقیق فیزیکی مطب:</label>
                      <input
                        type="text"
                        value={clinicConfig.address}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-slate-800 text-sm"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">توضیحات بخش «درباره دنت فلو»:</label>
                      <textarea
                        value={clinicConfig.aboutDesc}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, aboutDesc: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-semibold text-slate-600 text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">شرایط پرداخت اقساطی مراجعین:</label>
                      <textarea
                        value={clinicConfig.installmentInfo}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, installmentInfo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-bold text-slate-700 text-sm resize-none"
                        rows={2.5}
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          localStorage.setItem("df_clinic_config", JSON.stringify(clinicConfig));
                          alert("اطلاعات عمومی کلینیک و پزشک با موفقیت ذخیره شد و در تمامی بخش‌ها و چت‌بات اعمال گردید.");
                        }}
                        className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-teal-600/15 cursor-pointer border-none"
                      >
                        <Save className="w-4 h-4" />
                        <span>ثبت و ذخیره سراسری تنظیمات کلینیک</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: AI BOT CONFIGURATION */}
              {adminActiveTab === "ai" && (
                <div className="space-y-6" id="ai-editor-tab">
                  <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl text-right">
                    <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
                      <span>پیکربندی چت‌بات هوش مصنوعی کلینیک دنت فلو</span>
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                      در این بخش می‌توانید هویت، رفتار، پیام خوش‌آمدگویی و دستورالعمل‌های سیستمی ربات پاسخگوی هوشمند (Gemini 3.5 Flash) را سفارشی‌سازی کنید تا مطابق استراتژی بازاریابی شما به بیماران پاسخ دهد.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <label className="text-slate-500 font-bold block">نام نمایشی دستیار هوشمند:</label>
                        <input
                          type="text"
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-extrabold text-slate-800 text-sm"
                        />
                      </div>

                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <label className="text-slate-500 font-bold block">نوع مدل پردازنده هوشمند:</label>
                        <input
                          type="text"
                          value="Google Gemini 3.5 Flash (با پشتیبانی محلی دنت فلو)"
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-100 text-slate-400 font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">پیام خوش‌آمدگویی اولیه ربات (کارت اول چت):</label>
                      <textarea
                        value={aiGreeting}
                        onChange={(e) => setAiGreeting(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-semibold text-slate-700 text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">دستورالعمل سیستمی و پرومپت ربات (System Instructions):</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white font-mono text-slate-600 text-xs leading-relaxed resize-none"
                        rows={12}
                        dir="rtl"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row justify-between gap-3">
                      <button
                        onClick={() => {
                          setAiName("دستیار هوشمند دنت فلو");
                          setAiGreeting("سلام! من دستیار هوشمند و تخصصی کلینیک دندانپزشکی دنت فلو هستم. هر سوالی درباره طرح درمان، هزینه‌ها، اقساط، ترس از دندانپزشکی یا خدمات ما دارید بپرسید؛ من با عشق راهنمایی‌تان می‌کنم! ✨");
                          setAiPrompt(`شما دستیار تخصصی، دلسوز و فوق‌العاده باهوش کلینیک دندانپزشکی دیجیتال "دنت فلو" (DentFlow) هستید. نام شما "دستیار هوشمند دنت فلو" است.
دستورالعمل‌ها:
۱. پاسخ به مراجعین درباره خدمات ایمپلنت، لمینت، ارتودنسی، عصب‌کشی، دندانپزشکی کودکان.
۲. جراح زیبایی کلینیک "دکتر مختاری" است. شماره تماس: ۰۲۱-۲۲۰۰۰۰۰۰ است.
۳. پرداخت اقساطی: ۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره.`);
                          alert("تنظیمات ریست شد. برای ذخیره نهایی، دکمه ذخیره سمت چپ را بزنید.");
                        }}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-extrabold text-xs transition-colors cursor-pointer"
                      >
                        بازنشانی به تنظیمات پیش‌فرض کارخانه
                      </button>

                      <button
                        onClick={() => {
                          localStorage.setItem("df_ai_name", aiName);
                          localStorage.setItem("df_ai_greeting", aiGreeting);
                          localStorage.setItem("df_ai_prompt", aiPrompt);
                          alert("پیکربندی هوش مصنوعی با موفقیت بروزرسانی شد. ربات از این لحظه با پرومپت جدید بیمارها را راهنمایی خواهد کرد.");
                        }}
                        className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-teal-600/15 cursor-pointer border-none"
                      >
                        <Save className="w-4 h-4" />
                        <span>بروزرسانی پرومپت و کالیبراسیون هوش مصنوعی</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: ANALYTICS & CLINIC CHARTS */}
              {adminActiveTab === "analytics" && (
                <div className="space-y-6" id="analytics-tab-content">
                  <div className="bg-teal-50/30 border border-teal-100/50 p-5 rounded-2xl text-right">
                    <h3 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal-600 animate-pulse" />
                      <span>داشبورد آنالیز و بررسی عملکرد دنت فلو</span>
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                      آمارها، توزیع نوبت‌ها، خدمات پرطرفدار و ارزش مادی کلینیک را به صورت گرافیکی و کاملاً محاسباتی مشاهده کنید. این اطلاعات زنده هستند و با ثبت هر نوبت جدید فورا بروزرسانی می‌شوند.
                    </p>
                  </div>

                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="analytics-kpi-cards">
                    <div className="bg-white border border-teal-100 p-5 rounded-2xl text-right">
                      <span className="text-slate-400 font-extrabold text-[11px] block">ارزش نوبت‌های تایید شده دنت فلو</span>
                      <span className="text-2xl sm:text-3xl font-black text-teal-600 block mt-2 font-mono">
                        {(adminBookings.filter(b => b.status === "approved").reduce((sum, b) => {
                          const prices: {[key: string]: number} = { implant: 9500000, veneer: 2800000, orthodontics: 22000000, bleaching: 3500000, pediatric: 1200000, "root-canal": 2500000, surgery: 1800000 };
                          return sum + (prices[b.serviceId] || 1500000);
                        }, 0)).toLocaleString("fa-IR")} <span className="text-xs font-bold text-slate-500">تومان</span>
                      </span>
                    </div>

                    <div className="bg-white border border-amber-100 p-5 rounded-2xl text-right">
                      <span className="text-slate-400 font-extrabold text-[11px] block">پتانسیل درآمدی نوبت‌های در انتظار بررسی</span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 block mt-2 font-mono">
                        {(adminBookings.filter(b => b.status === "pending").reduce((sum, b) => {
                          const prices: {[key: string]: number} = { implant: 9500000, veneer: 2800000, orthodontics: 22000000, bleaching: 3500000, pediatric: 1200000, "root-canal": 2500000, surgery: 1800000 };
                          return sum + (prices[b.serviceId] || 1500000);
                        }, 0)).toLocaleString("fa-IR")} <span className="text-xs font-bold text-slate-500">تومان</span>
                      </span>
                    </div>

                    <div className="bg-white border border-teal-50 p-5 rounded-2xl text-right">
                      <span className="text-slate-400 font-extrabold text-[11px] block">محبوب‌ترین درمان ثبت شده</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-800 block mt-2">
                        {(() => {
                          if (adminBookings.length === 0) return "ایمپلنت دندان";
                          const counts: {[key: string]: number} = {};
                          adminBookings.forEach(b => counts[b.serviceId] = (counts[b.serviceId] || 0) + 1);
                          const topId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "implant");
                          return services.find(s => s.id === topId)?.title || "ایمپلنت دندان";
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Recharts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-wrapper">
                    {/* Chart 1: Distribution by Service */}
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-right space-y-4">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-200 pb-2">سهم خدمات و درمان‌های درخواستی مراجعین</h4>
                      <div className="h-[300px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={(() => {
                                const list = adminBookings.length > 0 ? adminBookings : [
                                  { serviceId: "implant" }, { serviceId: "implant" },
                                  { serviceId: "veneer" }, { serviceId: "veneer" }, { serviceId: "veneer" },
                                  { serviceId: "orthodontics" }, { serviceId: "bleaching" }
                                ];
                                const counts: {[key: string]: number} = {};
                                list.forEach(b => counts[b.serviceId] = (counts[b.serviceId] || 0) + 1);
                                return Object.keys(counts).map(id => ({
                                  name: services.find(s => s.id === id)?.title || id,
                                  value: counts[id]
                                }));
                              })()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[
                                "#0D9488", "#06B6D4", "#3B82F6", "#8B5CF6", 
                                "#EC4899", "#F59E0B", "#10B981"
                              ].map((color, idx) => (
                                <Cell key={`cell-${idx}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} درخواست`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Bookings Status Breakdown */}
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-right space-y-4">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-200 pb-2">وضعیت پذیرش و نهایی‌سازی نوبت‌ها</h4>
                      <div className="h-[300px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "تایید نهایی شده", تعداد: adminBookings.filter(b => b.status === "approved").length || 4, رنگ: "#0D9488" },
                              { name: "در انتظار تماس", تعداد: adminBookings.filter(b => b.status === "pending").length || 3, رنگ: "#D97706" },
                              { name: "لغو شده", تعداد: adminBookings.filter(b => b.status === "cancelled").length || 1, رنگ: "#E11D48" }
                            ]}
                          >
                            <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                            <Tooltip formatter={(value) => `${value} مورد`} />
                            <Bar dataKey="تعداد" radius={[8, 8, 0, 0]}>
                              {[
                                { color: "#0D9488" },
                                { color: "#D97706" },
                                { color: "#E11D48" }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 3: Potential income estimate */}
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-right space-y-4 col-span-1 lg:col-span-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-200 pb-2">مقایسه ارزش مادی نوبت‌های تایید شده در مقابل معلق (میلیون تومان)</h4>
                      <div className="h-[250px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              {
                                name: "ارزش مادی نوبت‌ها",
                                "تایید شده": (adminBookings.filter(b => b.status === "approved").reduce((sum, b) => {
                                  const prices: {[key: string]: number} = { implant: 9500000, veneer: 2800000, orthodontics: 22000000, bleaching: 3500000, pediatric: 1200000, "root-canal": 2500000, surgery: 1800000 };
                                  return sum + (prices[b.serviceId] || 1500000);
                                }, 0)) / 1000000 || 28,
                                "در انتظار تماس": (adminBookings.filter(b => b.status === "pending").reduce((sum, b) => {
                                  const prices: {[key: string]: number} = { implant: 9500000, veneer: 2800000, orthodontics: 22000000, bleaching: 3500000, pediatric: 1200000, "root-canal": 2500000, surgery: 1800000 };
                                  return sum + (prices[b.serviceId] || 1500000);
                                }, 0)) / 1000000 || 16
                              }
                            ]}
                          >
                            <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                            <Tooltip formatter={(value) => `${value} میلیون تومان`} />
                            <Legend />
                            <Area type="monotone" dataKey="تایید شده" stroke="#0D9488" fill="#CCFBF1" />
                            <Area type="monotone" dataKey="در انتظار تماس" stroke="#D97706" fill="#FEF3C7" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Helper Info */}
              <div className="bg-teal-50/40 rounded-2xl p-4 border border-teal-100 flex items-center gap-3" id="admin-help-info">
                <Info className="w-5 h-5 text-teal-600 shrink-0" />
                <p className="text-[11px] sm:text-xs text-slate-600 font-bold leading-relaxed">
                  <span className="font-black text-teal-700">راهنمای کادر درمان:</span> با تایید هر نوبت، درخواست به وضعیت رنگی سبز (رزرو قطعی) منتقل خواهد شد. همچنین با کلیک روی شماره تماس هر مراجع، می‌توانید مستقیماً با او تماس تلفنی یا ارتباط واتس‌اپ برقرار کنید. اطلاعات این جدول مستقیماً با پایگاه داده سرور کلینیک دنت فلو همگام‌سازی می‌شود.
                </p>
              </div>

            </div>
          </main>
        )
      ) : (
        <>
          {/* 2. Hero Section (Grand Bento Grid Design Pattern) */}
          <section 
            id="home" 
            className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          >
        {/* Subtle decorative background lights matching Bento theme */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-teal-200/20 blur-[80px] pointer-events-none" id="bg-glow-teal"></div>
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full bg-rose-200/10 blur-[80px] pointer-events-none" id="bg-glow-coral"></div>
        
        {/* The Master Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6" id="hero-bento-grid">
          
          {/* Bento Card 1: Main Copy and Primary Calls to Action (Spans 7 columns) */}
          <div 
            className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-white/50 p-8 sm:p-12 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between text-right space-y-6"
            id="bento-hero-main-card"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100" id="hero-badge">
                <Sparkle className="w-3.5 h-3.5 text-teal-500 animate-spin-slow animate-pulse" />
                <span>مدرن‌ترین کلینیک دندانپزشکی دیجیتال در کشور</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight sm:leading-snug" id="hero-title">
                لبخندی که شایسته شماست، <br className="hidden sm:inline" />
                در کلینیک تخصصی <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-teal-500">دنت فلو (DentFlow)</span>
              </h1>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium" id="hero-desc">
                ما در دنت فلو با تلفیق دندانپزشکی دیجیتال، مواد درجه یک سوئیسی و کادر متخصص باسابقه، تجربه‌ای بدون درد، بدون استرس و بسیار ماندگار را برای شما طراحی کرده‌ایم. لذت داشتن دندان‌های سالم و بی‌عیب در محیطی آرام‌بخش.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4" id="hero-cta-group">
              <a 
                id="hero-primary-cta"
                href="#booking" 
                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-gradient-to-l from-teal-600 to-teal-500 text-white font-bold text-base shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all"
              >
                همین حالا نوبت بگیرید
              </a>
              <a 
                id="hero-secondary-cta"
                href="#services" 
                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-600 font-bold text-base transition-all shadow-sm"
              >
                مشاهده خدمات ما
              </a>
            </div>
          </div>

          {/* Bento Card 2: Visual High-Fidelity Doctor Frame & Live Available Status Badge (Spans 5 columns) */}
          <div 
            className="lg:col-span-5 bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between relative overflow-hidden group min-h-[350px]"
            id="bento-hero-doctor-card"
          >
            {/* Visual badge top */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md border border-white/60 flex items-center gap-2.5 z-10 animate-bounce-slow" id="badge-quality">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-slate-900 leading-none">محیط بدون استرس</p>
                <p className="text-[10px] text-slate-500 mt-1">تضمین عدم بروز درد و حساسیت</p>
              </div>
            </div>

            {/* Swiss laser tech badge bottom */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md border border-white/60 flex items-center gap-2.5 z-10" id="badge-tech">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-slate-900 leading-none">فناوری لیزر پیشرفته</p>
                <p className="text-[10px] text-slate-500 mt-1">سوئیسی درجه یک</p>
              </div>
            </div>

            {/* Hero Dental Doctor/Clinic Image */}
            <div className="absolute inset-0 w-full h-full" id="bento-hero-img-container">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800" 
                alt="کلینیک دندانپزشکی DentFlow"
                id="hero-main-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlap footer text inside the visual bento card */}
            <div className="relative z-10 mt-auto text-right text-white space-y-1 p-2 bg-slate-950/40 backdrop-blur-sm rounded-2xl" id="doctor-visual-label">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400">کلینیک فعال و پذیرش باز است</span>
              </div>
              <h4 className="font-bold text-sm">مجهز به تکنولوژی مدل‌سازی ۳بعدی فک</h4>
            </div>
          </div>

          {/* Bento Grid Sub-row: Stats blocks styled as clean, mini nested bento items (Spans 12 columns) */}
          <div className="lg:col-span-12" id="bento-hero-stats-row">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg shadow-teal-950/5 text-center flex flex-col items-center justify-center hover:bg-white transition-all duration-300" 
                  id={`stat-item-${idx}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-3 text-teal-600 shadow-inner" id={`stat-icon-${idx}`}>
                    {renderServiceIcon(stat.icon, "w-6 h-6 text-teal-600")}
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900" id={`stat-val-${idx}`}>{stat.value}</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-bold mt-1" id={`stat-lbl-${idx}`}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Trust Box: Compact Bento Card (Spans 12 columns) */}
          <div 
            className="lg:col-span-12 bg-white/70 backdrop-blur-md border border-white/40 px-6 py-4 rounded-2xl shadow-lg shadow-teal-950/5 flex flex-wrap items-center justify-between gap-4"
            id="bento-hero-trust-bar"
          >
            <div className="flex items-center gap-3" id="trust-avatars-row">
              <div className="flex -space-x-2.5 space-x-reverse" id="avatar-stack">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="سارا" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="امین" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="نیلوفر" />
                <div className="w-9 h-9 rounded-full border-2 border-white bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold" id="avatar-more">+۵k</div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-bold" id="trust-label">رضایت‌مندی بیش از ۵۰۰۰ بیمار زیبایی و درمانی در سال گذشته</p>
            </div>
            
            <div className="flex items-center gap-1 text-amber-500" id="trust-stars-wrapper">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-black text-slate-800 mr-2">۵.۰ / ۵.۰</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Our Services Section (RTL Bento Card Layout) */}
      <section id="services" className="py-20 lg:py-24 scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header Block as elegant center header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="services-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-100" id="services-badge">
            <span>چه خدماتی ارائه می‌دهیم؟</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" id="services-title">خدمات تخصصی و فوق‌مدرن کلینیک دنت فلو</h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold" id="services-desc">
            ما دایره کاملی از نیازهای بهداشتی، درمانی و زیبایی دهان و دندان شما را به کمک فناوری روز دنیا و متریال تضمین‌شده بین‌المللی پوشش می‌دهیم. برای مشاهده جزئیات روی هر خدمت کلیک کنید.
          </p>
        </div>

        {/* Bento Grid Services arrangement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
          {services.map((service, idx) => {
            // Apply unique bento layouts - e.g. first and primary aesthetic services get glowing subtle card gradients
            const isHighlight = service.id === "implant" || service.id === "laminate";
            return (
              <div 
                key={service.id}
                id={`service-card-${service.id}`}
                className={`group relative rounded-[28px] p-8 border hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isHighlight 
                    ? "bg-gradient-to-br from-white to-teal-50/30 border-teal-200/50 shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:shadow-teal-900/10" 
                    : "bg-white/80 backdrop-blur-md border-white/60 shadow-lg shadow-teal-950/5 hover:shadow-xl hover:shadow-teal-900/5"
                }`}
                onClick={() => setActiveServiceModal(service)}
              >
                <div id={`service-body-${service.id}`}>
                  {/* Decorative Icon Wrapper */}
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center text-teal-600 mb-6 shadow-sm border border-teal-100/30 transition-colors duration-300" id={`service-card-icon-${service.id}`}>
                    {renderServiceIcon(service.iconName, "w-6 h-6 group-hover:text-white transition-colors")}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors" id={`service-card-title-${service.id}`}>
                      {service.title}
                    </h3>
                    {isHighlight && (
                      <span className="text-[9px] bg-rose-50 text-rose-500 font-bold px-1.5 py-0.5 rounded-md border border-rose-100">ویژه</span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium" id={`service-card-desc-${service.id}`}>
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold" id={`service-card-footer-${service.id}`}>
                  <span className="text-teal-600 group-hover:underline flex items-center gap-1.5" id={`service-card-more-${service.id}`}>
                    مشاهده جزئیات و تعرفه هزینه
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <span className="text-teal-800 bg-teal-50 px-2 py-1 rounded-lg" id={`service-card-price-${service.id}`}>
                    {service.priceEst}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Services Detail Modal (AnimatePresence - Bento Style overlays) */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="service-modal-overlay">
            {/* Modal backdrop */}
            <motion.div 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveServiceModal(null)}
              id="modal-backdrop"
            />
            
            {/* Modal content body */}
            <motion.div 
              id="service-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col text-right"
            >
              {/* Modal header visual decoration */}
              <div className="p-6 bg-gradient-to-l from-teal-600 to-teal-500 text-white flex items-center justify-between" id="modal-header">
                <div className="flex items-center gap-3" id="modal-header-title">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white" id="modal-icon">
                    {renderServiceIcon(activeServiceModal.iconName, "w-6 h-6 text-white")}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold" id="modal-service-title">{activeServiceModal.title}</h4>
                    <span className="text-xs text-teal-100" id="modal-service-category">دنت فلو | DentFlow</span>
                  </div>
                </div>
                <button 
                  id="btn-close-modal"
                  onClick={() => setActiveServiceModal(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal content body scrollable */}
              <div className="p-6 overflow-y-auto space-y-6" id="modal-scroll-area">
                <div className="space-y-2.5" id="modal-desc-block">
                  <span className="text-xs font-bold text-slate-400 block">توضیحات خدمات</span>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-semibold" id="modal-desc">{activeServiceModal.description}</p>
                </div>

                <div className="space-y-4" id="modal-details-block">
                  <span className="text-xs font-bold text-slate-400 block">بخش‌های جزئی و مزایای درمان</span>
                  <div className="grid sm:grid-cols-2 gap-3" id="modal-details-grid">
                    {activeServiceModal.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100" id={`modal-detail-item-${idx}`}>
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
                        <span className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4" id="modal-pricing">
                  <div className="text-center sm:text-right" id="modal-price-lbl">
                    <p className="text-xs text-slate-500 font-bold">تعرفه تقریبی هزینه درمان</p>
                    <p className="text-base sm:text-lg font-black text-teal-700 mt-1">{activeServiceModal.priceEst}</p>
                  </div>
                  <div className="text-xs text-slate-400 font-bold" id="modal-installments-badge">
                    امکان پرداخت اقساطی بلندمدت با چک صیادی
                  </div>
                </div>
              </div>

              {/* Modal Footer actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3" id="modal-actions">
                <button 
                  id="btn-modal-cancel"
                  onClick={() => setActiveServiceModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors"
                >
                  انصراف
                </button>
                <button 
                  id="btn-modal-book"
                  onClick={() => selectServiceAndBook(activeServiceModal)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  رزرو نوبت برای این خدمت
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3.5. Clinical AI Assistant Section (دستیار هوشمند تخصصی دنت‌فلو) */}
      <section id="assistant" className="py-20 lg:py-24 bg-gradient-to-b from-[#F0F9F9] to-white scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="assistant-grid">
          
          {/* Card A: Assistant Description & Quick Questions (Spans 5 Columns) */}
          <div 
            className="lg:col-span-5 bg-white/80 backdrop-blur-md border border-teal-100 p-8 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between text-right"
            id="assistant-info-card"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100" id="assistant-badge">
                <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
                <span>پاسخگویی آنی شبانه‌روزی</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight" id="assistant-card-title">
                دستیار تخصصی و هوشمند <span className="text-teal-600">دنت فلو</span>
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold" id="assistant-card-desc">
                قبل از مراجعه حضوری، تمامی سوالات خود در مورد درمان‌های دندانپزشکی، طول درمان، قیمت تقریبی، نحوه پرداخت اقساطی یا رفع استرس دندانپزشکی را بپرسید. دستیار هوشمند ما با تکیه بر اطلاعات علمی و خدمات کلینیک فوراً به شما پاسخ می‌دهد.
              </p>

              <div className="space-y-3" id="quick-questions-wrapper">
                <p className="text-xs font-black text-slate-400">سوالات متداول کلیک‌شدنی:</p>
                <div className="flex flex-wrap gap-2" id="quick-question-pills">
                  {[
                    "هزینه ایمپلنت دندان چقدر است؟",
                    "آیا شرایط پرداخت اقساطی دارید؟",
                    "برای ترس شدید از دندانپزشکی چه راهکاری دارید؟",
                    "تفاوت کامپوزیت و لمینت چیست؟",
                    "عصب‌کشی چقدر طول می‌کشد و آیا درد دارد؟"
                  ].map((qText, qIdx) => (
                    <button
                      key={qIdx}
                      id={`qq-pill-${qIdx}`}
                      onClick={() => sendChatMessage(qText)}
                      disabled={isChatLoading}
                      className="text-right px-3.5 py-2 rounded-xl bg-teal-50/50 hover:bg-teal-50 border border-teal-100/60 hover:border-teal-300 text-teal-800 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-right" id="assistant-form-hint">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-950 leading-tight">رزرو مستقیم پس از گفتگو</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-bold">پس از رفع ابهامات خود، می‌توانید از فرم انتهای صفحه برای رزرو نوبت رایگان استفاده کنید.</p>
              </div>
            </div>
          </div>

          {/* Card B: Live Interactive Chat Terminal (Spans 7 Columns) */}
          <div 
            className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-[32px] border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative min-h-[480px]"
            id="assistant-chat-card"
          >
            {/* Terminal Header */}
            <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800/60 flex items-center justify-between" id="chat-header">
              <div className="flex items-center gap-3" id="chat-identity">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
                  <span className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs sm:text-sm font-black text-slate-100 leading-tight">دستیار بالینی کلینیک DentFlow</h4>
                  <p className="text-[10px] text-teal-400 font-bold mt-0.5">سیستم هوش مصنوعی بر بستر Gemini 3.5</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5" id="chat-window-decor">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* Chat Messages Log */}
            <div 
              className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[350px] min-h-[280px] bg-slate-900/40"
              id="chat-messages-log"
            >
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  id={`chat-msg-${index}`}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm font-semibold leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-teal-600 text-white rounded-tr-none" 
                        : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50"
                    }`}
                  >
                    <p className="whitespace-pre-line text-right">{msg.text}</p>
                    <span className="block text-[10px] text-slate-400 mt-2 text-left" dir="ltr">
                      {msg.role === "user" ? "شما" : "دستیار دنت‌فلو"}
                    </span>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-end" id="chat-loading-item">
                  <div className="bg-slate-800 text-slate-100 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <p className="text-xs text-slate-400 font-bold pr-1">در حال بررسی سوال شما...</p>
                  </div>
                </div>
              )}
              {chatError && (
                <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-3 text-rose-300 text-xs text-right" id="chat-error-item">
                  {chatError}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Field Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendChatMessage(chatInput);
              }}
              className="bg-slate-950/90 px-5 py-4 border-t border-slate-800/80 flex items-center gap-3"
              id="chat-input-form"
            >
              <button
                type="submit"
                id="btn-send-chat"
                disabled={isChatLoading || !chatInput.trim()}
                className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white flex items-center justify-center transition-colors shrink-0 disabled:text-slate-500"
                aria-label="ارسال پیام"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
              
              <input 
                type="text"
                id="chat-input-field"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="سوال خود را بنویسید (مثلاً: آیا ایمپلنت درد دارد؟)..."
                disabled={isChatLoading}
                className="flex-1 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/80 text-right font-semibold disabled:opacity-50"
              />
            </form>
          </div>

        </div>
      </section>

      {/* 4. About Us Section (RTL Bento Grid System) */}
      <section id="about" className="py-20 lg:py-24 scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center" id="about-grid">
          
          {/* Box B: Story and Feature Grids as Nested Bento Blocks (Spans 12 Columns since Doctor Photo is removed) */}
          <div className="lg:col-span-12 space-y-6 text-right" id="about-text-col">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100" id="about-badge">
              <span>تعهد، دقت و فناوری</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" id="about-title">چرا کلینیک دندانپزشکی DentFlow متفاوت است؟</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold" id="about-desc">
              هدف ما در دنت فلو برطرف کردن ترس‌ها و دغدغه‌های همیشگی شما از دندانپزشکی است. ما معتقدیم کیفیت و دقت در درمان حق بیمار است و با گردهم‌آوری بهترین متخصصان، به کارگیری فناوری سه‌بعدی دیجیتال و دکوراسیون پزشکی آرامش‌بخش، فضایی رویایی برای درمان به وجود آورده‌ایم.
            </p>

            {/* Feature Bento grid - 4 mini columns on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2" id="about-features">
              
              <div className="flex gap-3 bg-white border border-white p-5 rounded-[22px] shadow-md shadow-teal-950/5 hover:scale-[1.01] transition-transform" id="about-feat-1">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0" id="about-feat-icon-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">۱۰۰٪ استریل و ایمن</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">بکارگیری اتاق اتوکلاو کلاس B و پایش مستمر میکروبیولوژیک محیط.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-white border border-white p-5 rounded-[22px] shadow-md shadow-teal-950/5 hover:scale-[1.01] transition-transform" id="about-feat-2">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0" id="about-feat-icon-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">متریال سوئیسی و آلمانی</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">استفاده اختصاصی از بهترین مارک‌های کامپوزیت و ایمپلنت ثبت شده جهانی.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-white border border-white p-5 rounded-[22px] shadow-md shadow-teal-950/5 hover:scale-[1.01] transition-transform" id="about-feat-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0" id="about-feat-icon-3">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">تجهیزات دیجیتال بدون درد</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">اسکنرهای درون‌دهانی سه‌بعدی و بی‌حسی الکترونیکی دیجیتال پیشرفته.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-white border border-white p-5 rounded-[22px] shadow-md shadow-teal-950/5 hover:scale-[1.01] transition-transform" id="about-feat-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0" id="about-feat-icon-4">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">تسهیلات اقساط بدون سود</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">طرح‌های درمان چندمرحله‌ای اقساطی همراه با چک صیادی برای راحتی شما.</p>
                </div>
              </div>

            </div>

            {/* Certification logos inside about block */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 justify-between" id="about-certifications">
              <div className="text-right" id="cert-text">
                <p className="text-xs font-bold text-slate-500">مورد تایید مراجع علمی تخصصی کشور</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-bold">پروانه بهره‌برداری وزارت بهداشت درمان و آموزش پزشکی کشور</p>
              </div>
              <div className="flex gap-3 items-center opacity-75" id="cert-icons">
                <span className="text-[10px] font-black tracking-widest text-slate-600 bg-white/80 border border-slate-200/50 px-2.5 py-1 rounded-md">ISO 9001</span>
                <span className="text-[10px] font-black tracking-widest text-slate-600 bg-white/80 border border-slate-200/50 px-2.5 py-1 rounded-md">SWISS DOCS</span>
                <span className="text-[10px] font-black tracking-widest text-slate-600 bg-white/80 border border-slate-200/50 px-2.5 py-1 rounded-md">FDA APPR</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Before/After Interactive Smile Gallery (Modern Dual-Card Bento Layout) */}
      <section id="gallery" className="py-20 lg:py-24 scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="gallery-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-100" id="gallery-badge">
            <span>دیدن قبل و بعد تفاوت را آشکار می‌کند</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" id="gallery-title">معجزه طراحی لبخند در کلینیک دنت فلو</h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold" id="gallery-desc">
            با موس یا لمس دست، اسلایدر وسط تصویر زیر را به چپ و راست حرکت دهید تا تفاوت فوق‌العاده کیفیت کار قبل و بعد از درمان بیماران ما را به وضوح مقایسه کنید.
          </p>
        </div>

        {/* Clinical category selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10" id="gallery-filters">
          {smileCases.map((smileCase) => (
            <button
              key={smileCase.id}
              id={`btn-case-${smileCase.id}`}
              onClick={() => {
                setSelectedCase(smileCase);
                setSliderPosition(50);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                selectedCase.id === smileCase.id 
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/15" 
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-slate-200"
              }`}
            >
              {smileCase.title.split(" با ")[1] || smileCase.title}
            </button>
          ))}
        </div>

        {/* Master Double Bento Grid for Gallery Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="gallery-showcase">
          
          {/* Card A: Interactive comparison image frame (Spans 8 Columns) */}
          <div 
            className="lg:col-span-8 bg-white border border-white p-4 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-center min-h-[350px]"
            id="slider-col"
          >
            <div 
              ref={sliderRef}
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg select-none cursor-ew-resize border border-slate-100"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              id="interactive-slider-frame"
            >
              {/* AFTER image (Full background) */}
              <img 
                src={selectedCase.afterUrl} 
                alt="بعد از درمان دندانپزشکی" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                id="img-after"
              />
              
              {/* Visual Label After */}
              <div className="absolute bottom-4 left-4 z-20 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm" id="badge-after">بعد از درمان</div>

              {/* BEFORE image (Left clipping side) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                id="img-before-wrapper"
              >
                <img 
                  src={selectedCase.beforeUrl} 
                  alt="قبل از درمان دندانپزشکی" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ width: sliderRef.current?.getBoundingClientRect().width }}
                  id="img-before"
                />
              </div>

              {/* Visual Label Before */}
              <div className="absolute bottom-4 right-4 z-20 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm" id="badge-before">قبل از درمان</div>

              {/* Drag Handle Bar */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-30"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                id="drag-bar"
              >
                {/* Circular Button center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-teal-600 hover:text-teal-700 transition-colors" id="drag-handle-circle">
                  <Sliders className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Case details and reservation bridge (Spans 4 Columns) */}
          <div 
            className="lg:col-span-4 bg-white/80 backdrop-blur-md border border-white/60 p-8 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between text-right"
            id="case-details-col"
          >
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100" id="case-category">
                دسته: {selectedCase.category === "laminate" ? "لمینت سرامیکی" : selectedCase.category === "composite" ? "ونیر کامپوزیت" : selectedCase.category === "ortho" ? "ارتودنسی دیجیتال" : "بلیچینگ مطبی"}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900" id="case-title">{selectedCase.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold" id="case-desc">{selectedCase.description}</p>
              
              <div className="pt-4 border-t border-slate-100 space-y-3" id="case-features">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-bold" id="case-feat-1">
                  <Check className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>تضمین ثبات رنگ کامل بدون تغییر</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-bold" id="case-feat-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>طراحی بر اساس زوایای طلایی فک و چهره</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-bold" id="case-feat-3">
                  <Check className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>قابلیت لمس طبیعی و تمیزپذیری آسان</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100" id="case-action">
              <a 
                id="btn-case-booking"
                href="#booking" 
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-teal-600 hover:text-teal-700"
              >
                مشاوره تخصصی و رزرو نوبت مشابه
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* 6. Patients Testimonials & FAQ Accordions as Integrated Bento Section */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="testimonials-faq-bento">
          
          {/* Card A: Testimonial slider bento (Spans 5 Columns) */}
          <div 
            className="lg:col-span-5 bg-white border border-white/80 p-8 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between relative overflow-hidden"
            id="testimonials-carousel-box"
          >
            {/* Background watermarked quote icon */}
            <div className="absolute top-6 left-6 text-teal-50/70 pointer-events-none scale-[3]" id="quote-bg-icon">
              <Smile className="w-16 h-16 opacity-35" />
            </div>

            <div className="space-y-4 text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">تجربه رضایت واقعی بیماران</span>
              <h3 className="text-xl font-extrabold text-slate-900">سخنان و دیدگاه‌های بیماران</h3>
            </div>

            <div className="relative text-right space-y-6 my-6" id="testimonial-slide">
              {/* Star ratings */}
              <div className="flex items-center gap-1 text-amber-400" id="testimonial-stars">
                {[...Array(testimonialsData[currentTestimonialIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Comment text */}
              <blockquote className="text-slate-700 text-sm sm:text-base font-bold leading-relaxed italic" id="testimonial-comment">
                « {testimonialsData[currentTestimonialIdx].comment} »
              </blockquote>

              {/* Patient Info Row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100" id="testimonial-patient-row">
                <div className="flex items-center gap-3" id="patient-identity">
                  <img 
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shrink-0" 
                    src={testimonialsData[currentTestimonialIdx].avatarUrl} 
                    alt={testimonialsData[currentTestimonialIdx].name} 
                    id="patient-avatar"
                  />
                  <div className="text-right" id="patient-text">
                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm" id="patient-name">{testimonialsData[currentTestimonialIdx].name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5" id="patient-treatment">درمان: {testimonialsData[currentTestimonialIdx].treatment}</p>
                  </div>
                </div>

                {/* Navigation selectors */}
                <div className="flex items-center gap-1.5" id="carousel-controls">
                  <button 
                    id="btn-prev-testimonial"
                    onClick={() => setCurrentTestimonialIdx((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)}
                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-950 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="قبلی"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    id="btn-next-testimonial"
                    onClick={() => setCurrentTestimonialIdx((prev) => (prev + 1) % testimonialsData.length)}
                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-950 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="بعدی"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3" id="testimonials-seal">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>پخش طبق اجازه‌نامه کتبی مراجعین</span>
            </div>
          </div>

          {/* Card B: FAQ Accordions bento (Spans 7 Columns) */}
          <div 
            className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-white/60 p-8 rounded-[32px] shadow-xl shadow-teal-950/5 flex flex-col justify-between"
            id="faq-bento"
          >
            <div className="text-right space-y-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">پاسخ سوالات شما اینجاست</span>
              <h3 className="text-xl font-extrabold text-slate-900">سوالات متداول مراجعین محترم</h3>
            </div>

            {/* Accordion List inside the bento */}
            <div className="space-y-3" id="faq-accordions-wrapper">
              {faqData.slice(0, 4).map((faq) => (
                <div 
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="bg-white/85 border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-right font-bold text-slate-800 hover:text-teal-600 gap-4 transition-colors"
                  >
                    <span className="text-xs sm:text-sm">{faq.question}</span>
                    <div className={`w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform ${openFaqId === faq.id ? "rotate-180 bg-teal-50 text-teal-600" : ""}`} id={`faq-arrow-wrapper-${faq.id}`}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {openFaqId === faq.id && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50 font-medium" id={`faq-answer-${faq.id}`}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Quick Online Consultation banner inside Bento */}
            <div className="mt-5 bg-teal-50/50 rounded-2xl p-4 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4" id="faq-footer-help">
              <div className="flex items-center gap-3 text-right" id="faq-help-text-wrapper">
                <Info className="w-5 h-5 text-teal-600 shrink-0" />
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                  آیا هنوز سوالی دارید؟ مشاوران ما در واتس‌اپ آماده راهنمایی هستند.
                </p>
              </div>
              <a 
                id="btn-faq-whatsapp"
                href="https://wa.me/989123456789" 
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs shadow-md transition-colors"
              >
                واتس‌اپ دنت فلو
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* 7. Articles section (Styled Asymmetrical Bento columns) */}
      <section id="articles" className="py-20 lg:py-24 scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4 text-right" id="articles-header">
          <div className="space-y-4 max-w-2xl" id="articles-header-text">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-100">بخش آموزش و سلامت دندان</span>
            <h2 className="text-3xl font-extrabold text-slate-900">جدیدترین مقالات و راهنماهای بهداشت دهان</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-semibold">
              دانش بیشتر، کلید پیشگیری از بیماری‌ها است. مقالات نگارش شده توسط دندانپزشکان متخصص ما را مطالعه کنید.
            </p>
          </div>
          <a 
            id="btn-view-all-articles"
            href="#booking" 
            className="text-teal-600 font-extrabold hover:underline text-sm shrink-0 flex items-center gap-1.5"
          >
            همه مقالات کلینیک
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="articles-grid">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              id={`article-card-${post.id}`}
              className="group bg-white border border-white/60 rounded-[28px] overflow-hidden hover:scale-[1.01] hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-200/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div id={`article-body-wrapper-${post.id}`}>
                {/* Article Banner image */}
                <div className="aspect-video w-full overflow-hidden relative" id={`article-image-frame-${post.id}`}>
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={post.imageUrl} 
                    alt={post.title} 
                  />
                  <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm border border-slate-100" id={`article-badge-${post.id}`}>
                    {post.category}
                  </span>
                </div>

                {/* Content details */}
                <div className="p-6 text-right space-y-3" id={`article-info-${post.id}`}>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold" id={`article-meta-${post.id}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2" id={`article-title-${post.id}`}>
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 font-semibold" id={`article-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 text-right" id={`article-footer-${post.id}`}>
                <span className="text-teal-600 font-extrabold text-xs flex items-center gap-1" id={`article-more-btn-${post.id}`}>
                  ادامه مطلب و مطالعه راهنما
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </section>

      {/* 8. Online Booking Form & Contact Us Section (Dual-Card Bento Matrix) */}
      <section id="booking" className="py-20 lg:py-24 scroll-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="booking-grid">
          
          {/* Card A: Grand Appointment Form Block (Spans 7 Columns) */}
          <div 
            className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-12 border border-white shadow-xl shadow-teal-950/5 text-right flex flex-col justify-between"
            id="booking-form-col"
          >
            <div>
              {/* Elegant Tab Headers */}
              <div className="flex border-b border-slate-100 mb-8 gap-6 justify-start" id="booking-tabs">
                <button
                  type="button"
                  id="tab-btn-new"
                  onClick={() => setBookingTab("new")}
                  className={`pb-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer flex items-center gap-1.5 ${
                    bookingTab === "new" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ثبت نوبت جدید</span>
                  {bookingTab === "new" && (
                    <motion.div layoutId="booking-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                  )}
                </button>
                <button
                  type="button"
                  id="tab-btn-track"
                  onClick={() => setBookingTab("track")}
                  className={`pb-3 text-xs sm:text-sm font-black transition-all relative cursor-pointer flex items-center gap-1.5 ${
                    bookingTab === "track" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>رهگیری نوبت قبلی</span>
                  {bookingTab === "track" && (
                    <motion.div layoutId="booking-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                  )}
                </button>
              </div>

              {bookingTab === "new" && (
                <>
                  <div className="space-y-2 mb-8" id="form-header">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">نوبت دهی سریع</span>
                    <h3 className="text-2xl font-extrabold text-slate-900" id="form-title">سامانه هوشمند رزرو نوبت آنلاین</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold" id="form-desc">
                      مشاوره اولیه و معاینه کلی تماماً رایگان می‌باشد. اطلاعات خود را ثبت کنید؛ کادر پذیرش تا حداکثر ۲ ساعت کاری جهت قطعی کردن نوبت با شما تماس خواهند گرفت.
                    </p>
                  </div>

                  {!isSubmitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-5" id="appointment-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="form-row-1">
                        {/* Patient Name Input */}
                        <div className="space-y-1.5" id="form-group-name">
                          <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-slate-700">نام و نام خانوادگی بیمار</label>
                          <div className="relative" id="name-input-wrapper">
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              placeholder="مثال: مریم محمدی"
                              value={formData.fullName}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#F8FCFC] border ${formErrors.fullName ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500"} text-slate-800 text-sm focus:outline-none focus:ring-2`}
                            />
                            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          </div>
                          {formErrors.fullName && <p className="text-[11px] text-rose-500 font-semibold" id="err-name">{formErrors.fullName}</p>}
                        </div>

                        {/* Contact Phone */}
                        <div className="space-y-1.5" id="form-group-phone">
                          <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-slate-700">شماره موبایل جهت هماهنگی</label>
                          <div className="relative" id="phone-input-wrapper">
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              placeholder="مثال: 09123456789"
                              value={formData.phone}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#F8FCFC] border ${formErrors.phone ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500"} text-slate-800 text-sm focus:outline-none focus:ring-2`}
                            />
                            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          </div>
                          {formErrors.phone && <p className="text-[11px] text-rose-500 font-semibold" id="err-phone">{formErrors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="form-row-2">
                        {/* Select treatment dropdown */}
                        <div className="space-y-1.5" id="form-group-service">
                          <label htmlFor="serviceId" className="block text-xs sm:text-sm font-bold text-slate-700">نوع خدمت درخواستی</label>
                          <div className="relative" id="service-select-wrapper">
                            <select
                              id="serviceId"
                              name="serviceId"
                              value={formData.serviceId}
                              onChange={handleFormChange}
                              className="w-full px-4 py-3 rounded-xl bg-[#F8FCFC] border border-slate-200 focus:border-teal-500 focus:ring-teal-500 text-slate-800 text-sm focus:outline-none focus:ring-2"
                            >
                              {services.map((s) => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Preferred Date Selector */}
                        <div className="space-y-1.5" id="form-group-date">
                          <label htmlFor="date" className="block text-xs sm:text-sm font-bold text-slate-700">تاریخ حدودی مد نظر</label>
                          <div className="relative" id="date-input-wrapper">
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#F8FCFC] border ${formErrors.date ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500"} text-slate-800 text-sm focus:outline-none focus:ring-2`}
                            />
                          </div>
                          {formErrors.date && <p className="text-[11px] text-rose-500 font-semibold" id="err-date">{formErrors.date}</p>}
                        </div>
                      </div>

                      {/* Time slot toggle */}
                      <div className="space-y-2" id="form-group-timeSlot">
                        <span className="block text-xs sm:text-sm font-bold text-slate-700">بازه زمانی مناسب شما</span>
                        <div className="grid grid-cols-2 gap-3" id="time-slot-radios">
                          <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-xs sm:text-sm font-bold transition-all ${formData.timeSlot === "morning" ? "bg-teal-50 border-teal-300 text-teal-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`} id="label-time-morning">
                            <input 
                              type="radio" 
                              name="timeSlot" 
                              value="morning" 
                              checked={formData.timeSlot === "morning"}
                              onChange={() => setFormData(prev => ({ ...prev, timeSlot: "morning" }))}
                              className="hidden"
                            />
                            <span>شیفت صبح (۱۰ الی ۱۴)</span>
                          </label>
                          <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-xs sm:text-sm font-bold transition-all ${formData.timeSlot === "afternoon" ? "bg-teal-50 border-teal-300 text-teal-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`} id="label-time-afternoon">
                            <input 
                              type="radio" 
                              name="timeSlot" 
                              value="afternoon" 
                              checked={formData.timeSlot === "afternoon"}
                              onChange={() => setFormData(prev => ({ ...prev, timeSlot: "afternoon" }))}
                              className="hidden"
                            />
                            <span>شیفت عصر (۱۴ الی ۲۰)</span>
                          </label>
                        </div>
                      </div>

                      {/* Booking notes */}
                      <div className="space-y-1.5" id="form-group-notes">
                        <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-slate-700">توضیحات یا سوابق خاص پزشکی (اختیاری)</label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={2}
                          placeholder="اگر باردار هستید، حساسیت دارویی دارید یا سابقه بیماری خاص دارید لطفاً قید فرمایید."
                          value={formData.notes}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#F8FCFC] border border-slate-200 focus:border-teal-500 focus:ring-teal-500 text-slate-800 text-sm focus:outline-none focus:ring-2 resize-none"
                        />
                      </div>

                      {/* Submission button with loading effect */}
                      <button
                        type="submit"
                        id="btn-submit-booking"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-l from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-extrabold text-base shadow-md shadow-teal-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" id="submit-loader"></div>
                            <span>در حال ارسال اطلاعات...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 text-white" />
                            <span>ثبت و ارسال درخواست رزرو نوبت</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px]" id="secure-badge">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>حریم خصوصی شما ایمن است. اطلاعات صرفاً برای هماهنگی پذیرش پزشک استفاده می‌شود.</span>
                      </div>
                    </form>
                  ) : (
                    /* Beautiful Booking Success Receipt state */
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#F8FCFC] border border-teal-200 rounded-3xl p-6 sm:p-8 text-center space-y-6"
                      id="booking-success-receipt"
                    >
                      <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner" id="receipt-success-icon">
                        <Check className="w-8 h-8 stroke-[3px]" />
                      </div>

                      <div className="space-y-2" id="receipt-header">
                        <h4 className="text-xl font-extrabold text-teal-600">درخواست رزرو نوبت با موفقیت ثبت شد!</h4>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                          همکاران ما در بخش پذیرش کلینیک دنت فلو در سریع‌ترین زمان ممکن جهت تایید نهایی نوبت با شما تماس خواهند گرفت.
                        </p>
                      </div>

                      {/* Summary ticket */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-100 text-right space-y-3.5" id="receipt-ticket">
                        <div className="flex justify-between items-center text-xs" id="ticket-ref">
                          <span className="text-slate-400 font-bold">کد رهگیری نوبت:</span>
                          <span className="font-mono font-bold text-slate-800 bg-slate-200/50 px-2.5 py-1 rounded-md">{bookingRef}</span>
                        </div>

                        <div className="border-t border-dashed border-slate-200 my-2" />

                        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-semibold" id="ticket-details">
                          <div id="ticket-detail-name">
                            <span className="text-slate-400 block font-bold">بیمار:</span>
                            <span className="text-slate-800 font-extrabold mt-1 block">{formData.fullName}</span>
                          </div>
                          <div id="ticket-detail-phone">
                            <span className="text-slate-400 block font-bold">شماره تماس:</span>
                            <span className="text-slate-800 font-bold mt-1 block">{formData.phone}</span>
                          </div>
                          <div id="ticket-detail-service">
                            <span className="text-slate-400 block font-bold">خدمت انتخابی:</span>
                            <span className="text-slate-800 font-bold mt-1 block">
                              {services.find(s => s.id === formData.serviceId)?.title || "ایمپلنت دندان"}
                            </span>
                          </div>
                          <div id="ticket-detail-date">
                            <span className="text-slate-400 block font-bold">تاریخ حدودی:</span>
                            <span className="text-slate-800 font-bold mt-1 block">{formData.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2" id="receipt-actions">
                        <button 
                          id="btn-receipt-track"
                          onClick={async () => {
                            setTrackCode(bookingRef);
                            setBookingTab("track");
                            setIsSubmitted(false);
                            // Auto-trigger search for this code
                            setIsTrackingLoading(true);
                            setTrackError("");
                            setTrackedBooking(null);
                            try {
                              const res = await fetch(`/api/bookings/track/${encodeURIComponent(bookingRef)}`);
                              const data = await res.json();
                              if (res.ok) {
                                setTrackedBooking(data);
                              } else {
                                setTrackError(data.error || "نوبتی با این کد رهگیری یافت نشد.");
                              }
                            } catch (err) {
                              console.error("Error tracking booking:", err);
                              setTrackError("خطایی رخ داد.");
                            } finally {
                              setIsTrackingLoading(false);
                            }
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10"
                        >
                          <Search className="w-4 h-4" />
                          <span>رهگیری و مشاهده وضعیت نوبت</span>
                        </button>
                        <button 
                          id="btn-receipt-reset"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              fullName: "",
                              phone: "",
                              serviceId: "implant",
                              date: "",
                              timeSlot: "morning",
                              notes: ""
                            });
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                          درخواست نوبت جدید
                        </button>
                        <a 
                          id="btn-receipt-call"
                          href={`tel:${clinicConfig.phoneRaw}`} 
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-white" />
                          تماس با پذیرش
                        </a>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {bookingTab === "track" && (
                <div className="space-y-6 text-right" id="tracking-section">
                  <div className="space-y-2 mb-6" id="tracking-header">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">استعلام نوبت</span>
                    <h3 className="text-2xl font-extrabold text-slate-900" id="tracking-title">رهگیری هوشمند وضعیت نوبت</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold" id="tracking-desc">
                      جهت مشاهده وضعیت نوبت خود، تاریخ نهایی تایید شده، و پیام اختصاصی کلینیک دنت فلو، کد رهگیری دریافتی هنگام ثبت‌نام (مثال: <code className="font-mono bg-slate-100 px-1 rounded text-slate-600">DF-183029</code>) را در کادر زیر وارد نمایید.
                    </p>
                  </div>

                  <form onSubmit={handleBookingTrack} className="flex gap-3" id="tracking-input-form">
                    <div className="relative flex-1" id="track-input-wrapper">
                      <input
                        type="text"
                        value={trackCode}
                        onChange={(e) => {
                          setTrackCode(e.target.value);
                          setTrackError("");
                        }}
                        placeholder="کد رهگیری خود را وارد کنید (مانند DF-183029)"
                        className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-[#F8FCFC] border border-slate-200 text-sm font-extrabold text-left focus:outline-none focus:border-teal-500 uppercase font-mono"
                        dir="ltr"
                        required
                      />
                      <Search className="absolute right-3.5 top-4 w-5 h-5 text-slate-400" />
                    </div>
                    <button
                      type="submit"
                      disabled={isTrackingLoading}
                      className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isTrackingLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <span>بررسی وضعیت</span>
                      )}
                    </button>
                  </form>

                  {trackError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 text-rose-700 border border-rose-100 p-4 rounded-2xl flex items-start gap-2.5 text-xs font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p>{trackError}</p>
                    </motion.div>
                  )}

                  {trackedBooking ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#F8FCFC] border border-teal-100 rounded-3xl p-5 sm:p-6 space-y-5"
                      id="tracked-result-card"
                    >
                      <div className="flex justify-between items-center border-b border-teal-50/50 pb-4" id="tracked-card-header">
                        <span className="font-black text-teal-800 text-sm">اطلاعات نوبت مراجع</span>
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs">{trackedBooking.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-bold" id="tracked-card-grid">
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] sm:text-xs block">نام بیمار:</span>
                          <span className="text-slate-900 block">{trackedBooking.fullName}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] sm:text-xs block">خدمت درخواستی:</span>
                          <span className="text-slate-900 block">{getServiceTitle(trackedBooking.serviceId)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] sm:text-xs block">تاریخ نوبت:</span>
                          <span className="text-slate-900 block font-mono">{trackedBooking.date}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] sm:text-xs block">زمان/شیفت نوبت:</span>
                          <span className="text-slate-900 block">
                            {trackedBooking.timeSlot === "morning" ? "شیفت صبح (۱۰ الی ۱۴)" : "شیفت عصر (۱۴ الی ۲۰)"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-teal-50/50 pt-4 space-y-3.5" id="tracked-card-status-wrapper">
                        <div>
                          <span className="text-slate-400 text-xs block font-bold mb-1.5">وضعیت پذیرش نوبت:</span>
                          {trackedBooking.status === "pending" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span>در انتظار بررسی کادر درمان کلینیک</span>
                            </div>
                          )}
                          {trackedBooking.status === "approved" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black">
                              <span className="w-2 h-2 rounded-full bg-teal-500" />
                              <span>تایید نهایی شده و رزرو قطعی است</span>
                            </div>
                          )}
                          {trackedBooking.status === "cancelled" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span>لغو شده یا عدم مراجعه</span>
                            </div>
                          )}
                        </div>

                        {/* Clinic Admin custom response message */}
                        <div className="bg-white border border-teal-100/50 rounded-2xl p-4 space-y-2" id="tracked-card-comment">
                          <span className="text-teal-700 text-xs font-black block flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>توضیحات و پیام تایید مطب دنت فلو:</span>
                          </span>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                            {trackedBooking.adminComment 
                              ? trackedBooking.adminComment 
                              : "درخواست نوبت شما با موفقیت به سیستم ارسال شده است. پس از تایید کادر درمان، پیام تایید، ساعت دقیق حضور و توصیه‌های لازم پزشک در این قسمت نمایش داده خواهد شد."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200" id="empty-tracking">
                      <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-400">کد رهگیری خود را در کادر بالا وارد کرده و دکمه بررسی را بزنید.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card B: Contact Details & Interactive simulated Map (Spans 5 Columns) */}
          <div 
            className="lg:col-span-5 bg-white rounded-[32px] p-8 border border-white shadow-xl shadow-teal-950/5 flex flex-col justify-between"
            id="booking-contact-col"
          >
            <div className="space-y-6">
              <div className="space-y-3" id="contact-info-block">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">راه‌های ارتباطی با ما</span>
                <h3 className="text-2xl font-extrabold text-slate-900">اطلاعات تماس و آدرس</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                  ما همواره پذیرای حضور گرم شما مراجعین عزیز در محیط شیک و استریل دنت فلو هستیم.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-4" id="contact-items">
                
                <div className="flex gap-4 items-start" id="contact-item-address">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-sm border border-teal-100/30" id="address-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">آدرس فیزیکی کلینیک</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">{clinicConfig.address}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start" id="contact-item-phones">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-sm border border-teal-100/30" id="phones-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">تلفن‌های تماس مستقیم</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-black">{clinicConfig.phone}</p>
                    <p className="text-[10px] text-slate-400 font-bold">امکان ارسال پیام در تلگرام یا واتس‌اپ: {clinicConfig.telegram}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start" id="contact-item-hours">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-sm border border-teal-100/30" id="hours-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">ساعات کاری و پذیرش</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">{clinicConfig.workingHours}</p>
                    <p className="text-[10px] text-rose-500 font-bold">بخش اورژانس شبانه‌روزی (هماهنگی قبلی تلفنی)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Virtual Simulated Map Widget */}
            <div className="bg-[#F8FCFC] rounded-2xl p-5 border border-slate-100 relative overflow-hidden shadow-inner flex flex-col justify-between aspect-video mt-6" id="virtual-map-widget">
              <div className="absolute inset-0 bg-teal-500/5 pointer-events-none" />
              
              {/* Visual map graphics (stylized vector road grid) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20" id="map-roads-lines">
                <div className="w-full h-1 bg-teal-600 absolute rotate-12" />
                <div className="w-full h-1 bg-teal-600 absolute -rotate-45" />
                <div className="h-full w-1 bg-teal-600 absolute left-1/3" />
                <div className="h-full w-1 bg-teal-600 absolute right-1/4" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full" id="map-details">
                <div className="flex items-center gap-2" id="map-header">
                  <Map className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-600">موقعیت دنت فلو روی نقشه</span>
                </div>

                <div className="my-auto text-center animate-bounce-slow" id="map-pin">
                  <div className="relative inline-block" id="pin-bounce">
                    <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-rose-500/30 animate-ping" />
                    <div className="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-md relative z-10 mx-auto" />
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 mt-2">الهیه، خیابان فرشته</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-bold">ساختمان پزشکان مریم</p>
                </div>

                <div className="flex justify-between items-center bg-white/95 backdrop-blur-sm p-2 rounded-xl border border-slate-100" id="map-actions">
                  <div className="text-right" id="map-transit-hint">
                    <p className="text-[10px] font-black text-slate-800">نزدیک‌ترین مترو</p>
                    <p className="text-[9px] text-slate-500 font-bold">ایستگاه تجریش (۱۰ دقیقه تاکسی)</p>
                  </div>
                  <a 
                    id="btn-open-google-maps"
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold shadow-sm transition-colors"
                  >
                    مسیریابی در گوگل مپ
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>
        </>
      )}

      {/* 9. Footer (RTL) */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 text-right" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="footer-inner-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12" id="footer-grid">
            
            {/* Logo and Slogan Column (5 Columns) */}
            <div className="lg:col-span-5 space-y-4" id="footer-logo-col">
              <div className="flex items-center gap-2.5" id="footer-logo">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white" id="footer-logo-icon">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex flex-col text-right" id="footer-logo-text">
                  <span className="font-bold text-xl tracking-tight text-white">DentFlow</span>
                  <span className="text-[10px] text-teal-400 font-bold tracking-widest -mt-1">دندانپزشکی دیجیتال سوئیس</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold" id="footer-desc">
                کلینیک دندانپزشکی دیجیتال دنت فلو با هدف ارائه بالاترین سطح استانداردهای زیبایی و درمانی در محیطی لوکس و سرشار از آرامش در تهران (منطقه الهیه) دایر گردیده است. لبخند شما هویت و تخصص ماست.
              </p>

              {/* Social icons */}
              <div className="flex gap-3 pt-2" id="footer-social-wrapper">
                <a 
                  id="footer-social-instagram"
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="اینستاگرام دنت فلو"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  id="footer-social-whatsapp"
                  href="https://wa.me/989123456789" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-[#25D366] text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="واتس‌اپ دنت فلو"
                >
                  <PhoneCall className="w-5 h-5" />
                </a>
                <a 
                  id="footer-social-telegram"
                  href="https://telegram.org" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-[#0088cc] text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="تلگرام دنت فلو"
                >
                  <Send className="w-5 h-5 -rotate-45" />
                </a>
              </div>
            </div>

            {/* Quick Links Column (3 Columns) */}
            <div className="lg:col-span-3 space-y-4" id="footer-quicklinks-col">
              <h4 className="font-extrabold text-white text-sm" id="quicklinks-title">لینک‌های دسترسی سریع</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold" id="quicklinks-list">
                <li>
                  <a href="#home" className="hover:text-white hover:underline transition-colors" id="footer-link-home">صفحه نخست</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white hover:underline transition-colors" id="footer-link-services">خدمات و هزینه‌ها</a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white hover:underline transition-colors" id="footer-link-about">درباره کادر پزشکی</a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white hover:underline transition-colors" id="footer-link-gallery">نمونه‌کارها و قبل/بعد</a>
                </li>
                <li>
                  <a href="#articles" className="hover:text-white hover:underline transition-colors" id="footer-link-articles">مجله علمی آموزشی</a>
                </li>
                <li>
                  <a href="#booking" className="hover:text-white hover:underline transition-colors" id="footer-link-booking">رزرو آنلاین مشاوره</a>
                </li>
              </ul>
            </div>

            {/* Quick treatment shortcut (4 Columns) */}
            <div className="lg:col-span-4 space-y-4 font-bold text-xs sm:text-sm" id="footer-hours-col">
              <h4 className="font-extrabold text-white text-sm" id="hours-title">ساعات کاری و اطلاعات پذیرش</h4>
              <ul className="space-y-3" id="hours-list">
                <li className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-slate-500 font-bold">شنبه تا چهارشنبه:</span>
                  <span className="text-slate-300 font-mono font-bold">۱۰:۰۰ الی ۲۰:۰۰</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-slate-500 font-bold">پنجشنبه‌ها:</span>
                  <span className="text-slate-300 font-mono font-bold">۱۰:۰۰ الی ۱۷:۰۰</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-slate-500 font-bold">جمعه‌ها و ایام تعطیل:</span>
                  <span className="text-rose-400 font-bold">فقط اورژانس هماهنگ شده</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">پاسخگویی تلفنی:</span>
                  <span className="text-teal-400 font-bold">۰۸:۰۰ صبح الی ۲۲:۰۰ شب</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Row */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 gap-4" id="footer-copyright">
            <p id="copyright-text">
              © کلیه حقوق مادی و معنوی این اثر متعلق به کلینیک دندانپزشکی DentFlow می‌باشد. طراحی و پیاده‌سازی مدرن دنت فلو.
            </p>
            <div className="flex gap-4" id="footer-copyright-links">
              <a href="#about" className="hover:text-slate-300 transition-colors" id="copyright-terms">قوانین و حریم خصوصی بیمار</a>
              <span>|</span>
              <a href="#faq" className="hover:text-slate-300 transition-colors" id="copyright-fags">سوالات متداول</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
