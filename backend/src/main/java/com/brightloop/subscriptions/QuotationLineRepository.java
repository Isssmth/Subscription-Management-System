package com.brightloop.subscriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationLineRepository
        extends JpaRepository<QuotationLine, Long> {

    List<QuotationLine> findByQuotationId(Long quotationId);
}

