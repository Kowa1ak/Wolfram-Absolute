package com.stk.wolframabsolute.calculations;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class CompoundInterestCalculator {
    private static final Logger logger = LogManager.getLogger(CompoundInterestCalculator.class);
    public double calculate(double initialAmount, double additionalContributions, double interestRate, int contributionFrequency, int interestFrequency, int years) {
        logger.info("Starting compound interest calculation with initialAmount: {}, additionalContributions: {}, interestRate: {}, contributionFrequency: {}, interestFrequency: {}, years: {}",
                initialAmount, additionalContributions, interestRate, contributionFrequency, interestFrequency, years);
        double amount = initialAmount;
        try {
            for (int i = 0; i < years; i++) {
                for (int j = 0; j < contributionFrequency; j++) {
                    amount += additionalContributions;
                }
                for (int k = 0; k < interestFrequency; k++) {
                    amount += amount * (interestRate / interestFrequency);
                }
            }
            logger.info("Calculation completed. Final amount: {}", amount);
        } catch (Exception ex) {
            logger.error("Exception occurred during calculation", ex);
        }
        return amount;
    }
}
