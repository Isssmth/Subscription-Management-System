package com.brightloop.subscriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QuotationRepository
        extends JpaRepository<Quotation, Long> {

    Optional<Quotation> findByQuotationNumber(String quotationNumber);

    boolean existsByQuotationNumber(String quotationNumber);
}
