package com.stk.wolframabsolute.calculations;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompoundInterestCalculator {
    private static final Logger logger = LogManager.getLogger(CompoundInterestCalculator.class);

    public static class YearlyInfo {
        public double initialAmount;
        public double additionalContributions;
        public double interest;

        public YearlyInfo(double initialAmount, double additionalContributions, double interest) {
            this.initialAmount = initialAmount;
            this.additionalContributions = additionalContributions;
            this.interest = interest;
        }
    }

    public List<YearlyInfo> calculate(double initialAmount, double additionalContributions, double interestRate, int contributionFrequency, int interestFrequency, int years) {
        logger.info("Starting compound interest calculation with initialAmount: {}, additionalContributions: {}, interestRate: {}, contributionFrequency: {}, interestFrequency: {}, years: {}",
                initialAmount, additionalContributions, interestRate, contributionFrequency, interestFrequency, years);

        double amount = initialAmount;
        List<YearlyInfo> yearlyInfos = new ArrayList<>();

        for (int i = 0; i < years; i++) {
            logger.debug("Year {}: Starting amount: {}", i + 1, amount);

            double yearlyContributions = 0;
            for (int j = 0; j < contributionFrequency; j++) {
                amount += additionalContributions;
                yearlyContributions += additionalContributions;
                logger.debug("Contribution {}: Total amount: {}", j + 1, amount);
            }

            double yearlyInterest = 0;
            for (int k = 0; k < interestFrequency; k++) {
                double interest = amount * (interestRate / interestFrequency);
                amount += interest;
                yearlyInterest += interest;
                logger.debug("Interest period {}: Interest: {}, Total amount: {}", k + 1, interest, amount);
            }

            YearlyInfo info = new YearlyInfo(amount - yearlyContributions - yearlyInterest, yearlyContributions, yearlyInterest);
            yearlyInfos.add(info);
            logger.info("Year {}: End amount: {}, Yearly contributions: {}, Yearly interest: {}", i + 1, amount, yearlyContributions, yearlyInterest);
        }

        logger.info("Compound interest calculation completed.");
        return yearlyInfos;
    }
}
