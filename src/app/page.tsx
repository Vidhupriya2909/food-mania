import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Clock,
  Leaf,
  Truck,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Zap,
  Users,
  Gift,
  Calendar,
  Check,
} from "lucide-react";

// ============================================
// Hero Section
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" id="hero">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 via-background to-spice-50 dark:from-saffron-950/20 dark:via-background dark:to-spice-950/20" />

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">🥗</div>
        <div className="absolute top-40 right-20 text-5xl animate-float delay-300 opacity-20">🍛</div>
        <div className="absolute bottom-40 left-1/4 text-4xl animate-float delay-500 opacity-15">🥘</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float delay-200 opacity-20">🍲</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-float delay-400 opacity-15">🥙</div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spice-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-400 border-none px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                #1 Meal Subscription Platform
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading leading-tight">
                Delicious meals,{" "}
                <span className="gradient-text">delivered</span>{" "}
                to your door
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Subscribe to freshly prepared breakfast, lunch & dinner.
                Choose your plan, customize your menu, and enjoy home-style
                meals every single day.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu" id="hero-explore-menu">
                <Button size="xl" variant="gradient" className="text-base gap-2 w-full sm:w-auto">
                  Explore Today&apos;s Menu
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/plans" id="hero-view-plans">
                <Button size="xl" variant="outline" className="text-base gap-2 w-full sm:w-auto">
                  View Plans & Pricing
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-300 to-spice-400 border-2 border-background flex items-center justify-center text-xs text-white font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">10,000+</strong> happy subscribers
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-saffron-400 text-saffron-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right - Food Showcase */}
          <div className="relative animate-fade-in delay-200">
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main food card */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-saffron-100 to-spice-50 dark:from-saffron-900/30 dark:to-spice-900/20 p-8 border">
                <div className="text-center space-y-4">
                  <div className="text-8xl">🍛</div>
                  <h3 className="text-2xl font-bold font-heading">Today&apos;s Special</h3>
                  <p className="text-muted-foreground">Paneer Butter Masala with Naan & Raita</p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <Badge variant="veg">
                      <Leaf className="w-3 h-3 mr-1" />
                      Veg
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      25 min
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="w-3.5 h-3.5" />
                      450 cal
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl font-bold font-heading gradient-text">₹149</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">₹249</span>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-background border rounded-2xl p-3 shadow-lg animate-float z-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-herb-100 dark:bg-herb-900/30 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-herb-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Free Delivery</p>
                    <p className="text-[10px] text-muted-foreground">Orders above ₹499</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-background border rounded-2xl p-3 shadow-lg animate-float delay-300 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">100% Hygienic</p>
                    <p className="text-[10px] text-muted-foreground">FSSAI Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// How It Works Section
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: Calendar,
      title: "Choose Your Plan",
      description: "Pick daily, weekly, or monthly subscription plans. Select breakfast, lunch, dinner — or all three.",
      color: "from-saffron-400 to-saffron-600",
    },
    {
      step: "02",
      icon: ChefHat,
      title: "Customize Your Menu",
      description: "Browse our daily rotating menu and pick your favorite dishes. Filter by veg, non-veg, vegan & more.",
      color: "from-spice-400 to-spice-600",
    },
    {
      step: "03",
      icon: Truck,
      title: "Get It Delivered",
      description: "Sit back and relax! Your freshly prepared meals arrive at your doorstep on time, every time.",
      color: "from-herb-400 to-herb-600",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-400 border-none">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Three simple steps to{" "}
            <span className="gradient-text">delicious meals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with Food Mart is as easy as 1-2-3. No complicated setup, no long-term commitments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.step} className="relative group" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Connector line (hidden on mobile, shown on md+) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-border to-border/50" />
              )}
              <Card className="text-center card-hover border-none shadow-md bg-background group-hover:shadow-xl">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="relative mx-auto mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-saffron-400 flex items-center justify-center text-xs font-bold text-saffron-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Featured Meals Section
// ============================================
function FeaturedMealsSection() {
  const meals = [
    {
      name: "Masala Dosa",
      description: "Crispy dosa with potato filling, sambar & chutney",
      price: 89,
      originalPrice: 149,
      mealType: "BREAKFAST",
      mealEmoji: "☀️",
      dietary: "veg" as const,
      calories: 320,
      emoji: "🫓",
    },
    {
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken pieces & raita",
      price: 179,
      originalPrice: 299,
      mealType: "LUNCH",
      mealEmoji: "🌤️",
      dietary: "nonveg" as const,
      calories: 580,
      emoji: "🍗",
    },
    {
      name: "Paneer Tikka Wrap",
      description: "Grilled paneer in whole wheat wrap with mint chutney",
      price: 129,
      originalPrice: 199,
      mealType: "LUNCH",
      mealEmoji: "🌤️",
      dietary: "veg" as const,
      calories: 420,
      emoji: "🌯",
    },
    {
      name: "Buddha Bowl",
      description: "Quinoa, roasted veggies, hummus & tahini dressing",
      price: 159,
      originalPrice: 249,
      mealType: "DINNER",
      mealEmoji: "🌙",
      dietary: "vegan" as const,
      calories: 380,
      emoji: "🥗",
    },
    {
      name: "Dal Makhani Thali",
      description: "Creamy dal with roti, rice, salad & dessert",
      price: 149,
      originalPrice: 229,
      mealType: "DINNER",
      mealEmoji: "🌙",
      dietary: "veg" as const,
      calories: 520,
      emoji: "🍲",
    },
    {
      name: "Egg Bhurji & Paratha",
      description: "Spiced scrambled eggs with flaky whole wheat paratha",
      price: 99,
      originalPrice: 169,
      mealType: "BREAKFAST",
      mealEmoji: "☀️",
      dietary: "egg" as const,
      calories: 380,
      emoji: "🍳",
    },
  ];

  return (
    <section className="py-20 lg:py-28" id="featured-meals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-4">
            <Badge className="bg-spice-100 text-spice-800 dark:bg-spice-900/30 dark:text-spice-400 border-none">
              Today&apos;s Menu
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Today&apos;s <span className="gradient-text">featured meals</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Freshly prepared by our expert chefs with the finest ingredients. New menu every day!
            </p>
          </div>
          <Link href="/menu" id="view-full-menu">
            <Button variant="outline" className="gap-2">
              View Full Menu
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal, index) => (
            <Card
              key={meal.name}
              className="card-hover overflow-hidden group border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative p-6 pb-4">
                {/* Meal type badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={meal.dietary} className="text-xs">
                    {meal.dietary === "veg"
                      ? "🟢 Veg"
                      : meal.dietary === "nonveg"
                      ? "🔴 Non-Veg"
                      : meal.dietary === "vegan"
                      ? "🌿 Vegan"
                      : "🟡 Egg"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {meal.mealEmoji} {meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Food emoji */}
                <div className="text-6xl text-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {meal.emoji}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold font-heading">{meal.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {meal.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {meal.calories} cal
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    20 min
                  </span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-4 bg-secondary/30 flex items-center justify-between border-t">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-heading">₹{meal.price}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{meal.originalPrice}
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    {Math.round(((meal.originalPrice - meal.price) / meal.originalPrice) * 100)}% off
                  </Badge>
                </div>
                <Button size="sm" variant="gradient" className="gap-1">
                  Add
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Plans Preview Section
// ============================================
function PlansPreviewSection() {
  const plans = [
    {
      name: "Daily",
      price: "₹99",
      unit: "/meal",
      description: "Perfect for trying us out",
      features: ["Pick any meal", "No commitment", "Cancel anytime", "Free delivery on ₹499+"],
      popular: false,
      color: "from-saffron-400 to-saffron-500",
    },
    {
      name: "Weekly",
      price: "₹549",
      unit: "/week",
      description: "Most popular choice",
      features: ["7 days of meals", "10% discount", "Free delivery", "Skip any day", "Priority support"],
      popular: true,
      color: "from-spice-400 to-spice-600",
    },
    {
      name: "Monthly",
      price: "₹1,999",
      unit: "/month",
      description: "Best value for regulars",
      features: ["30 days of meals", "20% discount", "Free delivery", "Skip any day", "Priority support", "Free dessert Fridays"],
      popular: false,
      color: "from-herb-400 to-herb-600",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30" id="plans-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-herb-100 text-herb-800 dark:bg-herb-900/30 dark:text-herb-400 border-none">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Find the{" "}
            <span className="gradient-text">perfect plan</span> for you
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans for every need. Mix and match breakfast, lunch, and dinner. Cancel or pause anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative card-hover ${
                plan.popular
                  ? "border-saffron-400 shadow-xl shadow-saffron-500/10 scale-105"
                  : "border"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-saffron-500 to-spice-500 text-white border-none px-4 shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="pt-8 pb-8 px-6">
                <div className="text-center space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto shadow-lg`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div>
                    <span className="text-4xl font-bold font-heading">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.unit}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-herb-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/plans" className="block mt-6">
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Features Section
// ============================================
function FeaturesSection() {
  const features = [
    {
      icon: Leaf,
      title: "Fresh & Healthy",
      description: "All meals prepared with fresh ingredients, no preservatives, and balanced nutrition.",
      color: "text-herb-500 bg-herb-100 dark:bg-herb-900/30",
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Choose your preferred delivery time slots. We guarantee punctual delivery, every time.",
      color: "text-saffron-500 bg-saffron-100 dark:bg-saffron-900/30",
    },
    {
      icon: Heart,
      title: "Customizable Meals",
      description: "Veg, non-veg, vegan, Jain-friendly, gluten-free — we cater to every dietary need.",
      color: "text-spice-500 bg-spice-100 dark:bg-spice-900/30",
    },
    {
      icon: Users,
      title: "Invite & Earn",
      description: "Invite friends and earn rewards! Share your referral code and get ₹100 per signup.",
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Gift,
      title: "Gift Cards",
      description: "Gift healthy meals to your loved ones. Buy digital gift cards from ₹500 to ₹5,000.",
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Shield,
      title: "100% Hygienic",
      description: "FSSAI certified kitchen, temperature-monitored packaging, and sealed containers.",
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  return (
    <section className="py-20 lg:py-28" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-400 border-none">
            Why Food Mart?
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Why <span className="gradient-text">thousands trust</span> us
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="card-hover border group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Testimonials Section
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Working Professional",
      quote: "Food Mart has been a game-changer! No more cooking stress after work. The biryani is just like home-made.",
      rating: 5,
      initials: "PS",
    },
    {
      name: "Rahul Mehta",
      role: "Fitness Enthusiast",
      quote: "Love the calorie tracking! I can plan my macros perfectly with their detailed nutrition info. Best meal service in Bangalore.",
      rating: 5,
      initials: "RM",
    },
    {
      name: "Ananya Desai",
      role: "College Student",
      quote: "Affordable and delicious! The monthly plan saves me so much money compared to ordering from Swiggy daily.",
      rating: 5,
      initials: "AD",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-400 border-none">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            What our <span className="gradient-text">subscribers say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="card-hover"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= testimonial.rating
                          ? "fill-saffron-400 text-saffron-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-spice-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA Section
// ============================================
function CtaSection() {
  return (
    <section className="py-20 lg:py-28" id="cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-saffron-500 via-spice-500 to-saffron-600 p-8 sm:p-12 lg:p-16 text-white">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-10 left-10 text-8xl">🍽️</div>
            <div className="absolute bottom-10 right-10 text-8xl">🥘</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px]">
              🍛
            </div>
          </div>

          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
              Ready to eat better?
            </h2>
            <p className="text-lg text-white/80">
              Join 10,000+ happy subscribers and start your meal subscription today.
              First week at 50% off!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plans" id="cta-subscribe-now">
                <Button
                  size="xl"
                  className="bg-white text-spice-600 hover:bg-white/90 gap-2 text-base shadow-xl"
                >
                  Subscribe Now — 50% Off
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/menu" id="cta-explore-menu">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 gap-2 text-base"
                >
                  Explore Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedMealsSection />
      <PlansPreviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
