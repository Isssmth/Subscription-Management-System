package com.brightloop.subscriptions;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SubscriptionDtos {

    public record LineRequest(

            @NotNull
            Long productId,

            @NotNull
            Long variantId,

            @NotNull
            Long priceId,

            @Min(1)
            int quantity,

            @NotNull
            @DecimalMin("0.01")
            BigDecimal unitPrice

    ) {}

    public record CreateQuotationRequest(

            @NotNull
            Long customerId,

            @NotNull
            Long planId,

            @NotNull
            LocalDate validityDate,

            @NotEmpty
            List<@NotNull LineRequest> lines

    ) {}

    public record ConfirmQuotationRequest(

            @NotNull
            LocalDate startDate,

            @NotNull
            BillingInterval billingInterval,

            boolean autoRenew

    ) {}
}
