package com.brightloop.catalog.tax;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxRepository extends JpaRepository<Tax, Long> {

    List<Tax> findByActive(boolean active);

    List<Tax> findByNameContainingIgnoreCase(String name);
}

