package com.brightloop.catalog.plan;

import com.brightloop.catalog.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_frequency", nullable = false, length = 30)
    private BillingFrequency billingFrequency;

    @Column(name = "minimum_quantity", nullable = false)
    private Integer minimumQuantity = 1;

    @Column(name = "availability_start_date", nullable = false)
    private LocalDate availabilityStartDate;

    @Column(name = "availability_end_date")
    private LocalDate availabilityEndDate;

    @Column(name = "auto_close", nullable = false)
    private boolean autoClose = false;

    @Column(name = "early_closure", nullable = false)
    private boolean earlyClosure = false;

    @Column(nullable = false)
    private boolean pause = false;

    @Column(nullable = false)
    private boolean renewal = true;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Plan() {
    }

    public Plan(Product product, String name, BigDecimal price, BillingFrequency billingFrequency,
                Integer minimumQuantity, LocalDate availabilityStartDate, LocalDate availabilityEndDate,
                boolean autoClose, boolean earlyClosure, boolean pause, boolean renewal, boolean active) {
        this.product = product;
        this.name = name;
        this.price = price;
        this.billingFrequency = billingFrequency;
        this.minimumQuantity = minimumQuantity != null ? minimumQuantity : 1;
        this.availabilityStartDate = availabilityStartDate;
        this.availabilityEndDate = availabilityEndDate;
        this.autoClose = autoClose;
        this.earlyClosure = earlyClosure;
        this.pause = pause;
        this.renewal = renewal;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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

