import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  product_name: string;
  variant_name?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_area?: string | null;
  subtotal: number;
  discount_amount?: number | null;
  delivery_charge?: number | null;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  items?: OrderItem[];
}

export const useInvoiceDownload = () => {
  const { toast } = useToast();

  const fetchOrderWithItems = useCallback(async (orderNumber: string): Promise<Order | null> => {
    // Add # prefix if not present for database query
    const orderNumberWithHash = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
    
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("order_number", orderNumberWithHash)
      .maybeSingle();

    if (error || !order) {
      toast({
        title: "অর্ডার পাওয়া যায়নি",
        variant: "destructive",
      });
      return null;
    }

    return {
      ...order,
      items: order.order_items,
    } as Order;
  }, [toast]);

  const downloadInvoice = useCallback(async (orderNumber: string) => {
    const order = await fetchOrderWithItems(orderNumber);
    if (!order) return;

    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.order_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
          .logo-sub { font-size: 12px; color: #666; }
          .invoice-info { text-align: right; }
          .invoice-title { font-size: 20px; font-weight: bold; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .info-section h3 { font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #444; }
          .info-section p { font-size: 12px; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 10px; border-bottom: 2px solid #ddd; font-size: 12px; }
          th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: center; }
          th:nth-child(3), th:nth-child(4) { text-align: right; }
          td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
          td:nth-child(2) { text-align: center; }
          td:nth-child(3), td:nth-child(4) { text-align: right; }
          .variant { font-size: 10px; color: #666; }
          .summary { display: flex; justify-content: flex-end; }
          .summary-box { width: 250px; }
          .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
          .summary-total { border-top: 2px solid #333; margin-top: 8px; padding-top: 8px; font-weight: bold; }
          .summary-total span:last-child { color: #22c55e; }
          .payment-info { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; }
          .payment-info span { margin-right: 30px; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
          .discount { color: #22c55e; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">অর্গানিক স্টোর</div>
            <div class="logo-sub">১০০% প্রাকৃতিক ও অর্গানিক পণ্য</div>
          </div>
          <div class="invoice-info">
            <div class="invoice-title">ইনভয়েস</div>
            <div style="font-size: 12px; color: #666;">অর্ডার: ${order.order_number}</div>
            <div style="font-size: 12px; color: #666;">তারিখ: ${new Date(order.created_at).toLocaleDateString('bn-BD')}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>কাস্টমার তথ্য</h3>
            <p>${order.customer_name}</p>
            <p>${order.customer_phone}</p>
            ${order.customer_email ? `<p>${order.customer_email}</p>` : ''}
          </div>
          <div class="info-section">
            <h3>ডেলিভারি ঠিকানা</h3>
            <p>${order.shipping_address}</p>
            <p>${order.shipping_area ? order.shipping_area + ', ' : ''}${order.shipping_city}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>পণ্য</th>
              <th>পরিমাণ</th>
              <th>দাম</th>
              <th>মোট</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map(item => `
              <tr>
                <td>
                  ${item.product_name}
                  ${item.variant_name ? `<div class="variant">${item.variant_name}</div>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>৳${item.unit_price.toLocaleString()}</td>
                <td>৳${item.total_price.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-box">
            <div class="summary-row">
              <span>সাবটোটাল:</span>
              <span>৳${order.subtotal.toLocaleString()}</span>
            </div>
            ${(order.discount_amount ?? 0) > 0 ? `
              <div class="summary-row discount">
                <span>ছাড়:</span>
                <span>-৳${(order.discount_amount || 0).toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span>ডেলিভারি চার্জ:</span>
              <span>৳${(order.delivery_charge || 0).toLocaleString()}</span>
            </div>
            <div class="summary-row summary-total">
              <span>সর্বমোট:</span>
              <span>৳${order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="payment-info">
          <span><strong>পেমেন্ট পদ্ধতি:</strong> ${order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}</span>
          <span><strong>পেমেন্ট স্ট্যাটাস:</strong> ${order.payment_status === 'paid' ? 'পরিশোধিত' : order.payment_status === 'partial' ? 'আংশিক পরিশোধ' : 'বাকি'}</span>
        </div>

        <div class="footer">
          <p>ধন্যবাদ আমাদের থেকে কেনাকাটা করার জন্য!</p>
          <p>যেকোনো সমস্যায় যোগাযোগ করুন: +880 1XXX-XXXXXX</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  }, [fetchOrderWithItems]);

  return { downloadInvoice, fetchOrderWithItems };
};
