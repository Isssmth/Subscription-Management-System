package com.brightloop.subscriptions;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class SubscriptionService {

    private final QuotationRepository quotationRepository;
    private final QuotationLineRepository quotationLineRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionLineRepository subscriptionLineRepository;

    public SubscriptionService(
            QuotationRepository quotationRepository,
            QuotationLineRepository quotationLineRepository,
            SubscriptionRepository subscriptionRepository,
            SubscriptionLineRepository subscriptionLineRepository) {

        this.quotationRepository = quotationRepository;
        this.quotationLineRepository = quotationLineRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionLineRepository = subscriptionLineRepository;
    }

    // Create a new quotation
    public Quotation createQuotation(
            SubscriptionDtos.CreateQuotationRequest request) {

        if (!request.validityDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Quotation validity date must be in the future");
        }

        Quotation quotation = new Quotation();

        quotation.setCustomerId(request.customerId());
        quotation.setPlanId(request.planId());
        quotation.setQuotationNumber(generateNumber("QUO"));
        quotation.setValidityDate(request.validityDate());
        quotation.setStatus(QuotationStatus.QUOTATION);

        for (SubscriptionDtos.LineRequest item : request.lines()) {

            if (item.quantity() <= 0) {
                throw new IllegalArgumentException(
                        "Quantity must be greater than zero");
            }

            QuotationLine line = new QuotationLine();

            line.setProductId(item.productId());
            line.setVariantId(item.variantId());
            line.setPriceId(item.priceId());
            line.setQuantity(item.quantity());
            line.setUnitPrice(item.unitPrice());
            line.setAmount(
                    item.unitPrice().multiply(
                            java.math.BigDecimal.valueOf(item.quantity())
                    )
            );

            line.setQuotation(quotation);
            quotation.getLines().add(line);
        }

        return quotationRepository.save(quotation);
    }

    // Get all quotations
    @Transactional(readOnly = true)
    public List<Quotation> getAllQuotations() {
        return quotationRepository.findAll();
    }

    // Get quotation by ID
    @Transactional(readOnly = true)
    public Quotation getQuotation(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Quotation not found"));
    }

    // Confirm quotation and create subscription
    public Subscription confirmQuotation(
            Long id,
            SubscriptionDtos.ConfirmQuotationRequest request) {

        Quotation quotation = getQuotation(id);

        if (quotation.getStatus() != QuotationStatus.QUOTATION) {
            throw new IllegalArgumentException(
                    "Only pending quotations can be confirmed");
        }

        if (quotation.getValidityDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Quotation has expired");
        }

        if (request.startDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Start date cannot be in the past");
        }

        Subscription subscription = new Subscription();

        subscription.setSubscriptionNumber(generateNumber("SUB"));
        subscription.setCustomerId(quotation.getCustomerId());
        subscription.setPlanId(quotation.getPlanId());
        subscription.setStartDate(request.startDate());
        subscription.setNextBillingDate(request.startDate());
        subscription.setBillingInterval(request.billingInterval());
        subscription.setAutoRenew(request.autoRenew());
        subscription.setStatus(SubscriptionStatus.CONFIRMED);
        subscription.setQuotation(quotation);

        for (QuotationLine quotationLine : quotation.getLines()) {

            SubscriptionLine line = new SubscriptionLine();

            line.setProductId(quotationLine.getProductId());
            line.setVariantId(quotationLine.getVariantId());
            line.setPriceId(quotationLine.getPriceId());
            line.setQuantity(quotationLine.getQuantity());
            line.setUnitPrice(quotationLine.getUnitPrice());
            line.setAmount(quotationLine.getAmount());

            line.setSubscription(subscription);
            subscription.getLines().add(line);
        }

        quotation.setStatus(QuotationStatus.CONFIRMED);
        quotationRepository.save(quotation);

        return subscriptionRepository.save(subscription);
    }

    // Get all subscriptions
    @Transactional(readOnly = true)
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    // Get subscription by ID
    @Transactional(readOnly = true)
    public Subscription getSubscription(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Subscription not found"));
    }

    // Get subscriptions by customer
    @Transactional(readOnly = true)
    public List<Subscription> getSubscriptionsByCustomer(Long customerId) {
        return subscriptionRepository.findByCustomerId(customerId);
    }

    // Get subscription lines
    @Transactional(readOnly = true)
    public List<SubscriptionLine> getSubscriptionLines(Long id) {
        Subscription subscription = getSubscription(id);
        return subscription.getLines();
    }

    // Activate subscription
    public Subscription activateSubscription(Long id) {
        Subscription subscription = getSubscription(id);

        if (subscription.getStatus() != SubscriptionStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only confirmed subscriptions can be activated");
        }

        subscription.setStatus(SubscriptionStatus.ACTIVE);
        return subscriptionRepository.save(subscription);
    }

    // Pause subscription
    public Subscription pauseSubscription(Long id) {
        Subscription subscription = getSubscription(id);

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Only active subscriptions can be paused");
        }

        subscription.setStatus(SubscriptionStatus.PAUSED);
        return subscriptionRepository.save(subscription);
    }

    // Resume subscription
    public Subscription resumeSubscription(Long id) {
        Subscription subscription = getSubscription(id);

        if (subscription.getStatus() != SubscriptionStatus.PAUSED) {
            throw new IllegalArgumentException(
                    "Only paused subscriptions can be resumed");
        }

        subscription.setStatus(SubscriptionStatus.ACTIVE);
        return subscriptionRepository.save(subscription);
    }

    // Close subscription
    public Subscription closeSubscription(Long id) {
        Subscription subscription = getSubscription(id);

        if (subscription.getStatus() == SubscriptionStatus.CLOSED) {
            throw new IllegalArgumentException(
                    "Subscription is already closed");
        }

        subscription.setStatus(SubscriptionStatus.CLOSED);
        return subscriptionRepository.save(subscription);
    }

    // Generate unique quotation and subscription numbers
    private String generateNumber(String prefix) {
        return prefix + "-" +
                UUID.randomUUID().toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}