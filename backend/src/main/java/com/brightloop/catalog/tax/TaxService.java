package com.brightloop.catalog.tax;

import com.brightloop.catalog.tax.dto.TaxRequest;
import com.brightloop.catalog.tax.dto.TaxResponse;
import com.brightloop.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaxService {

    private final TaxRepository taxRepository;

    public TaxService(TaxRepository taxRepository) {
        this.taxRepository = taxRepository;
    }

    @Transactional(readOnly = true)
    public List<TaxResponse> getAllTaxes(Boolean activeOnly) {
        List<Tax> taxes;
        if (Boolean.TRUE.equals(activeOnly)) {
            taxes = taxRepository.findByActive(true);
        } else {
            taxes = taxRepository.findAll();
        }

        return taxes.stream()
                .map(TaxResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaxResponse getTaxById(Long id) {
        Tax tax = taxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));
        return TaxResponse.fromEntity(tax);
    }

    public TaxResponse createTax(TaxRequest request) {
        Tax tax = new Tax();
        tax.setName(request.getName().trim());
        tax.setRate(request.getRate());
        tax.setActive(request.getActive() != null ? request.getActive() : true);

        Tax saved = taxRepository.save(tax);
        return TaxResponse.fromEntity(saved);
    }

    public TaxResponse updateTax(Long id, TaxRequest request) {
        Tax tax = taxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));

        tax.setName(request.getName().trim());
        tax.setRate(request.getRate());
        if (request.getActive() != null) {
            tax.setActive(request.getActive());
        }

        Tax saved = taxRepository.save(tax);
        return TaxResponse.fromEntity(saved);
    }

    public TaxResponse toggleActive(Long id) {
        Tax tax = taxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));
        tax.setActive(!tax.isActive());
        Tax saved = taxRepository.save(tax);
        return TaxResponse.fromEntity(saved);
    }

    public void deleteTax(Long id) {
        Tax tax = taxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));
        taxRepository.delete(tax);
    }
}

