package com.brightloop.subscriptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // ---------------- QUOTATION APIs ----------------

    @PostMapping("/quotations")
    @ResponseStatus(HttpStatus.CREATED)
    public Quotation createQuotation(
            @Valid @RequestBody SubscriptionDtos.CreateQuotationRequest request) {

        return subscriptionService.createQuotation(request);
    }

    @GetMapping("/quotations")
    public List<Quotation> getAllQuotations() {
        return subscriptionService.getAllQuotations();
    }

    @GetMapping("/quotations/{id}")
    public Quotation getQuotation(@PathVariable Long id) {
        return subscriptionService.getQuotation(id);
    }

    @PutMapping("/quotations/{id}/confirm")
    public Subscription confirmQuotation(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionDtos.ConfirmQuotationRequest request) {

        return subscriptionService.confirmQuotation(id, request);
    }

    // ---------------- SUBSCRIPTION APIs ----------------

    @GetMapping("/subscriptions")
    public List<Subscription> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/subscriptions/{id}")
    public Subscription getSubscription(@PathVariable Long id) {
        return subscriptionService.getSubscription(id);
    }

    @GetMapping("/subscriptions/customer/{customerId}")
    public List<Subscription> getSubscriptionsByCustomer(
            @PathVariable Long customerId) {

        return subscriptionService.getSubscriptionsByCustomer(customerId);
    }

    @GetMapping("/subscriptions/{id}/lines")
    public List<SubscriptionLine> getSubscriptionLines(
            @PathVariable Long id) {

        return subscriptionService.getSubscriptionLines(id);
    }

    @PutMapping("/subscriptions/{id}/activate")
    public Subscription activateSubscription(@PathVariable Long id) {
        return subscriptionService.activateSubscription(id);
    }

    @PutMapping("/subscriptions/{id}/pause")
    public Subscription pauseSubscription(@PathVariable Long id) {
        return subscriptionService.pauseSubscription(id);
    }

    @PutMapping("/subscriptions/{id}/resume")
    public Subscription resumeSubscription(@PathVariable Long id) {
        return subscriptionService.resumeSubscription(id);
    }

    @PutMapping("/subscriptions/{id}/close")
    public Subscription closeSubscription(@PathVariable Long id) {
        return subscriptionService.closeSubscription(id);
    }
}