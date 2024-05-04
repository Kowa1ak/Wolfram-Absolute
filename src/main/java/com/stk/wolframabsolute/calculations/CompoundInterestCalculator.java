package com.stk.wolframabsolute.calculations;


import org.springframework.stereotype.Service;

@Service
public class CompoundInterestCalculator {

    public double calculate(double initialAmount, double additionalContributions, double interestRate, int contributionFrequency, int interestFrequency, int years) {
        double amount = initialAmount;
        for (int i = 0; i < years; i++) {
            for (int j = 0; j < contributionFrequency; j++) {
                amount += additionalContributions;
            }
            for (int k = 0; k < interestFrequency; k++) {
                amount += amount * (interestRate / interestFrequency);
            }
        }
        return amount;
    }
}
