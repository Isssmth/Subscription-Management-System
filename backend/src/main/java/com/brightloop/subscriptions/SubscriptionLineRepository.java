package com.brightloop.subscriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionLineRepository
        extends JpaRepository<SubscriptionLine, Long> {

    List<SubscriptionLine> findBySubscriptionId(Long subscriptionId);
}
