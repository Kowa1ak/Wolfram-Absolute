package com.stk.wolframabsolute.calculations;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class BasicOperations {

    ExecutorService exec;
    public String calcResult(int threads, String expression) {
        double resultExp = 0;
        String result = "";

        exec = Executors.newFixedThreadPool(threads);
        Expression e = new ExpressionBuilder(expression).build();
        Future<Double> future = e.evaluateAsync(exec);
        try {
            resultExp = future.get();
            result = Double.toString(resultExp);
        } catch (ExecutionException ex) {
            if (ex.getCause() instanceof ArithmeticException) {
                result = "Division by zero";
            } else {
                ex.printStackTrace();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            shutdownExecutor();
        }
        return result;
    }

    public void shutdownExecutor() {
        if (exec != null) {
            exec.shutdown();
        }
    }

}
