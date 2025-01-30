import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic Plan",
    price: "Free",
    features: [
      "Generate up to 10 articles per month",
      "Basic writing styles",
      "Standard support",
    ],
    isFree: true,
  },
  {
    name: "Pro Plan",
    price: "$19.99",
    priceId: "price_1QkAcgFNHBx0nIBtxSnVHApt",
    features: [
      "Generate up to 50 articles per month",
      "Advanced writing styles",
      "Priority support",
      "Custom templates",
    ],
    popular: true,
  },
  {
    name: "Enterprise Plan",
    price: "$49.99",
    priceId: "price_1QkAdoFNHBx0nIBtzoKXu46A",
    features: [
      "Unlimited article generation",
      "All writing styles",
      "24/7 Premium support",
      "Custom templates",
      "API access",
    ],
  },
];

const PricingPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      toast.info("Please sign in to continue");
      navigate("/signin");
      return;
    }

    if (plan.isFree) {
      toast.success("You now have access to the Basic plan features!");
      return;
    }

    try {
      setLoading(plan.priceId);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch('https://dsuwqknrixlbuhqtkckd.supabase.co/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error response:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (!url) throw new Error('No checkout URL received');
      
      window.location.href = url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout process");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your content creation needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 rounded-lg ${
                plan.popular
                  ? "border-2 border-purple-500 shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {!plan.isFree && <span className="text-gray-600">/month</span>}
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.priceId}
                >
                  {loading === plan.priceId
                    ? "Processing..."
                    : !user
                    ? "Sign in to Start"
                    : plan.isFree
                    ? "Start Free"
                    : `Subscribe to ${plan.name}`}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;