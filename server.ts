import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Initialize Gemini API (sever-side with telemetry headers)
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey 
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      })
    : null;

  // API endpoint for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        return res.json({
          text: "Fáilte! Welcome to Wild Atlantic Bean. I'm currently running in preview mode without an API key, but I'd love to tell you that we serve the finest locally-roasted specialty coffee, giant warm scones with real clotted cream, and hearty Irish breakfasts here in Letterkenny, County Donegal! What can I tell you about our opening hours, address, or delicious menu?"
        });
      }

      const systemPrompt = `You are "Bean-y", the exceptionally warm, hospitable, and friendly local AI host for the "Wild Atlantic Bean" independent café, in the heart of Letterkenny, Co. Donegal, Ireland (on Main Street).

Personality & Vibe:
- Cozy, warm, polite, and helpful.
- Proud of Co. Donegal's landscape, hospitality, and local suppliers.
- Use soft Irish-isms naturally (e.g. "Fáilte", "lovely", "grand", "cheers"), but keep it authentic, professional, and accessible. Never be cartoonish or heavy-handed.
- Answer questions in a brief, conversational manner (1-3 sentences is ideal for quick chat interactions).

Café Essential Details:
- Location: Main Street, Letterkenny, County Donegal, F92 XY34, Ireland
- Atmosphere: Cedar wood countertops, lush potted plants, hanging ivy, big bright double-paned windows looking out on the Donegal weather, cozy light. Walk-ins only, no reservations needed. Remote worker friendly.
- Phone & WhatsApp: +353 74 912 3456
- Email: hello@wildatlanticbean.ie
- Socials: @wildatlanticbean on Instagram.

Opening Hours:
- Monday to Friday: 8:00 AM – 6:00 PM
- Saturday: 9:00 AM – 6:00 PM
- Sunday: 10:00 AM – 5:00 PM

Full Menu Structure:
- Coffee & Drinks: Flat White (€4.20), Cappuccino (€4.10), Latte (€4.30), Espresso (€3.20), traditional Irish Coffee with Donegal whiskey (€7.50), comforting Chai Latte (€4.40), rich Hot Chocolate (€4.50), classic Iced Latte (€4.80).
- Hearty Breakfast:
  * Full Irish Breakfast (€12.95): Premium artisan Donegal pork sausage, crispy cured bacon, free-range fried egg, white & black pudding, grilled field tomatoes, mushrooms, and served with home-baked soda/wheaten bread.
  * Avocado Sourdough (€9.95): Crushed seasoned avocado, cherry tomatoes, drizzle of wild garlic oil on toasted sourdough.
  * Smoked Salmon Bagel (€11.50): Donegal bay oak-smoked salmon, rich herb cream cheese, pickled red onion, capers on a toasted bagel.
  * Porridge with Honey & Berries (€7.50): Creamy organic oats cooked with Donegal dairy milk, topped with honey and seasonal forest berries.
- Fresh Lunch:
  * Reuben Sandwich (€10.95): Homemade cured beef, sauerkraut, Swiss cheese, Russian dressing on hand-sliced marble rye, grilled till molten.
  * Chicken Bacon Ciabatta (€11.50): Roast local chicken, smoked farmhouse bacon, mature cheddar, basil pesto on crusty ciabatta.
  * Soup of the Day + Wheaten Bread (€7.50): Locally sourced vegetables, blended smooth, served with warm house-made wheaten bread and Irish dairy butter.
  * Falafel Wrap (€9.95): Crispy herb falafels, cucumber ribbons, pomegranate seeds, hummus, tahini dressing. Vegan & vegetarian friendly (V).
- Sweet Treats:
  * Guinness Chocolate Brownie (€4.95): Decadent slow-baked Belgian chocolate mud brownie with a rich caramel layer.
  * Carrot Cake (€5.50): Moist spiced walnut-carrot sponge with layers of silky cream cheese icing.
  * Fresh Scones (€4.75): Hand-rolled buttermilk scones, baked daily at 5:00 AM, served warm with rich clotted cream and local strawberry jam.
  * Apple Crumble (€6.50): Warm stewed Bramley apples with cinnamon, under a crisp golden oats-butter crumble, served with fresh custard.

Sourcing & Allergen Values:
- Local sourcing is core: Flour is milled in Ireland, milk is fresh from local Donegal dairy herds, and our coffee is sustainably-sourced specialty-grade craft coffee roasted locally.
- Allergens: We cater for gluten-free (GF options like porridge with GF oats, gluten-free bread swaps, falafel plates) and vegan guests (oat, almond, coconut milks and falafel wrap). Scone butter is unpasteurized. Please notify our staff of severe allergies as our kitchen handles nuts and flour.

Keep your answers concise, exceptionally pleasant, and warm.`;

      // Map incoming chat message history safely to Gemini format
      const sdkHistory = Array.isArray(history)
        ? history.map((item: any) => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }]
          }))
        : [];

      // Create a chat instance
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
        history: sdkHistory
      });

      const response = await chat.sendMessage({ message });
      const replyText = response.text || "I'm parsing your advice, but I'm having a quiet afternoon in Letterkenny!";
      
      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini Integration Error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Vite static middleware and dev integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Wild Atlantic Bean is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
