package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class SlauService {

    public double[] solveSlau(String equations, int numberOfThreads) throws Exception {
        // Разбираем входные данные
        String[] lines = equations.split("\\r?\\n");
        int n = lines.length;
        double[][] matrix = new double[n][n];
        double[] vector = new double[n];

        for (int i = 0; i < n; i++) {
            String[] parts = lines[i].split("\\s+");
            for (int j = 0; j < n; j++) {
                matrix[i][j] = Double.parseDouble(parts[j]);
            }
            vector[i] = Double.parseDouble(parts[n]);
        }

        // Создаем пул потоков
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);

        // Массив для хранения решений
        double[] solution = new double[n];

        // Создаем задачи для решения СЛАУ
        Future<double[]>[] futures = new Future[n];
        for (int i = 0; i < n; i++) {
            final int row = i;
            futures[i] = executor.submit(() -> {
                // Метод Гаусса для решения СЛАУ
                double[] x = new double[n];
                for (int j = row; j < n; j++) {
                    // Выбор главного элемента
                    int max = j;
                    for (int k = j + 1; k < n; k++) {
                        if (Math.abs(matrix[k][j]) > Math.abs(matrix[max][j])) {
                            max = k;
                        }
                    }

                    // Поменять местами строки
                    double[] temp = matrix[j];
                    matrix[j] = matrix[max];
                    matrix[max] = temp;

                    double t = vector[j];
                    vector[j] = vector[max];
                    vector[max] = t;

                    // Прямой ход
                    for (int k = j + 1; k < n; k++) {
                        double factor = matrix[k][j] / matrix[j][j];
                        vector[k] -= factor * vector[j];
                        for (int l = j; l < n; l++) {
                            matrix[k][l] -= factor * matrix[j][l];
                        }
                    }
                }

                // Обратный ход
                for (int j = n - 1; j >= 0; j--) {
                    double sum = 0.0;
                    for (int k = j + 1; k < n; k++) {
                        sum += matrix[j][k] * x[k];
                    }
                    x[j] = (vector[j] - sum) / matrix[j][j];
                }
                return x;
            });
        }

        // Сбор результатов
        for (int i = 0; i < n; i++) {
            double[] partialSolution = futures[i].get();
            for (int j = 0; j < n; j++) {
                solution[j] += partialSolution[j];
            }
        }

        // Завершаем работу пула потоков
        executor.shutdown();

        return solution;
    }
}