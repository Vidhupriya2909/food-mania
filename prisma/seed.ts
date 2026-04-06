import { PrismaClient, DietaryType, SpiceLevel, MealType, SubscriptionType, CouponType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Food Mart database...\n");

  // ============================================
  // 1. App Settings
  // ============================================
  console.log("⚙️  Creating app settings...");
  await prisma.appSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      appName: "Food Mart",
      taxRatePercent: 5,
      freeDeliveryThreshold: 499,
      defaultDeliveryCharge: 49,
      referralRewardAmount: 100,
      referralRefereeBonus: 50,
      maxOtpAttempts: 3,
      otpExpiryMinutes: 5,
      giftCardValidityDays: 365,
      maintenanceMode: false,
    },
  });

  // ============================================
  // 2. Categories
  // ============================================
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "rice-biryani" },
      update: {},
      create: { name: "Rice & Biryani", slug: "rice-biryani", sortOrder: 1, image: "🍚" },
    }),
    prisma.category.upsert({
      where: { slug: "roti-paratha" },
      update: {},
      create: { name: "Roti & Paratha", slug: "roti-paratha", sortOrder: 2, image: "🫓" },
    }),
    prisma.category.upsert({
      where: { slug: "curries-gravies" },
      update: {},
      create: { name: "Curries & Gravies", slug: "curries-gravies", sortOrder: 3, image: "🍛" },
    }),
    prisma.category.upsert({
      where: { slug: "salads-bowls" },
      update: {},
      create: { name: "Salads & Bowls", slug: "salads-bowls", sortOrder: 4, image: "🥗" },
    }),
    prisma.category.upsert({
      where: { slug: "breakfast-specials" },
      update: {},
      create: { name: "Breakfast Specials", slug: "breakfast-specials", sortOrder: 5, image: "🍳" },
    }),
    prisma.category.upsert({
      where: { slug: "south-indian" },
      update: {},
      create: { name: "South Indian", slug: "south-indian", sortOrder: 6, image: "🫓" },
    }),
    prisma.category.upsert({
      where: { slug: "wraps-rolls" },
      update: {},
      create: { name: "Wraps & Rolls", slug: "wraps-rolls", sortOrder: 7, image: "🌯" },
    }),
    prisma.category.upsert({
      where: { slug: "thalis" },
      update: {},
      create: { name: "Thalis", slug: "thalis", sortOrder: 8, image: "🍲" },
    }),
    prisma.category.upsert({
      where: { slug: "desserts" },
      update: {},
      create: { name: "Desserts", slug: "desserts", sortOrder: 9, image: "🍮" },
    }),
    prisma.category.upsert({
      where: { slug: "beverages" },
      update: {},
      create: { name: "Beverages", slug: "beverages", sortOrder: 10, image: "🥤" },
    }),
  ]);

  // ============================================
  // 3. Menu Items
  // ============================================
  console.log("🍽️  Creating menu items...");

  const menuItems = [
    // Breakfast items
    {
      name: "Masala Dosa", slug: "masala-dosa",
      description: "Crispy golden dosa stuffed with spiced potato filling, served with sambar and coconut chutney. A classic South Indian breakfast favorite.",
      basePrice: 89, categoryId: categories[5].id,
      dietaryType: DietaryType.VEG, allergens: [], calories: 320, protein: 8, carbs: 52, fat: 10, fiber: 4,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 15, servingSize: "2 pieces", image: "🫓",
    },
    {
      name: "Poha", slug: "poha",
      description: "Light and fluffy flattened rice tempered with mustard seeds, curry leaves, peanuts, and fresh coriander. Topped with sev and lemon.",
      basePrice: 69, categoryId: categories[4].id,
      dietaryType: DietaryType.VEG, allergens: ["peanuts"], calories: 280, protein: 6, carbs: 48, fat: 8, fiber: 3,
      isGlutenFree: true, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 10, servingSize: "1 bowl", image: "🥘",
    },
    {
      name: "Egg Bhurji & Paratha", slug: "egg-bhurji-paratha",
      description: "Spiced scrambled eggs with onions, tomatoes, and green chilies. Served with two flaky whole wheat parathas and pickle.",
      basePrice: 99, categoryId: categories[4].id,
      dietaryType: DietaryType.EGGETARIAN, allergens: ["eggs", "gluten"], calories: 420, protein: 18, carbs: 38, fat: 22, fiber: 4,
      isGlutenFree: false, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 15, servingSize: "1 plate", image: "🍳",
    },
    {
      name: "Idli Sambar", slug: "idli-sambar",
      description: "Soft steamed rice cakes served with piping hot sambar and fresh coconut & tomato chutney. Light and nutritious.",
      basePrice: 79, categoryId: categories[5].id,
      dietaryType: DietaryType.VEG, allergens: [], calories: 250, protein: 7, carbs: 44, fat: 4, fiber: 3,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MILD,
      preparationTime: 10, servingSize: "4 pieces", image: "🫓",
    },
    {
      name: "Avocado Toast Bowl", slug: "avocado-toast-bowl",
      description: "Creamy avocado mash on multigrain toast with cherry tomatoes, microgreens, seeds, and a drizzle of olive oil.",
      basePrice: 149, categoryId: categories[4].id,
      dietaryType: DietaryType.VEGAN, allergens: ["gluten"], calories: 350, protein: 10, carbs: 32, fat: 22, fiber: 8,
      isGlutenFree: false, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 10, servingSize: "1 bowl", image: "🥑",
    },
    // Lunch/Dinner items
    {
      name: "Chicken Biryani", slug: "chicken-biryani",
      description: "Aromatic long-grain basmati rice layered with tender marinated chicken, saffron, and whole spices. Slow cooked in dum style. Served with raita.",
      basePrice: 179, categoryId: categories[0].id,
      dietaryType: DietaryType.NON_VEG, allergens: ["dairy"], calories: 580, protein: 28, carbs: 62, fat: 22, fiber: 3,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 30, servingSize: "1 plate", image: "🍗",
    },
    {
      name: "Paneer Butter Masala", slug: "paneer-butter-masala",
      description: "Soft paneer cubes in a rich, creamy tomato-cashew gravy with butter and aromatic spices. Restaurant-style indulgence.",
      basePrice: 149, categoryId: categories[2].id,
      dietaryType: DietaryType.VEG, allergens: ["dairy", "nuts"], calories: 420, protein: 16, carbs: 18, fat: 32, fiber: 3,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MILD,
      preparationTime: 25, servingSize: "250ml", image: "🍛",
    },
    {
      name: "Dal Makhani", slug: "dal-makhani",
      description: "Slow-cooked black lentils and kidney beans in a creamy buttery gravy. Simmered overnight for authentic Punjabi flavor.",
      basePrice: 129, categoryId: categories[2].id,
      dietaryType: DietaryType.VEG, allergens: ["dairy"], calories: 350, protein: 14, carbs: 38, fat: 16, fiber: 8,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MILD,
      preparationTime: 20, servingSize: "250ml", image: "🍲",
    },
    {
      name: "Chicken Tikka Wrap", slug: "chicken-tikka-wrap",
      description: "Tandoori chicken tikka pieces wrapped in a whole wheat roti with mint chutney, onions, and salad. Perfect grab-and-go meal.",
      basePrice: 139, categoryId: categories[6].id,
      dietaryType: DietaryType.NON_VEG, allergens: ["gluten", "dairy"], calories: 450, protein: 26, carbs: 36, fat: 20, fiber: 4,
      isGlutenFree: false, isJainFriendly: false, spiceLevel: SpiceLevel.HOT,
      preparationTime: 15, servingSize: "1 wrap", image: "🌯",
    },
    {
      name: "Paneer Tikka Wrap", slug: "paneer-tikka-wrap",
      description: "Grilled paneer tikka in a whole wheat wrap with mint chutney, crunchy onions, and fresh salad.",
      basePrice: 129, categoryId: categories[6].id,
      dietaryType: DietaryType.VEG, allergens: ["gluten", "dairy"], calories: 420, protein: 18, carbs: 38, fat: 22, fiber: 4,
      isGlutenFree: false, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 15, servingSize: "1 wrap", image: "🌯",
    },
    {
      name: "Veg Thali", slug: "veg-thali",
      description: "Complete meal with dal, seasonal sabzi, rice, 3 rotis, raita, salad, pickle, and a sweet treat. A balanced feast!",
      basePrice: 159, categoryId: categories[7].id,
      dietaryType: DietaryType.VEG, allergens: ["gluten", "dairy"], calories: 650, protein: 20, carbs: 82, fat: 24, fiber: 12,
      isGlutenFree: false, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 20, servingSize: "1 thali", image: "🍲",
    },
    {
      name: "Non-Veg Thali", slug: "non-veg-thali",
      description: "Hearty thali with chicken curry, dal, rice, 3 rotis, raita, salad, pickle, and dessert. Complete non-veg feast.",
      basePrice: 199, categoryId: categories[7].id,
      dietaryType: DietaryType.NON_VEG, allergens: ["gluten", "dairy"], calories: 780, protein: 32, carbs: 76, fat: 34, fiber: 8,
      isGlutenFree: false, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 25, servingSize: "1 thali", image: "🍲",
    },
    {
      name: "Buddha Bowl", slug: "buddha-bowl",
      description: "Quinoa base with roasted sweet potato, chickpeas, avocado, mixed greens, cherry tomatoes, and tahini dressing.",
      basePrice: 169, categoryId: categories[3].id,
      dietaryType: DietaryType.VEGAN, allergens: ["sesame"], calories: 380, protein: 14, carbs: 48, fat: 16, fiber: 12,
      isGlutenFree: true, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 15, servingSize: "1 bowl", image: "🥗",
    },
    {
      name: "Grilled Chicken Salad", slug: "grilled-chicken-salad",
      description: "Tender grilled chicken breast on a bed of mixed greens, cherry tomatoes, cucumber, corn, and honey mustard dressing.",
      basePrice: 179, categoryId: categories[3].id,
      dietaryType: DietaryType.NON_VEG, allergens: ["mustard"], calories: 320, protein: 32, carbs: 18, fat: 14, fiber: 6,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MILD,
      preparationTime: 15, servingSize: "1 bowl", image: "🥗",
    },
    {
      name: "Jeera Rice", slug: "jeera-rice",
      description: "Fragrant basmati rice tempered with cumin seeds, ghee, and whole spices. Perfect accompaniment to any curry.",
      basePrice: 79, categoryId: categories[0].id,
      dietaryType: DietaryType.VEG, allergens: ["dairy"], calories: 280, protein: 5, carbs: 52, fat: 6, fiber: 1,
      isGlutenFree: true, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 15, servingSize: "1 plate", image: "🍚",
    },
    {
      name: "Butter Naan", slug: "butter-naan",
      description: "Soft, fluffy naan bread brushed with melted butter. Baked fresh in our tandoor.",
      basePrice: 39, categoryId: categories[1].id,
      dietaryType: DietaryType.VEG, allergens: ["gluten", "dairy"], calories: 180, protein: 5, carbs: 28, fat: 6, fiber: 1,
      isGlutenFree: false, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 8, servingSize: "2 pieces", image: "🫓",
    },
    {
      name: "Gulab Jamun", slug: "gulab-jamun",
      description: "Soft, melt-in-your-mouth milk solids dumplings soaked in rose-cardamom flavored sugar syrup. The perfect sweet ending.",
      basePrice: 59, categoryId: categories[8].id,
      dietaryType: DietaryType.VEG, allergens: ["dairy", "gluten"], calories: 320, protein: 4, carbs: 52, fat: 12, fiber: 0,
      isGlutenFree: false, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 5, servingSize: "3 pieces", image: "🍮",
    },
    {
      name: "Mango Lassi", slug: "mango-lassi",
      description: "Creamy yogurt blended with fresh Alphonso mango pulp and a hint of cardamom. Refreshing and delicious.",
      basePrice: 69, categoryId: categories[9].id,
      dietaryType: DietaryType.VEG, allergens: ["dairy"], calories: 220, protein: 6, carbs: 38, fat: 4, fiber: 1,
      isGlutenFree: true, isJainFriendly: true, spiceLevel: SpiceLevel.MILD,
      preparationTime: 5, servingSize: "300ml", image: "🥤",
    },
    {
      name: "Rajma Chawal", slug: "rajma-chawal",
      description: "Hearty kidney bean curry in a thick spiced tomato gravy, served with steamed basmati rice. Pure comfort food.",
      basePrice: 119, categoryId: categories[0].id,
      dietaryType: DietaryType.VEG, allergens: [], calories: 450, protein: 16, carbs: 68, fat: 12, fiber: 14,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 20, servingSize: "1 plate", image: "🍛",
    },
    {
      name: "Fish Curry & Rice", slug: "fish-curry-rice",
      description: "Tender fish fillets in a tangy coconut curry sauce, served with steamed rice. Coastal comfort food at its best.",
      basePrice: 189, categoryId: categories[2].id,
      dietaryType: DietaryType.NON_VEG, allergens: ["fish", "coconut"], calories: 480, protein: 28, carbs: 52, fat: 18, fiber: 3,
      isGlutenFree: true, isJainFriendly: false, spiceLevel: SpiceLevel.HOT,
      preparationTime: 25, servingSize: "1 plate", image: "🐟",
    },
  ];

  const createdMenuItems = [];
  for (const item of menuItems) {
    const created = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
    createdMenuItems.push(created);
  }

  // ============================================
  // 4. Subscription Plans
  // ============================================
  console.log("📋 Creating subscription plans...");
  await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { id: "plan-daily" },
      update: {},
      create: {
        id: "plan-daily",
        name: "Daily Plan",
        type: SubscriptionType.DAILY,
        durationDays: 1,
        discountPercent: 0,
        description: "Try us out with no commitment. Perfect for first-timers who want to experience the Food Mart difference.",
        features: ["Pick any meal", "No commitment", "Cancel anytime", "Free delivery on ₹499+"],
        isPopular: false,
      },
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: "plan-weekly" },
      update: {},
      create: {
        id: "plan-weekly",
        name: "Weekly Saver",
        type: SubscriptionType.WEEKLY,
        durationDays: 7,
        discountPercent: 10,
        description: "Our most popular plan! Save 10% on all meals with a weekly subscription. Skip any day you want.",
        features: ["7 days of meals", "10% discount", "Free delivery", "Skip any day", "Priority support"],
        isPopular: true,
      },
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: "plan-monthly" },
      update: {},
      create: {
        id: "plan-monthly",
        name: "Monthly Value",
        type: SubscriptionType.MONTHLY,
        durationDays: 30,
        discountPercent: 20,
        description: "Best value for regular subscribers. Save 20% and enjoy premium perks including free desserts on Fridays!",
        features: ["30 days of meals", "20% discount", "Free delivery", "Skip any day", "Priority support", "Free dessert Fridays", "Exclusive menu access"],
        isPopular: false,
      },
    }),
  ]);

  // ============================================
  // 5. Delivery Slots
  // ============================================
  console.log("🚚 Creating delivery slots...");
  await Promise.all([
    prisma.deliverySlot.upsert({
      where: { id: "slot-bf-1" },
      update: {},
      create: { id: "slot-bf-1", mealType: MealType.BREAKFAST, startTime: "07:00", endTime: "08:00", label: "7:00 AM - 8:00 AM", sortOrder: 1 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-bf-2" },
      update: {},
      create: { id: "slot-bf-2", mealType: MealType.BREAKFAST, startTime: "08:00", endTime: "09:00", label: "8:00 AM - 9:00 AM", sortOrder: 2 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-bf-3" },
      update: {},
      create: { id: "slot-bf-3", mealType: MealType.BREAKFAST, startTime: "09:00", endTime: "10:00", label: "9:00 AM - 10:00 AM", sortOrder: 3 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-ln-1" },
      update: {},
      create: { id: "slot-ln-1", mealType: MealType.LUNCH, startTime: "12:00", endTime: "13:00", label: "12:00 PM - 1:00 PM", sortOrder: 1 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-ln-2" },
      update: {},
      create: { id: "slot-ln-2", mealType: MealType.LUNCH, startTime: "13:00", endTime: "14:00", label: "1:00 PM - 2:00 PM", sortOrder: 2 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-dn-1" },
      update: {},
      create: { id: "slot-dn-1", mealType: MealType.DINNER, startTime: "19:00", endTime: "20:00", label: "7:00 PM - 8:00 PM", sortOrder: 1 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-dn-2" },
      update: {},
      create: { id: "slot-dn-2", mealType: MealType.DINNER, startTime: "20:00", endTime: "21:00", label: "8:00 PM - 9:00 PM", sortOrder: 2 },
    }),
    prisma.deliverySlot.upsert({
      where: { id: "slot-dn-3" },
      update: {},
      create: { id: "slot-dn-3", mealType: MealType.DINNER, startTime: "21:00", endTime: "22:00", label: "9:00 PM - 10:00 PM", sortOrder: 3 },
    }),
  ]);

  // ============================================
  // 6. Delivery Zones
  // ============================================
  console.log("📍 Creating delivery zones...");
  await Promise.all([
    prisma.deliveryZone.upsert({
      where: { id: "zone-blr-central" },
      update: {},
      create: {
        id: "zone-blr-central",
        name: "Bangalore Central",
        pincodes: ["560001", "560002", "560008", "560009", "560038"],
        city: "Bangalore",
        state: "Karnataka",
        deliveryCharge: 29,
        freeDeliveryAbove: 399,
      },
    }),
    prisma.deliveryZone.upsert({
      where: { id: "zone-blr-east" },
      update: {},
      create: {
        id: "zone-blr-east",
        name: "Bangalore East",
        pincodes: ["560037", "560066", "560071", "560093", "560103"],
        city: "Bangalore",
        state: "Karnataka",
        deliveryCharge: 39,
        freeDeliveryAbove: 499,
      },
    }),
    prisma.deliveryZone.upsert({
      where: { id: "zone-blr-south" },
      update: {},
      create: {
        id: "zone-blr-south",
        name: "Bangalore South",
        pincodes: ["560076", "560078", "560068", "560041", "560034"],
        city: "Bangalore",
        state: "Karnataka",
        deliveryCharge: 39,
        freeDeliveryAbove: 499,
      },
    }),
  ]);

  // ============================================
  // 7. Coupons
  // ============================================
  console.log("🎟️  Creating coupons...");
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: "WELCOME50" },
      update: {},
      create: {
        code: "WELCOME50",
        type: CouponType.PERCENTAGE,
        value: 50,
        maxDiscount: 200,
        minOrderAmount: 199,
        usageLimit: 10000,
        perUserLimit: 1,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        description: "50% off on your first order! Max discount ₹200.",
      },
    }),
    prisma.coupon.upsert({
      where: { code: "FLAT100" },
      update: {},
      create: {
        code: "FLAT100",
        type: CouponType.FLAT,
        value: 100,
        minOrderAmount: 499,
        usageLimit: 5000,
        perUserLimit: 3,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        description: "Flat ₹100 off on orders above ₹499.",
      },
    }),
    prisma.coupon.upsert({
      where: { code: "FREEMEAL" },
      update: {},
      create: {
        code: "FREEMEAL",
        type: CouponType.FREE_MEAL,
        value: 1,
        minOrderAmount: 299,
        usageLimit: 1000,
        perUserLimit: 1,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: "Get 1 free meal on orders above ₹299!",
      },
    }),
    prisma.coupon.upsert({
      where: { code: "WEEKLY15" },
      update: {},
      create: {
        code: "WEEKLY15",
        type: CouponType.PERCENTAGE,
        value: 15,
        maxDiscount: 300,
        minOrderAmount: 499,
        usageLimit: 2000,
        perUserLimit: 5,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        description: "15% off on weekly subscription plans!",
      },
    }),
  ]);

  // ============================================
  // 8. Daily Menu (Today + next 7 days)
  // ============================================
  console.log("📅 Creating daily menu for next 7 days...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const breakfastItems = createdMenuItems.filter(
    (item) => [categories[4].id, categories[5].id].includes(item.categoryId)
  );
  const lunchDinnerItems = createdMenuItems.filter(
    (item) => ![categories[4].id, categories[5].id, categories[8].id, categories[9].id].includes(item.categoryId)
  );
  const dessertItems = createdMenuItems.filter(
    (item) => item.categoryId === categories[8].id
  );
  const beverageItems = createdMenuItems.filter(
    (item) => item.categoryId === categories[9].id
  );

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    // Add breakfast items
    for (let i = 0; i < breakfastItems.length; i++) {
      await prisma.dailyMenu.upsert({
        where: {
          date_mealType_menuItemId: {
            date,
            mealType: MealType.BREAKFAST,
            menuItemId: breakfastItems[i].id,
          },
        },
        update: {},
        create: {
          date,
          mealType: MealType.BREAKFAST,
          menuItemId: breakfastItems[i].id,
          sortOrder: i,
          specialPrice: dayOffset === 0 ? Math.round(breakfastItems[i].basePrice * 0.8) : undefined,
        },
      });
    }

    // Add lunch items (rotate selection)
    const lunchSelection = lunchDinnerItems.filter((_, idx) => (idx + dayOffset) % 3 !== 2);
    for (let i = 0; i < lunchSelection.length; i++) {
      await prisma.dailyMenu.upsert({
        where: {
          date_mealType_menuItemId: {
            date,
            mealType: MealType.LUNCH,
            menuItemId: lunchSelection[i].id,
          },
        },
        update: {},
        create: {
          date,
          mealType: MealType.LUNCH,
          menuItemId: lunchSelection[i].id,
          sortOrder: i,
        },
      });
    }

    // Add dinner items (different rotation)
    const dinnerSelection = lunchDinnerItems.filter((_, idx) => (idx + dayOffset) % 3 !== 0);
    for (let i = 0; i < dinnerSelection.length; i++) {
      await prisma.dailyMenu.upsert({
        where: {
          date_mealType_menuItemId: {
            date,
            mealType: MealType.DINNER,
            menuItemId: dinnerSelection[i].id,
          },
        },
        update: {},
        create: {
          date,
          mealType: MealType.DINNER,
          menuItemId: dinnerSelection[i].id,
          sortOrder: i,
        },
      });
    }

    // Also add desserts and beverages to lunch and dinner
    for (const dessert of dessertItems) {
      for (const mealType of [MealType.LUNCH, MealType.DINNER]) {
        await prisma.dailyMenu.upsert({
          where: {
            date_mealType_menuItemId: { date, mealType, menuItemId: dessert.id },
          },
          update: {},
          create: { date, mealType, menuItemId: dessert.id, sortOrder: 100 },
        });
      }
    }
    for (const bev of beverageItems) {
      for (const mealType of [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER]) {
        await prisma.dailyMenu.upsert({
          where: {
            date_mealType_menuItemId: { date, mealType, menuItemId: bev.id },
          },
          update: {},
          create: { date, mealType, menuItemId: bev.id, sortOrder: 101 },
        });
      }
    }
  }

  // ============================================
  // 9. Admin User
  // ============================================
  console.log("👤 Creating admin user...");
  await prisma.user.upsert({
    where: { phone: "1111111111" },
    update: {},
    create: {
      name: "Admin",
      phone: "1111111111",
      phoneVerified: true,
      email: "admin@foodmart.in",
      role: "ADMIN",
      referralCode: "FMADMIN01",
    },
  });

  console.log("\n✅ Seeding completed successfully!");
  console.log("   📂 Categories: 10");
  console.log("   🍽️  Menu Items: " + createdMenuItems.length);
  console.log("   📋 Plans: 3");
  console.log("   🚚 Delivery Slots: 8");
  console.log("   📍 Delivery Zones: 3");
  console.log("   🎟️  Coupons: 4");
  console.log("   👤 Admin user: 1111111111 (OTP: 123456)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
