"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutClient({ 
  initialAddresses, 
  deliverySlots,
  userId 
}: { 
  initialAddresses: any[]; 
  deliverySlots: any[];
  userId: string;
}) {
  const { items, cartTotal, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    initialAddresses.find((a) => a.isDefault)?.id || initialAddresses[0]?.id || ""
  );
  
  const [isAddingAddress, setIsAddingAddress] = useState(initialAddresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Group cart items by MealType to select slots
  const mealTypesInCart = Array.from(new Set(items.map(item => item.mealType)));
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create address via API 
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses([data.address, ...addresses]);
        setSelectedAddress(data.address.id);
        setIsAddingAddress(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) return alert("Please select an address");
    if (mealTypesInCart.some(type => !selectedSlots[type])) {
      return alert("Please select delivery slots for all meal types");
    }
    
    setIsLoading(true);
    try {
      const taxAmount = cartTotal * 0.05;
      const deliveryCharge = cartTotal > 499 ? 0 : 49;
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          addressId: selectedAddress,
          selectedSlots,
          cartTotal,
          tax: taxAmount,
          delivery: deliveryCharge,
          finalTotal: cartTotal + taxAmount + deliveryCharge
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create order");
        setIsLoading(false);
        return;
      }

      if (data.isMocked) {
        // Fallback for when Razorpay keys are not configured
        const verifyRes = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ our_order_id: data.order.id })
        });
        
        if (verifyRes.ok) {
          clearCart();
          alert(`Order ${data.order.orderNumber} created successfully! (Simulated Mode)`);
          router.push("/dashboard/orders");
        } else {
          alert("Order verification failed.");
        }
        setIsLoading(false);
        return;
      }

      // Initialize Razorpay
      const resLoad = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!resLoad) {
        alert("Razorpay SDK failed to load. Are you offline?");
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.order.finalAmount * 100,
        currency: "INR",
        name: "Food Mart",
        description: `Order #${data.order.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                our_order_id: data.order.id
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              clearCart();
              alert("Payment successful! Order confirmed.");
              router.push("/dashboard/orders");
            } else {
              alert(verifyData.error || "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: addresses.find(a => a.id === selectedAddress)?.fullName || "User",
          contact: addresses.find(a => a.id === selectedAddress)?.phone || "",
        },
        theme: {
          color: "#E58A13" // Saffron color
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
        setIsLoading(false);
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-card rounded-xl border">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => setIsCartOpen(true)} variant="gradient">Review Cart</Button>
      </div>
    );
  }

  const tax = cartTotal * 0.05;
  const delivery = cartTotal > 499 ? 0 : 49;
  const finalTotal = cartTotal + tax + delivery;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Address Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-saffron-500" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isAddingAddress && addresses.length > 0 ? (
              <div className="space-y-4">
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`flex items-start space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-saffron-500 bg-saffron-50/50 dark:bg-saffron-950/20' : 'hover:border-saffron-200'}`} onClick={() => setSelectedAddress(addr.id)}>
                      <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                      <Label htmlFor={addr.id} className="cursor-pointer flex-1">
                        <div className="font-semibold">{addr.fullName} <Badge variant="secondary" className="ml-2 text-[10px]">{addr.label}</Badge></div>
                        <p className="text-sm text-muted-foreground mt-1">{addr.addressLine1}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm font-medium mt-1">+91 {addr.phone}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button variant="outline" onClick={() => setIsAddingAddress(true)} className="w-full border-dashed">
                  + Add New Address
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input required value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input required maxLength={10} value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address Line 1</Label>
                  <Input required placeholder="House/Flat No, Building, Street" value={newAddress.addressLine1} onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input required value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input required value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input required maxLength={6} value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isLoading} variant="gradient">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Address
                  </Button>
                  {addresses.length > 0 && (
                    <Button type="button" variant="ghost" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Delivery Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mealTypesInCart.map((mealType) => {
              const typeSlots = deliverySlots.filter(s => s.mealType === mealType);
              return (
                <div key={mealType} className="space-y-3">
                  <h4 className="font-semibold border-b pb-2 capitalize">{mealType.toLowerCase()} Delivery</h4>
                  <RadioGroup 
                    value={selectedSlots[mealType]} 
                    onValueChange={(val) => setSelectedSlots(prev => ({...prev, [mealType]: val}))}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {typeSlots.map((slot) => (
                      <div key={slot.id} className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer ${selectedSlots[mealType] === slot.id ? 'border-saffron-500 bg-saffron-50/50 dark:bg-saffron-950/20' : ''}`} onClick={() => setSelectedSlots(prev => ({...prev, [mealType]: slot.id}))}>
                        <RadioGroupItem value={slot.id} id={slot.id} />
                        <Label htmlFor={slot.id} className="cursor-pointer flex-1">{slot.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>

      {/* Right Column: Summary */}
      <div>
        <Card className="sticky top-28 border-saffron-200 shadow-xl shadow-saffron-500/5">
          <CardHeader className="bg-saffron-50 dark:bg-saffron-950/30 border-b">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-10 h-10 bg-secondary/50 rounded flex items-center justify-center flex-shrink-0 text-xl">
                    {item.image || "🥘"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold line-clamp-1">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Total</span>
                <span className="font-medium">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes (5%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Delivery Fee</span>
                <span className="font-medium">{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
              </div>
            </div>

            <div className="border-t border-dashed pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Amount to Pay</span>
              <span className="font-bold text-xl font-heading text-saffron-600 dark:text-saffron-400">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold" 
              variant="gradient"
              onClick={handleCheckout}
              disabled={isLoading || !selectedAddress || mealTypesInCart.some(t => !selectedSlots[t])}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Proceed to Payment
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center bg-secondary/50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Secure payments powered by Razorpay
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
