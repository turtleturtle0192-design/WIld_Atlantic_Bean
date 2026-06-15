import { MenuCategory, MenuItem, GalleryItem, TeamMember } from "./types";

export const menuCategories: MenuCategory[] = [
  {
    id: "drinks",
    title: "Coffee & Drinks",
    description: "Specialty beans roasted locally in County Donegal, prepared by passionate baristas using rich organic milk.",
    items: [
      { name: "Flat White", price: 4.20, description: "Double shot of rich espresso with silky steamed microfoam.", tags: ["Popular", "Specialty"], isFeatured: true },
      { name: "Cappuccino", price: 4.10, description: "Classic espresso with equal parts steamed milk and deep, luxurious foam." },
      { name: "Latte", price: 4.30, description: "Espresso with thick steamed milk and a thin layer of velvety microfoam." },
      { name: "Espresso", price: 3.20, description: "Concentrated double shot of our signature house blend with a golden crema.", tags: ["Vegan Friendly"] },
      { name: "Irish Coffee", price: 7.50, description: "Freshly brewed coffee with premium Donegal Irish whiskey, dark sugar, topped with chilled heavy cream.", tags: ["Donegal Special", "Contains Alcohol"], isFeatured: true },
      { name: "Chai Latte", price: 4.40, description: "Aromatic black tea spiced with cardamom, cinnamon, ginger, steamed with creamy milk." },
      { name: "Hot Chocolate", price: 4.50, description: "Decadent melted single-origin Belgian chocolate, steamed milk, topped with toasted marshmallows." },
      { name: "Iced Latte", price: 4.80, description: "Double espresso over ice, filled with cold fresh farm milk." }
    ]
  },
  {
    id: "breakfast",
    title: "Hearty Breakfast",
    description: "Fuel your day with our wholesome, fresh Irish breakfast choices, served daily until 12:00 PM.",
    items: [
      { name: "Full Irish Breakfast", price: 12.95, description: "Artisan Donegal pork sausages, thick-cut crispy back bacon, fried free-range egg, white & black pudding, grilled tomatoes & buttered field mushrooms. Served with warm house-made soda bread.", tags: ["Traditional", "Local Sourced"], isFeatured: true },
      { name: "Avocado Sourdough", price: 9.95, description: "Crushed sea-salted avocado, wild garlic oil, blistered cherry tomatoes on toasted homemade country sourdough.", tags: ["Vegetarian", "Healthy"] },
      { name: "Smoked Salmon Bagel", price: 11.50, description: "Donegal Bay oak-smoked salmon, rich herb cream cheese, pickled red onions, and capers on a toasted artisanal bagel.", tags: ["Donegal Bay Special"], isFeatured: true },
      { name: "Porridge with Honey & Berries", price: 7.50, description: "Warm organic rolled oats simmered in local farm milk, topped with rich wild honey and a mountain of fresh forest berries.", tags: ["Vegetarian", "Gluten-Free Option"] }
    ]
  },
  {
    id: "lunch",
    title: "Fresh Lunch & Sandwiches",
    description: "Hearty lunches made-to-order with premium artisan bread and fresh Donegal veggies, served from 12:00 PM onwards.",
    items: [
      { name: "Reuben Sandwich", price: 10.95, description: "House cured beef brisket, tangy sauerkraut, melted Swiss cheese, and russian dressing on thick-sliced dark marble rye, toasted on the flat-top.", tags: ["Customer Favourite"], isFeatured: true },
      { name: "Chicken Bacon Ciabatta", price: 11.50, description: "Tender herb-roasted chicken breast, crispy smoked bacon, rich mature cheddar, and fragrant house basil pesto in an oven-crisp Italian ciabatta." },
      { name: "Soup of the Day + Wheaten Bread", price: 7.50, description: "A soup cooked daily using field-fresh vegetables, served along with warm thick-sliced homemade wheaten bread and creamy salted country butter.", tags: ["Warm & Cozy", "Vegetarian Option"] },
      { name: "Falafel Wrap", price: 9.95, description: "House-made crisp herb falafels, crunchy cucumber, juicy pomegranate seeds, hummus, and creamy tahini dressing wrapped in a warm flatbread.", tags: ["Vegan", "Vegetarian"] }
    ]
  },
  {
    id: "desserts",
    title: "Sweet Treats & Bakery",
    description: "Every item is lovingly hand-rolled and baked fresh in our café kitchen every morning from 5:00 AM.",
    items: [
      { name: "Guinness Chocolate Brownie", price: 4.95, description: "Unbelievably dense and fudgy Belgian chocolate brownie infused with robust Guinness draught stout, styled with a light caramel swirl.", tags: ["Irresistible", "Irish Twist"] },
      { name: "Carrot Cake", price: 5.50, description: "Moist spiced brown-butter sponge with grated walnuts, layered with thick and silky lemon cream cheese frosting.", isFeatured: true },
      { name: "Fresh Scones", price: 4.75, description: "Warm, fluffy buttermilk scones served with thick clotted Irish cream and local estate strawberry jam.", tags: ["Baked Daily", "Traditional"], isFeatured: true },
      { name: "Apple Crumble", price: 6.50, description: "Tart local Bramley apples stewed with ground cinnamon, topped with a golden buttery oat crumble, served warm with velvety custard." }
    ]
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "/src/assets/images/hero_interior_1781517931951.jpg",
    alt: "Warm wooden accents, green hanging ivy, and cozy window seating under glowing lights at Wild Atlantic Bean",
    category: "interior"
  },
  {
    id: "g2",
    src: "/src/assets/images/coffee_cup_1781517947479.jpg",
    alt: "Barista specialty flat white coffee in a warm green ceramic mug with intricate latte art on cedar wood table",
    category: "drinks"
  },
  {
    id: "g3",
    src: "/src/assets/images/pastries_scones_1781517964661.jpg",
    alt: "Freshly-baked golden buttermilk scones served with rich clotted country cream and strawberry jam on slate tray",
    category: "food"
  },
  {
    id: "g4",
    src: "https://picsum.photos/seed/breakfast-irish/800/600",
    alt: "A thick-cut full Irish breakfast plate with sausages, poached eggs, and freshly baked soda bread",
    category: "food"
  },
  {
    id: "g5",
    src: "https://picsum.photos/seed/reuben/800/600",
    alt: "Gourmet grilled Reuben sandwich on rye showing warm molten cheese and slow-cured beef",
    category: "food"
  },
  {
    id: "g6",
    src: "https://picsum.photos/seed/iced-latte/800/600",
    alt: "A refreshing double shot iced latte with layered cold farm milk in a tall custom glass tumbler",
    category: "drinks"
  },
  {
    id: "g7",
    src: "https://picsum.photos/seed/exterior-letterkenny/800/600",
    alt: "The inviting wood and glass storefront of Wild Atlantic Bean on Letterkenny Main Street",
    category: "exterior"
  },
  {
    id: "g8",
    src: "https://picsum.photos/seed/cozy-corner/800/600",
    alt: "Comfortable leather armchairs in our sunlit corner, surrounded by thriving potted ferns and books",
    category: "interior"
  }
];

export const teamMembers: TeamMember[] = [
  {
    name: "Ciarán Doherty",
    role: "Founder & Master Roaster",
    bio: "Raised in Co. Donegal, Ciarán trained in Berlin's third-wave coffee scene before returning home to bring specialty-grade direct-trade coffee beans and traditional Irish roasting methods to Letterkenny.",
    image: "https://picsum.photos/seed/chef-ciaran/400/400"
  },
  {
    name: "Siobhán Kelly",
    role: "Head Pastry Chef & Baker",
    bio: "Siobhán wakes up at 4:30 AM every day to ensure Donegal gets the fluffiest buttermilk scones and rich Guinness brownies. She weaves her grandmother’s traditional recipes with modern gourmet twists.",
    image: "https://picsum.photos/seed/baker-siobhan/400/400"
  },
  {
    name: "Liam Mac Niocaill",
    role: "Head Barista & Latte Artist",
    bio: "Liam is obsessed with extraction ratios, milk temperature science, and friendly chats. He loves finding out a customer's perfect roast and custom pouring delicate designs to brighten their morning.",
    image: "https://picsum.photos/seed/barista-liam/400/400"
  }
];
