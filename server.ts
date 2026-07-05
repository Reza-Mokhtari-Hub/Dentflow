import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

  // In-memory persistent Bookings Database
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

  let bookings: Booking[] = [
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

  // API Route: Get all bookings
  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });

  // API Route: Create new booking
  app.post("/api/bookings", (req, res) => {
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
  app.put("/api/bookings/:id", (req, res) => {
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

    res.json(bookings[bookingIndex]);
  });

  // API Route: Delete booking
  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = bookings.length;
    bookings = bookings.filter(b => b.id !== id);

    if (bookings.length === initialLength) {
      return res.status(404).json({ error: "نوبت پیدا نشد." });
    }

    res.json({ success: true, message: "نوبت با موفقیت حذف شد." });
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
