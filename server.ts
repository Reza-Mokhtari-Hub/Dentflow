import express from "express";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { createHash, randomUUID } from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

interface Booking {
  id: string;
  fullName: string;
  phone: string;
  serviceId: string;
  date: string;
  timeSlot: "morning" | "afternoon";
  notes?: string;
  status: "pending" | "approved" | "cancelled";
  createdAt: string;
  adminComment?: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

interface AdminCredentials {
  username: string;
  passwordHash: string;
}

interface ClinicDataState {
  bookings: Booking[];
  blogPosts: BlogPost[];
  patients: any[];
  transactions: any[];
  adminCredentials: AdminCredentials;
  clinicConfig: any;
  services: any[];
  aiConfig: { name: string; greeting: string; prompt: string };
}

const stateFilePath = path.join(process.cwd(), "data", "clinic-data.json");

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function normalizeAdminCredentials(raw: any): AdminCredentials {
  if (raw?.passwordHash) {
    return {
      username: raw.username || "admin",
      passwordHash: raw.passwordHash,
    };
  }

  if (raw?.password) {
    return {
      username: raw.username || "admin",
      passwordHash: hashPassword(raw.password),
    };
  }

  return {
    username: "admin",
    passwordHash: hashPassword("admin"),
  };
}

const defaultClinicState: ClinicDataState = {
  bookings: [
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
  ],
  blogPosts: [
    {
      id: 1,
      title: "مراقبت‌های حیاتی پس از کاشت ایمپلنت دندان که باید بدانید",
      excerpt: "کاشت ایمپلنت یک جراحی ظریف است. رعایت این ۵ نکته طلایی در هفته اول می‌تواند شانس موفقیت جوش خوردن پایه را تا ۹۹٪ تضمین کند.",
      category: "ایمپلنت",
      date: "۱۴ تیر ۱۴۰۵",
      readTime: "مطالعه ۵ دقیقه",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "تفاوت لمینت سرامیکی و کامپوزیت ونیر چیست؟ کدام مناسب شماست؟",
      excerpt: "بررسی کامل مقایسه قیمت، میزان تراش دندان، ثبات رنگ، طول عمر و تفاوت زیبایی لمینت‌های شیشه‌ای و کامپوزیت‌های سوئیسی.",
      category: "زیبایی",
      date: "۱۰ تیر ۱۴۰۵",
      readTime: "مطالعه ۷ دقیقه",
      imageUrl: "https://images.unsplash.com/photo-1512223792601-592a9809eed4?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "چگونه بوی بد دهان را یکبار برای همیشه درمان کنیم؟",
      excerpt: "بوی بد دهان همیشه به خاطر مسواک نزدن نیست! علل پنهان مانند بیماری‌های لثه، سنگ لوزه‌ها و مشکلات گوارشی را بشناسید و درمان کنید.",
      category: "سلامت دهان",
      date: "۰۵ تیر ۱۴۰۵",
      readTime: "مطالعه ۴ دقیقه",
      imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=600&auto=format&fit=crop"
    }
  ],
  patients: [],
  transactions: [],
  adminCredentials: {
    username: "admin",
    passwordHash: hashPassword("admin"),
  },
  clinicConfig: {
    phone: "۰۲۱-۲۲۰۰۰۰۰۰ | ۰۲۱-۲۲۰۰۰۰۰۱",
    phoneRaw: "02122000000",
    address: "تهران، الهیه، خیابان فرشته، ساختمان پزشکان مریم، طبقه سوم",
    telegram: "۰۹۱۲۳۴۵۶۷۸۹",
    workingHours: "شنبه تا چهارشنبه ۹:۰۰ الی ۲۱:۰۰ | پنجشنبه ۹:۰۰ الی ۱۵:۰۰",
    doctorName: "دکتر مختاری",
    doctorTitle: "جراح و دندانپزشک زیبایی - فلوشیپ ایمپلنتولوژی دیجیتال از سوئیس",
    aboutDesc: "هدف ما در دنت فلو برطرف کردن ترس‌ها و دغدغه‌های همیشگی شما از دندانپزشکی است. ما معتقدیم کیفیت و دقت در درمان حق بیمار است و با گردهم‌آوری بهترین متخصصان، به کارگیری فناوری سه‌بعدی دیجیتال و دکوراسیون پزشکی آرامش‌بخش، فضایی رویایی برای درمان به وجود آورده‌ایم.",
    installmentInfo: "۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره و سود"
  },
  services: [],
  aiConfig: {
    name: "دستیار هوشمند دنت فلو",
    greeting: "سلام! من دستیار هوشمند و تخصصی کلینیک دندانپزشکی دنت فلو هستم. هر سوالی درباره طرح درمان، هزینه‌ها، اقساط، ترس از دندانپزشکی یا خدمات ما دارید بپرسید؛ من با عشق راهنمایی‌تان می‌کنم! ✨",
    prompt: `شما دستیار تخصصی، دلسوز و فوق‌العاده باهوش کلینیک دندانپزشکی دیجیتال "دنت فلو" (DentFlow) هستید. نام شما "دستیار هوشمند دنت فلو" است.
وظایف شما:
۱. پاسخ به سوالات مراجعین و بیماران درباره مشکلات دندانی، بیماری‌های دهان، خدمات کلینیک، هزینه‌ها، و شرايط اقساطی به زبان فارسی شیوا، صمیمی، دلسوزانه و کاملاً محترمانه.
۲. معرفی خدمات مختلف کلینیک دنت فلو (ایمپلنت دیجیتال سوئیسی، لمینت سرامیکی E-max، ونیر کامپوزیت IPS، ارتودنسی نامرئی الاینر، عصب‌کشی روتاری بدون درد، اطفال و جراحی‌های لثه).
۳. دندانپزشک ارشد کلینیک "دکتر مختاری" (جراح و دندانپزشک زیبایی، دارای فلوشیپ ایمپلنتولوژی دیجیتال از سوئیس با بیش از ۱۰ سال سابقه و ثبت بیش از ۵۰۰۰ مورد ترمیم موفق لبخند) است.
۴. شماره تماس کلینیک: ۰۲۱-۲۲۰۰۰۰۰۰ است. آدرس کلینیک در شهر تهران (منطقه الهیه، خیابان فرشته) می‌باشد.
۵. شرایط پرداخت اقساطی بسیار منعطف است: ۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره و سود.
۶. برای بیماران با ترس و اضطراب شدید دندانپزشکی، توضیح دهید که ما مجهز به سیستم "سدیشن" (سودیشن یا خواب مصنوعی بسیار ایمن و آرام‌بخش با نظارت متخصص بیهوشی) هستیم تا درمان کاملاً بدون درد و بدون کوچکترین استرسی سپری شود.

به یاد داشته باشید شما سفیر برند دنت فلو هستید و آرامش دادن به بیمار اولویت اول شماست.`
  }
};

async function loadPersistedState(): Promise<ClinicDataState> {
  try {
    await mkdir(path.dirname(stateFilePath), { recursive: true });
    const raw = await readFile(stateFilePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<ClinicDataState>;

    return {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : defaultClinicState.bookings,
      blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : defaultClinicState.blogPosts,
      patients: Array.isArray(parsed.patients) ? parsed.patients : defaultClinicState.patients,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : defaultClinicState.transactions,
      adminCredentials: normalizeAdminCredentials(parsed.adminCredentials),
      clinicConfig: parsed.clinicConfig || defaultClinicState.clinicConfig,
      services: Array.isArray(parsed.services) ? parsed.services : defaultClinicState.services,
      aiConfig: parsed.aiConfig || defaultClinicState.aiConfig,
    };
  } catch {
    await mkdir(path.dirname(stateFilePath), { recursive: true });
    await writeFile(stateFilePath, JSON.stringify(defaultClinicState, null, 2), "utf8");
    return defaultClinicState;
  }
}

async function savePersistedState(state: ClinicDataState) {
  await mkdir(path.dirname(stateFilePath), { recursive: true });
  await writeFile(stateFilePath, JSON.stringify(state, null, 2), "utf8");
}

// Ensure the API key exists
const apiKey = process.env.GEMINI_API_KEY;

// Create shared Gemini client utility on the server.
// ALWAYS set the User-Agent header to 'aistudio-build' in httpOptions.
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const persistedState = await loadPersistedState();
  let bookings = persistedState.bookings;
  let blogPosts = persistedState.blogPosts;
  let patients = persistedState.patients;
  let transactions = persistedState.transactions;
  let adminCredentials = persistedState.adminCredentials;
  const adminSessions = new Map<string, { username: string; expiresAt: number }>();
  const adminSessionTtlMs = 1000 * 60 * 60 * 8;

  const createAdminSession = (username: string) => {
    const token = randomUUID();
    adminSessions.set(token, { username, expiresAt: Date.now() + adminSessionTtlMs });
    return token;
  };

  const authenticateAdmin = (req: any, res: any, next: any) => {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const session = adminSessions.get(token);

    if (!session || session.expiresAt < Date.now()) {
      adminSessions.delete(token);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.adminUsername = session.username;
    next();
  };
  let clinicConfig = persistedState.clinicConfig;
  let services = persistedState.services;
  let aiConfig = persistedState.aiConfig;

  const persistState = async () => {
    await savePersistedState({
      bookings,
      blogPosts,
      patients,
      transactions,
      adminCredentials,
      clinicConfig,
      services,
      aiConfig,
    });
  };

  app.get("/api/clinic-state", async (_req, res) => {
    res.json({ bookings, blogPosts, patients, transactions, adminCredentials: { username: adminCredentials.username }, clinicConfig, services, aiConfig });
  });

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "نام کاربری و کلمه عبور ضروری هستند." });
    }

    const isValid = username.trim().toLowerCase() === adminCredentials.username.trim().toLowerCase() && hashPassword(password) === adminCredentials.passwordHash;
    if (!isValid) {
      return res.status(401).json({ error: "نام کاربری یا کلمه عبور نادرست است." });
    }

    const token = createAdminSession(adminCredentials.username);
    return res.json({ ok: true, token, username: adminCredentials.username });
  });

  app.post("/api/admin/update-password", authenticateAdmin, async (req, res) => {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body || {};

    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      return res.status(400).json({ error: "اطلاعات وارد شده ناقص است." });
    }

    const isCurrentValid = currentUsername.trim().toLowerCase() === adminCredentials.username.trim().toLowerCase() && hashPassword(currentPassword) === adminCredentials.passwordHash;
    if (!isCurrentValid) {
      return res.status(401).json({ error: "کلمه عبور فعلی نادرست است." });
    }

    adminCredentials = {
      username: newUsername.trim(),
      passwordHash: hashPassword(newPassword),
    };
    await persistState();

    return res.json({ ok: true, username: adminCredentials.username });
  });

  app.post("/api/clinic-state", authenticateAdmin, async (req, res) => {
    const payload = req.body || {};

    if (Array.isArray(payload.bookings)) bookings = payload.bookings;
    if (Array.isArray(payload.blogPosts)) blogPosts = payload.blogPosts;
    if (Array.isArray(payload.patients)) patients = payload.patients;
    if (Array.isArray(payload.transactions)) transactions = payload.transactions;
    if (payload.adminCredentials) adminCredentials = payload.adminCredentials;
    if (payload.clinicConfig) clinicConfig = payload.clinicConfig;
    if (Array.isArray(payload.services)) services = payload.services;
    if (payload.aiConfig) aiConfig = payload.aiConfig;

    await persistState();
    res.json({ success: true, data: { bookings, blogPosts, patients, transactions, adminCredentials, clinicConfig, services, aiConfig } });
  });

  // API Route: Clinical AI Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, customSystemInstruction } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ 
          text: "⚠️ همکار گرامی، کلید API جمینای (GEMINI_API_KEY) در تنظیمات سرور تعریف نشده است. لطفاً از طریق منوی Settings > Secrets کلید خود را اضافه کنید تا دستیار هوشمند فعال شود." 
        });
      }

      // Prepare contents in Gemini format
      const contents = [];
      if (Array.isArray(history)) {
        for (const h of history) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }

      // Add the current user message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const systemInstruction = `شما دستیار تخصصی، دلسوز و فوق‌العاده باهوش کلینیک دندانپزشکی دیجیتال "دنت فلو" (DentFlow) هستید. نام شما "دستیار هوشمند دنت فلو" است.
وظایف شما:
۱. پاسخ به سوالات مراجعین و بیماران درباره مشکلات دندانی، بیماری‌های دهان، خدمات کلینیک، هزینه‌ها، و شرايط اقساطی به زبان فارسی شیوا، صمیمی، دلسوزانه و کاملاً محترمانه.
۲. معرفی خدمات مختلف کلینیک دنت فلو (ایمپلنت دیجیتال سوئیسی، لمینت سرامیکی E-max، ونیر کامپوزیت IPS، ارتودنسی نامرئی الاینر، عصب‌کشی روتاری بدون درد، اطفال و جراحی‌های لثه).
۳. دندانپزشک ارشد کلینیک "دکتر مختاری" (جراح و دندانپزشک زیبایی، دارای فلوشیپ ایمپلنتولوژی دیجیتال از سوئیس با بیش از ۱۰ سال سابقه و ثبت بیش از ۵۰۰۰ مورد ترمیم موفق لبخند) است.
۴. شماره تماس کلینیک: ۰۲۱-۲۲۰۰۰۰۰۰ است. آدرس کلینیک در شهر تهران (منطقه الهیه، خیابان فرشته) می‌باشد.
۵. شرایط پرداخت اقساطی بسیار منعطف است: ۳۰ الی ۴۰ درصد پیش‌پرداخت، مابقی در اقساط ۶ الی ۱۲ ماهه با چک صیادی بدون بهره و سود.
۶. برای بیماران با ترس و اضطراب شدید دندانپزشکی، توضیح دهید که ما مجهز به سیستم "سدیشن" (سودیشن یا خواب مصنوعی بسیار ایمن و آرام‌بخش با نظارت متخصص بیهوشی) هستیم تا درمان کاملاً بدون درد و بدون کوچکترین استرسی سپری شود.

قوانین مهم رفتار و پاسخ‌دهی شما:
- در ابتدای اولین پاسخ خود، یک سلام گرم و صمیمانه بکنید و خود را معرفی کنید.
- از به کار بردن کلمات انگلیسی یا اصطلاحات بسیار سخت پزشکی بدون توضیح ساده خودداری کنید. به زبان فارسی بنویسید.
- پاسخ‌های خود را با پاراگراف‌بندی مرتب و استفاده از شکلک‌های مناسب (مثل 🦷، ✨، 🌸، 📞) آراسته و خوانا کنید. از متن‌های طولانی و بدون فاصله بپرهیزید.
- همیشه بعد از ارائه راهنمایی علمی و دلسوزانه، با کمال احترام تاکید کنید که: "مشاوره آنلاین جنبه راهنمایی دارد و به هیچ وجه جایگزین معاینه حضوری و تخصصی توسط دکتر مختاری می‌شود."
- کاربر را ترغیب کنید که برای معاینه دقیق‌تر و رایگان، از فرم رزرو نوبت آنلاین موجود در همین صفحه استفاده کند تا کادر ما با او تماس بگیرند.

اطلاعات خدمات جهت پاسخ دقیق‌تر:
- ایمپلنت دندان: کاشت دندان دائمی با پیشرفته‌ترین تکنولوژی دیجیتال در یک جلسه (ایمپلنت فوری) با متریال سوئیسی و آمریکایی. شروع هزینه از ۹,۵۰۰,۰۰۰ تومان.
- اصلاح طرح لبخند / ونیر: طراحی دیجیتال لبخند هالیوودی با ونیر کامپوزیت‌های IPS سوئیسی یا لمینت‌های سرامیکی فوق‌نازک ضدخش E-Max آلمانی با ثبات رنگ فوق‌العاده. شروع هزینه کامپوزیت از ۲,۸۰۰,۰۰۰ تومان برای هر واحد.
- ارتودنسی نامرئی: الاینرهای شفاف متحرک کاملاً نامرئی که برای غذا خوردن و مسواک زدن خارج می‌شوند و دردی ایجاد نمی‌کنند. شروع هزینه از ۲۲,۰۰۰,۰۰۰ تومان.
- بلیچینگ: سفید کردن دندان با لیزر دایود مطب در کمتر از یک ساعت بدون هیچ حساسیت دندانی. شروع هزینه از ۳,۵۰۰,۰۰۰ تومان.
- دندانپزشکی اطفال: درمان در اتاق بازی مخصوص کودکان با تم کارتونی توسط متخصصان صبور و مهربان اطفال. شروع هزینه از ۱,۲۰۰,۰۰۰ تومان.
- عصب‌کشی (درمان ریشه): با دستگاه روتاری پیشرفته و اپکس لوکیتور دیجیتال، ۱۰۰٪ بدون درد در کوتاه‌ترین زمان. شروع هزینه از ۲,۵۰۰,۰۰۰ تومان.
- جراحی لثه و دندان عقل: جراحی دندان‌های عقل نهفته بدون آسیب و لیفت لثه با لیزر جهت زیبایی خط لبخند. شروع هزینه از ۱,۸۰۰,۰۰۰ تومان.

به یاد داشته باشید شما سفیر برند دنت فلو هستید و آرامش دادن به بیمار اولویت اول شماست.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: customSystemInstruction || systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({ error: error.message || "An error occurred during generating content." });
    }
  });

// Bookings data is loaded from the shared persisted state above.

  // API Route: Get all bookings
  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });

  // API Route: Create new booking
  app.post("/api/bookings", async (req, res) => {
    const { fullName, phone, serviceId, date, timeSlot, notes } = req.body;

    if (!fullName || !phone || !date) {
      return res.status(400).json({ error: "نام، شماره تلفن و تاریخ الزامی هستند." });
    }

    const newId = "DF-" + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: newId,
      fullName,
      phone,
      serviceId: serviceId || "implant",
      date,
      timeSlot: timeSlot || "morning",
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      adminComment: ""
    };

    bookings.unshift(newBooking); // Add to the top
    await persistState();
    res.status(201).json(newBooking);
  });

  // API Route: Track booking by ID
  app.get("/api/bookings/track/:id", (req, res) => {
    const { id } = req.params;
    const booking = bookings.find(b => b.id.toUpperCase() === id.trim().toUpperCase());
    if (!booking) {
      return res.status(404).json({ error: "نوبتی با این کد رهگیری یافت نشد." });
    }
    res.json(booking);
  });

  // API Route: Update booking status, notes, date, timeSlot, or adminComment
  app.put("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status, notes, adminComment, date, timeSlot } = req.body;

    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "نوبت پیدا نشد." });
    }

    if (status) {
      bookings[bookingIndex].status = status;
    }
    if (notes !== undefined) {
      bookings[bookingIndex].notes = notes;
    }
    if (adminComment !== undefined) {
      bookings[bookingIndex].adminComment = adminComment;
    }
    if (date) {
      bookings[bookingIndex].date = date;
    }
    if (timeSlot) {
      bookings[bookingIndex].timeSlot = timeSlot;
    }

    await persistState();
    res.json(bookings[bookingIndex]);
  });

  // API Route: Delete booking
  app.delete("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const initialLength = bookings.length;
    bookings = bookings.filter(b => b.id !== id);

    if (bookings.length === initialLength) {
      return res.status(404).json({ error: "نوبت پیدا نشد." });
    }

    await persistState();
    res.json({ success: true, message: "نوبت با موفقیت حذف شد." });
  });

  // Blog posts data is loaded from the shared persisted state above.

  // API Route: Get all articles
  app.get("/api/articles", (req, res) => {
    res.json(blogPosts);
  });

  // API Route: Create new article
  app.post("/api/articles", async (req, res) => {
    const { title, excerpt, category, date, readTime, imageUrl } = req.body;

    if (!title || !excerpt || !category) {
      return res.status(400).json({ error: "عنوان، خلاصه و دسته‌بندی مقاله الزامی هستند." });
    }

    const newId = blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1;
    const newArticle: BlogPost = {
      id: newId,
      title,
      excerpt,
      category,
      date: date || new Date().toLocaleDateString("fa-IR"),
      readTime: readTime || "مطالعه ۵ دقیقه",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop"
    };

    blogPosts.unshift(newArticle);
    await persistState();
    res.status(201).json(newArticle);
  });

  // API Route: Update article
  app.put("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, excerpt, category, date, readTime, imageUrl } = req.body;

    const index = blogPosts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "مقاله یافت نشد." });
    }

    blogPosts[index] = {
      ...blogPosts[index],
      title: title || blogPosts[index].title,
      excerpt: excerpt || blogPosts[index].excerpt,
      category: category || blogPosts[index].category,
      date: date || blogPosts[index].date,
      readTime: readTime || blogPosts[index].readTime,
      imageUrl: imageUrl || blogPosts[index].imageUrl,
    };

    await persistState();
    res.json(blogPosts[index]);
  });

  // API Route: Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = blogPosts.length;
    blogPosts = blogPosts.filter(p => p.id !== id);

    if (blogPosts.length === initialLength) {
      return res.status(404).json({ error: "مقاله یافت نشد." });
    }

    await persistState();
    res.json({ success: true, message: "مقاله با موفقیت حذف شد." });
  });

  // API Route: Generate article with Gemini
  app.post("/api/articles/generate", async (req, res) => {
    try {
      const { topic, category } = req.body;

      if (!topic || !category) {
        return res.status(400).json({ error: "موضوع و دسته‌بندی مقاله الزامی هستند." });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Return a mock generated article if API key is missing
        return res.json({
          title: `راهنمای جامع ${topic} در دندانپزشکی مدرن`,
          excerpt: `در این مقاله تخصصی به بررسی علمی و همه‌جانبه موضوع ${topic} پرداخته و بهترین روش‌ها و تکنیک‌های روز دنیا برای دسته‌بندی ${category} را با هم مرور می‌کنیم.`,
          category: category,
          readTime: "مطالعه ۵ دقیقه",
          imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop"
        });
      }

      const prompt = `یک مقاله علمی، کاملاً تخصصی، بسیار جذاب و مفید برای وبلاگ یک کلینیک دندانپزشکی پیشرفته با موضوع "${topic}" بنویس.
این مقاله متعلق به دسته‌بندی "${category}" است.
خروجی باید حتماً به صورت یک شیء JSON با ساختار زیر باشد و هیچ متنی به جز JSON در خروجی نباشد:
{
  "title": "یک عنوان جذاب، علمی و بسیار باکلاس به زبان فارسی",
  "excerpt": "یک خلاصه ترغیب‌کننده و جامع از مقاله شامل حداقل ۳ جمله کامل به زبان فارسی که کاربر را به خواندن کل مطلب تشویق کند",
  "category": "${category}",
  "readTime": "مدت زمان تقریبی مطالعه بر حسب دقیقه به فارسی، برای مثال: مطالعه ۶ دقیقه",
  "imageUrl": "یک آدرس تصویر بسیار باکیفیت و جذاب مرتبط با دندانپزشکی یا موضوع مقاله از Unsplash (مانند عکس‌های تجهیزات دندانپزشکی، لبخند، پزشک و غیره)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              category: { type: Type.STRING },
              readTime: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ["title", "excerpt", "category", "readTime", "imageUrl"]
          },
          temperature: 0.8
        }
      });

      const responseText = response.text || "";
      const generated = JSON.parse(responseText.trim());
      return res.json(generated);
    } catch (error: any) {
      console.error("Gemini Generate Article Error:", error);
      return res.status(500).json({ error: error.message || "خطا در تولید محتوای مقاله با هوش مصنوعی." });
    }
  });

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy." });
  });

  // Vite middleware for development / static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
