package com.market.admin.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Double quantity = 1.0;
    private String unit;
    private Double price = 0.0;
    private Boolean purchased = false;

    @Enumerated(EnumType.STRING)
    private Category category;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingList shoppingList;

    public Product() {}

    public Product(Long id, String name, Double quantity, String unit, Double price, Boolean purchased, Category category, ShoppingList shoppingList) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.price = price;
        this.purchased = purchased;
        this.category = category;
        this.shoppingList = shoppingList;
    }

    public static ProductBuilder builder() {
        return new ProductBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getPurchased() { return purchased; }
    public void setPurchased(Boolean purchased) { this.purchased = purchased; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public ShoppingList getShoppingList() { return shoppingList; }
    public void setShoppingList(ShoppingList shoppingList) { this.shoppingList = shoppingList; }

    public static class ProductBuilder {
        private String name;
        private Double quantity;
        private String unit;
        private Double price;
        private Boolean purchased;
        private Category category;
        private ShoppingList shoppingList;

        public ProductBuilder name(String name) { this.name = name; return this; }
        public ProductBuilder quantity(Double quantity) { this.quantity = quantity; return this; }
        public ProductBuilder unit(String unit) { this.unit = unit; return this; }
        public ProductBuilder price(Double price) { this.price = price; return this; }
        public ProductBuilder purchased(Boolean purchased) { this.purchased = purchased; return this; }
        public ProductBuilder category(Category category) { this.category = category; return this; }
        public ProductBuilder shoppingList(ShoppingList shoppingList) { this.shoppingList = shoppingList; return this; }
        public Product build() {
            return new Product(null, name, quantity, unit, price, purchased, category, shoppingList);
        }
    }
}
