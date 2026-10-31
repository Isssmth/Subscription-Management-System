package com.brightloop.catalog.plan.dto;

import com.brightloop.catalog.plan.BillingFrequency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PlanRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Plan name is required")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Billing frequency is required")
    private BillingFrequency billingFrequency;

    @NotNull(message = "Minimum quantity is required")
    @Min(value = 1, message = "Minimum quantity must be at least 1")
    private Integer minimumQuantity = 1;

    @NotNull(message = "Availability start date is required")
    private LocalDate availabilityStartDate;

    private LocalDate availabilityEndDate;

    private Boolean autoClose = false;

    private Boolean earlyClosure = false;

    private Boolean pause = false;

    private Boolean renewal = true;

    private Boolean active = true;

    public PlanRequest() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public Boolean getAutoClose() {
        return autoClose;
    }

    public void setAutoClose(Boolean autoClose) {
        this.autoClose = autoClose;
    }

    public Boolean getEarlyClosure() {
        return earlyClosure;
    }

    public void setEarlyClosure(Boolean earlyClosure) {
        this.earlyClosure = earlyClosure;
    }

    public Boolean getPause() {
        return pause;
    }

    public void setPause(Boolean pause) {
        this.pause = pause;
    }

    public Boolean getRenewal() {
        return renewal;
    }

    public void setRenewal(Boolean renewal) {
        this.renewal = renewal;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

