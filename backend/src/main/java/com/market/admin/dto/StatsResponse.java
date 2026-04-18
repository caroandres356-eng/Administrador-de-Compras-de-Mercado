package com.market.admin.dto;

import java.util.List;
import java.util.Map;

public class StatsResponse {
    private List<Map<String, Object>> monthlySpend = new java.util.ArrayList<>();
    private List<Map<String, Object>> categorySpend = new java.util.ArrayList<>();
    private List<Map<String, Object>> listSpend = new java.util.ArrayList<>();
    private Long totalLists;
    private Long totalProducts;
    private Long purchasedProducts;
    private Long pendingProducts;

    public StatsResponse() {}

    public StatsResponse(List<Map<String, Object>> monthlySpend, List<Map<String, Object>> categorySpend, List<Map<String, Object>> listSpend, Long totalLists, Long totalProducts, Long purchasedProducts, Long pendingProducts) {
        this.monthlySpend = monthlySpend;
        this.categorySpend = categorySpend;
        this.listSpend = listSpend;
        this.totalLists = totalLists;
        this.totalProducts = totalProducts;
        this.purchasedProducts = purchasedProducts;
        this.pendingProducts = pendingProducts;
    }

    public static StatsResponseBuilder builder() {
        return new StatsResponseBuilder();
    }

    // Getters
    public List<Map<String, Object>> getMonthlySpend() { return monthlySpend; }
    public List<Map<String, Object>> getCategorySpend() { return categorySpend; }
    public List<Map<String, Object>> getListSpend() { return listSpend; }
    public Long getTotalLists() { return totalLists; }
    public Long getTotalProducts() { return totalProducts; }
    public Long getPurchasedProducts() { return purchasedProducts; }
    public Long getPendingProducts() { return pendingProducts; }

    public static class StatsResponseBuilder {
        private List<Map<String, Object>> monthlySpend;
        private List<Map<String, Object>> categorySpend;
        private List<Map<String, Object>> listSpend;
        private Long totalLists;
        private Long totalProducts;
        private Long purchasedProducts;
        private Long pendingProducts;

        public StatsResponseBuilder monthlySpend(List<Map<String, Object>> monthlySpend) { this.monthlySpend = monthlySpend; return this; }
        public StatsResponseBuilder categorySpend(List<Map<String, Object>> categorySpend) { this.categorySpend = categorySpend; return this; }
        public StatsResponseBuilder listSpend(List<Map<String, Object>> listSpend) { this.listSpend = listSpend; return this; }
        public StatsResponseBuilder totalLists(Long totalLists) { this.totalLists = totalLists; return this; }
        public StatsResponseBuilder totalProducts(Long totalProducts) { this.totalProducts = totalProducts; return this; }
        public StatsResponseBuilder purchasedProducts(Long purchasedProducts) { this.purchasedProducts = purchasedProducts; return this; }
        public StatsResponseBuilder pendingProducts(Long pendingProducts) { this.pendingProducts = pendingProducts; return this; }
        public StatsResponse build() {
            return new StatsResponse(monthlySpend, categorySpend, listSpend, totalLists, totalProducts, purchasedProducts, pendingProducts);
        }
    }
}
