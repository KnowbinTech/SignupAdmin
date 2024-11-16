export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface DashboardData {
  sales: {
    total_sales: number;
    previous_total_sales: number;
    percentage_change: string;
  };
  customers: {
    customers: number;
    new_customers: number;
    retention_rate: number;
  };
  products: {
    top_products: Array<{
      product_variant__product__name: string;
      total_quantity_sold: number;
      total_revenue: number;
    }>;
    low_performing_products: Array<{
      product_name: string;
      total_quantity_sold: number;
      total_revenue: number;
    }>;
    category_performance: Array<{
      product_variant__product__category__name: string;
      total_quantity_sold: number;
      total_revenue: number;
    }>;
  };
  orders: {
    details: {
      PENDING: number;
      PAYMENT_INITIATED: number;
      ORDER_PLACED: number;
      ORDER_PROCESSING: number;
      PACKED: number;
      READY_FOR_DISPATCH: number;
      SHIPPED: number;
      DELIVERED: number;
      CANCELLED: number;
    };
    order_processing_time: number;
    order_return_rate: number;
  };
}

export interface CustomerGrowth {
  current_month_customers: number;
  last_month_customers: number;
  growth: number;
  percentage_growth: number;
}

export interface CustomerOrderAnalysis {
  current_month_customers_with_orders: number;
  last_month_customers_with_orders: number;
  growth: number;
  percentage_growth: number;
}

export interface CustomerRetention {
  retained_customers_count: number;
  total_active_customers_last_month: number;
  retention_rate: number;
}

export interface MonthlyCustomerCount {
  monthly_customer_counts: Array<{
    month: string;
    count: number;
  }>;
}