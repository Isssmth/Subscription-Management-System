package com.brightloop.catalog.plan.dto;

import com.brightloop.catalog.plan.BillingFrequency;
import com.brightloop.catalog.plan.Plan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlanResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String name;
    private BigDecimal price;
    private BillingFrequency billingFrequency;
    private Integer minimumQuantity;
    private LocalDate availabilityStartDate;
    private LocalDate availabilityEndDate;
    private boolean autoClose;
    private boolean earlyClosure;
    private boolean pause;
    private boolean renewal;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlanResponse() {
    }

    public static PlanResponse fromEntity(Plan plan) {
        PlanResponse res = new PlanResponse();
        res.setId(plan.getId());
        if (plan.getProduct() != null) {
            res.setProductId(plan.getProduct().getId());
            res.setProductName(plan.getProduct().getName());
        }
        res.setName(plan.getName());
        res.setPrice(plan.getPrice());
        res.setBillingFrequency(plan.getBillingFrequency());
        res.setMinimumQuantity(plan.getMinimumQuantity());
        res.setAvailabilityStartDate(plan.getAvailabilityStartDate());
        res.setAvailabilityEndDate(plan.getAvailabilityEndDate());
        res.setAutoClose(plan.isAutoClose());
        res.setEarlyClosure(plan.isEarlyClosure());
        res.setPause(plan.isPause());
        res.setRenewal(plan.isRenewal());
        res.setActive(plan.isActive());
        res.setCreatedAt(plan.getCreatedAt());
        res.setUpdatedAt(plan.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BillingFrequency getBillingFrequency() {
        return billingFrequency;
    }

    public void setBillingFrequency(BillingFrequency billingFrequency) {
        this.billingFrequency = billingFrequency;
    }

    public Integer getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(Integer minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }

    public LocalDate getAvailabilityStartDate() {
        return availabilityStartDate;
    }

    public void setAvailabilityStartDate(LocalDate availabilityStartDate) {
        this.availabilityStartDate = availabilityStartDate;
    }

    public LocalDate getAvailabilityEndDate() {
        return availabilityEndDate;
    }

    public void setAvailabilityEndDate(LocalDate availabilityEndDate) {
        this.availabilityEndDate = availabilityEndDate;
    }

    public boolean isAutoClose() {
        return autoClose;
    }

    public void setAutoClose(boolean autoClose) {
        this.autoClose = autoClose;
    }

    public boolean isEarlyClosure() {
        return earlyClosure;
    }

    public void setEarlyClosure(boolean earlyClosure) {
        this.earlyClosure = earlyClosure;
    }

    public boolean isPause() {
        return pause;
    }

    public void setPause(boolean pause) {
        this.pause = pause;
    }

    public boolean isRenewal() {
        return renewal;
    }

    public void setRenewal(boolean renewal) {
        this.renewal = renewal;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

