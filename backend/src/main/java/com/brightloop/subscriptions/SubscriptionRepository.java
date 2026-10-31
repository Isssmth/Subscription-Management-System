package com.brightloop.subscriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository
        extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findBySubscriptionNumber(
            String subscriptionNumber);

    List<Subscription> findByCustomerId(Long customerId);

    List<Subscription> findByStatus(SubscriptionStatus status);

    boolean existsBySubscriptionNumber(String subscriptionNumber);
}
