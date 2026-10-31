package com.brightloop.subscriptions;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String subscriptionNumber;

    private Long customerId;
    private Long planId;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextBillingDate;

    @Enumerated(EnumType.STRING)
    private BillingInterval billingInterval;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    private boolean autoRenew;

    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "quotation_id", unique = true)
    private Quotation quotation;

    @OneToMany(mappedBy = "subscription",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<SubscriptionLine> lines = new ArrayList<>();

    public Subscription() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SubscriptionStatus.CONFIRMED;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubscriptionNumber() {
        return subscriptionNumber;
    }

    public void setSubscriptionNumber(String subscriptionNumber) {
        this.subscriptionNumber = subscriptionNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getNextBillingDate() {
        return nextBillingDate;
    }

    public void setNextBillingDate(LocalDate nextBillingDate) {
        this.nextBillingDate = nextBillingDate;
    }

    public BillingInterval getBillingInterval() {
        return billingInterval;
    }

    public void setBillingInterval(BillingInterval billingInterval) {
        this.billingInterval = billingInterval;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public boolean isAutoRenew() {
        return autoRenew;
    }

    public void setAutoRenew(boolean autoRenew) {
        this.autoRenew = autoRenew;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Quotation getQuotation() {
        return quotation;
    }

    public void setQuotation(Quotation quotation) {
        this.quotation = quotation;
    }

    public List<SubscriptionLine> getLines() {
        return lines;
    }

    public void setLines(List<SubscriptionLine> lines) {
        this.lines = lines;
    }
}

