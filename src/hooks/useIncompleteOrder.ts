import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { Json } from "@/integrations/supabase/types";

interface CheckoutFormData {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  area?: string;
  notes?: string;
}

export const useIncompleteOrder = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const sessionIdRef = useRef<string | null>(null);
  const incompleteOrderIdRef = useRef<string | null>(null);

  // Get or create session ID
  useEffect(() => {
    let sessionId = localStorage.getItem("checkout_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("checkout_session_id", sessionId);
    }
    sessionIdRef.current = sessionId;
  }, []);

  const saveIncompleteOrder = useCallback(async (formData: CheckoutFormData, deliveryZoneId?: string) => {
    if (!sessionIdRef.current) return;
    
    // Only save if there's meaningful data
    const hasData = formData.fullName || formData.phone || formData.address;
    if (!hasData && items.length === 0) return;

    const incompleteOrderData = {
      session_id: sessionIdRef.current,
      user_id: user?.id || null,
      customer_name: formData.fullName || null,
      customer_phone: formData.phone || null,
      customer_email: formData.email || null,
      shipping_address: formData.address || null,
      shipping_city: formData.city || null,
      shipping_area: formData.area || null,
      delivery_zone_id: deliveryZoneId || null,
      notes: formData.notes || null,
      cart_data: (items.length > 0 ? JSON.parse(JSON.stringify(items)) : null) as Json,
      last_updated_at: new Date().toISOString(),
    };

    try {
      if (incompleteOrderIdRef.current) {
        // Update existing
        await supabase
          .from("incomplete_orders")
          .update(incompleteOrderData)
          .eq("id", incompleteOrderIdRef.current);
      } else {
        // Check if exists for this session
        const { data: existing } = await supabase
          .from("incomplete_orders")
          .select("id")
          .eq("session_id", sessionIdRef.current)
          .eq("is_converted", false)
          .maybeSingle();

        if (existing) {
          incompleteOrderIdRef.current = existing.id;
          await supabase
            .from("incomplete_orders")
            .update(incompleteOrderData)
            .eq("id", existing.id);
        } else {
          // Create new
          const { data } = await supabase
            .from("incomplete_orders")
            .insert(incompleteOrderData)
            .select("id")
            .single();
          
          if (data) {
            incompleteOrderIdRef.current = data.id;
          }
        }
      }
    } catch (error) {
      console.error("Error saving incomplete order:", error);
    }
  }, [user, items]);

  const debouncedSave = useDebouncedCallback(saveIncompleteOrder, 1000);

  const markAsConverted = useCallback(async () => {
    if (!sessionIdRef.current) return;

    try {
      await supabase
        .from("incomplete_orders")
        .update({ is_converted: true })
        .eq("session_id", sessionIdRef.current);
      
      // Clear session for new checkout
      localStorage.removeItem("checkout_session_id");
      sessionIdRef.current = null;
      incompleteOrderIdRef.current = null;
    } catch (error) {
      console.error("Error marking order as converted:", error);
    }
  }, []);

  return {
    saveIncompleteOrder: debouncedSave,
    markAsConverted,
  };
};
