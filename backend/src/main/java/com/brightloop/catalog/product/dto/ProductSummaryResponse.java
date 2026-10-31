package com.brightloop.catalog.product.dto;

import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductType;
import java.math.BigDecimal;

public class ProductSummaryResponse {

    private Long id;
    private String name;
    private ProductType type;
    private BigDecimal salesPrice;
    private boolean active;

    public ProductSummaryResponse() {
    }

    public static ProductSummaryResponse fromEntity(Product product) {
        ProductSummaryResponse res = new ProductSummaryResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setType(product.getType());
        res.setSalesPrice(product.getSalesPrice());
        res.setActive(product.isActive());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProductType getType() {
        return type;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

    public BigDecimal getSalesPrice() {
        return salesPrice;
    }

    public void setSalesPrice(BigDecimal salesPrice) {
        this.salesPrice = salesPrice;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

