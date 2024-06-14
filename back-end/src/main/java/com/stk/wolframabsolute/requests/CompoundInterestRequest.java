package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class CompoundInterestRequest {
    double initialAmount; // первоначальная сумма
    double additionalContributions; // сумма пополнений
    double interestRate; // процентная ставка
    int contributionFrequency; // колв-во пополнений в год
    int interestFrequency; // частота начисления процентов (капитализация)
    int years; // кол-во лет
    String email;
    String library;
}
