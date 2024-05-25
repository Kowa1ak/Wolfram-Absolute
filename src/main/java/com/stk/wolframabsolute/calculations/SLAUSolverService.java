package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class SLAUSolverService {

    public String solve(String input, int numThreads) throws Exception {
        String[] equations = input.split("\\}, \\{");
        int n = equations.length;
        double[][] matrix = new double[n][n + 1];

        for (int i = 0; i < n; i++) {
            String equation = equations[i].replaceAll("[\\{\\}]", "");
            String[] parts = equation.split(" \\| ");
            String[] coefficients = parts[0].split(", ");

            for (int j = 0; j < coefficients.length; j++) {
                matrix[i][j] = Double.parseDouble(coefficients[j]);
            }
            matrix[i][n] = Double.parseDouble(parts[1]);
        }

        long startTime = System.nanoTime();
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < n; i++) {
            int finalI = i;
            Future<?> future = executor.submit(() -> {
                // Partial pivoting
                int max = finalI;
                for (int k = finalI + 1; k < n; k++) {
                    if (Math.abs(matrix[k][finalI]) > Math.abs(matrix[max][finalI])) {
                        max = k;
                    }
                }

                // Swap rows
                double[] temp = matrix[finalI];
                matrix[finalI] = matrix[max];
                matrix[max] = temp;

                // Make upper triangular
                for (int j = finalI + 1; j < n; j++) {
                    double factor = matrix[j][finalI] / matrix[finalI][finalI];
                    for (int k = finalI; k <= n; k++) {
                        matrix[j][k] -= factor * matrix[finalI][k];
                    }
                }
            });
            future.get();
        }

        executor.shutdown();

        // Back substitution
        double[] results = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            double sum = 0.0;
            for (int j = i + 1; j < n; j++) {
                sum += matrix[i][j] * results[j];
            }
            results[i] = (matrix[i][n] - sum) / matrix[i][i];
        }

        StringBuilder sb = new StringBuilder();
        for (double result : results) {
            sb.append(result).append(" ");
        }

        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        double durationInSeconds = duration / 1_000_000_000.0;

        return sb.toString().trim() + ", Time: " + durationInSeconds + " seconds";
    }
}
