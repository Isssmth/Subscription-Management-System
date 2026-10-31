package com.brightloop.catalog.tax;

import com.brightloop.catalog.tax.dto.TaxRequest;
import com.brightloop.catalog.tax.dto.TaxResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaxServiceTest {

    @Mock
    private TaxRepository taxRepository;

    @InjectMocks
    private TaxService taxService;

    private Tax gstTax;

    @BeforeEach
    void setUp() {
        gstTax = new Tax("GST 18%", new BigDecimal("18.00"), true);
        gstTax.setId(1L);
    }

    @Test
    void createTax_ShouldSaveAndReturnResponse() {
        when(taxRepository.save(any(Tax.class))).thenReturn(gstTax);

        TaxRequest req = new TaxRequest("GST 18%", new BigDecimal("18.00"), true);
        TaxResponse res = taxService.createTax(req);

        assertThat(res.getId()).isEqualTo(1L);
        assertThat(res.getName()).isEqualTo("GST 18%");
        assertThat(res.getRate()).isEqualByComparingTo(new BigDecimal("18.00"));
        assertThat(res.isActive()).isTrue();
    }

    @Test
    void getAllTaxes_ActiveOnly_ShouldFilter() {
        when(taxRepository.findByActive(true)).thenReturn(List.of(gstTax));

        List<TaxResponse> res = taxService.getAllTaxes(true);

        assertThat(res).hasSize(1);
        verify(taxRepository, times(1)).findByActive(true);
    }

    @Test
    void toggleActive_ShouldToggleStatus() {
        when(taxRepository.findById(1L)).thenReturn(Optional.of(gstTax));
        when(taxRepository.save(any(Tax.class))).thenAnswer(i -> i.getArgument(0));

        TaxResponse res = taxService.toggleActive(1L);

        assertThat(res.isActive()).isFalse();
    }
}

