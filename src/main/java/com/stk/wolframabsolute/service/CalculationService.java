package com.stk.wolframabsolute.service;

import com.stk.wolframabsolute.controller.CalculationsController;
import com.stk.wolframabsolute.entity.Calculation;
import com.stk.wolframabsolute.repository.CalculationRepository;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CalculationService {
    private static final Logger logger = LogManager.getLogger(CalculationService.class);
    private CalculationRepository repository;

    public void addCalculation(Calculation calculation) {
        repository.save(calculation);
    }

    public List<Calculation> getCalculationsByEmail(String email) {
        List<Calculation> calculations = repository.findByEmail(email);
            if (calculations.isEmpty()) {
                logger.error("No calculations found for user with email: " + email);
                throw new IllegalArgumentException("No calculations found for user with email: " + email);
            }
        return calculations;
    }
}
