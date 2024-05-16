package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class MatrixOperations {

    public static double[][] parseMatrix(String[] rowStrings, int numRows, int numCols) {
        double[][] matrix = new double[numRows][numCols];

        for (int i = 0; i < numRows; i++) {
            String[] elements = rowStrings[i].replaceAll("[{}]", "").split(",\\s*");
            for (int j = 0; j < numCols; j++) {
                matrix[i][j] = Double.parseDouble(elements[j]);
            }
        }

        return matrix;
    }

    public static String matrixToString(double[][] matrix) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < matrix.length; i++) {
            sb.append("{");
            for (int j = 0; j < matrix[i].length; j++) {
                sb.append(matrix[i][j]);
                if (j < matrix[i].length - 1) {
                    sb.append(", ");
                }
            }
            sb.append("}");
            if (i < matrix.length - 1) {
                sb.append(", ");
            }
        }

        return sb.toString();
    }

    public static String transposeMatrix(String matrixString, int numThreads) {
        String[] rowStrings = matrixString.split("\\},\\s*\\{");
        int numRows = rowStrings.length;
        int numCols = rowStrings[0].split(",").length;

        double[][] matrix = parseMatrix(rowStrings, numRows, numCols);

        double[][] transposedMatrix = new double[numCols][numRows];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numCols; i++) {
            final int colIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numRows; j++) {
                    transposedMatrix[colIndex][j] = matrix[j][colIndex];
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            // Ожидание завершения всех потоков
        }

        return matrixToString(transposedMatrix);
    }
    public static String addMatrices(String matrix1String, String matrix2String, int numThreads) {
        String[] rowStrings1 = matrix1String.split("\\},\\s*\\{");
        String[] rowStrings2 = matrix2String.split("\\},\\s*\\{");
        int numRows = rowStrings1.length;
        int numCols = rowStrings1[0].split(",").length;

        double[][] matrix1 = parseMatrix(rowStrings1, numRows, numCols);
        double[][] matrix2 = parseMatrix(rowStrings2, numRows, numCols);

        double[][] resultMatrix = new double[numRows][numCols];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numRows; i++) {
            final int rowIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numCols; j++) {
                    resultMatrix[rowIndex][j] = matrix1[rowIndex][j] + matrix2[rowIndex][j];
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            // Ожидание завершения всех потоков
        }

        return matrixToString(resultMatrix);
    }

    public static String multiplyMatrices(String matrix1String, String matrix2String, int numThreads) {
        String[] rowStrings1 = matrix1String.split("\\},\\s*\\{");
        String[] rowStrings2 = matrix2String.split("\\},\\s*\\{");
        int numRows1 = rowStrings1.length;
        int numCols1 = rowStrings1[0].split(",").length;
        int numRows2 = rowStrings2.length;
        int numCols2 = rowStrings2[0].split(",").length;

        double[][] matrix1 = parseMatrix(rowStrings1, numRows1, numCols1);
        double[][] matrix2 = parseMatrix(rowStrings2, numRows2, numCols2);

        if (numCols1 != numRows2) {
            throw new IllegalArgumentException("Matrix multiplication is impossible: wrong matrix sizes");
        }

        double[][] resultMatrix = new double[numRows1][numCols2];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numRows1; i++) {
            final int rowIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numCols2; j++) {
                    for (int k = 0; k < numCols1; k++) {
                        resultMatrix[rowIndex][j] += matrix1[rowIndex][k] * matrix2[k][j];
                    }
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            // Ожидание завершения всех потоков
        }

        return matrixToString(resultMatrix);
    }

    public static String multiplyMatrixByScalar(String matrixString, double scalar) {
        String[] rowStrings = matrixString.split("\\},\\s*\\{"); // Разделение на строки матрицы
        int numRows = rowStrings.length;
        int numCols = rowStrings[0].split(",").length;

        double[][] matrix = parseMatrix(rowStrings, numRows, numCols);

        double[][] resultMatrix = new double[numRows][numCols];

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < numCols; j++) {
                resultMatrix[i][j] = matrix[i][j] * scalar;
            }
        }

        return matrixToString(resultMatrix);
    }

    public static String findInverseMatrix(String matrixString, int numThreads) {
        try {
            String[] rowStrings = matrixString.split("\\},\\s*\\{");
            int numRows = rowStrings.length;
            int numCols = rowStrings[0].split(",").length;

            if (numRows != numCols) {
                return "Error: Matrix must be square to find the inverse";
            }

            double[][] matrix = parseMatrix(rowStrings, numRows, numCols);

            double[][] inverseMatrix = new double[numRows][numCols];

            // Вычисление определителя матрицы
            double determinant = calculateDeterminant(matrix, numRows);
            if (determinant == 0) {
                return "Error: Matrix is not invertible";
            }

            // Вычисление обратной матрицы
            ExecutorService executor = Executors.newFixedThreadPool(numThreads);
            for (int i = 0; i < numRows; i++) {
                final int rowIndex = i;
                executor.execute(() -> {
                    for (int j = 0; j < numCols; j++) {
                        inverseMatrix[rowIndex][j] = calculateCofactor(matrix, rowIndex, j) / determinant;
                    }
                });
            }
            executor.shutdown();
            while (!executor.isTerminated()) {
                // Ожидание завершения всех потоков
            }

            return matrixToString(inverseMatrix);
        } catch (IllegalArgumentException e) {
            return "Error: " + e.getMessage();
        } catch (Exception e) {
            return "Error: An unexpected error occurred: " + e.getMessage();
        }
    }

    private static double calculateDeterminant(double[][] matrix, int n) {
        if (n == 1) {
            return matrix[0][0];
        }
        if (n == 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        double det = 0;
        for (int i = 0; i < n; i++) {
            det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(getCofactorMatrix(matrix, 0, i), n - 1);
        }
        return det;
    }

    private static double calculateCofactor(double[][] matrix, int row, int col) {
        int n = matrix.length;
        return Math.pow(-1, row + col) * calculateDeterminant(getCofactorMatrix(matrix, row, col), n - 1);
    }

    private static double[][] getCofactorMatrix(double[][] matrix, int excludedRow, int excludedCol) {
        int n = matrix.length;
        double[][] cofactorMatrix = new double[n - 1][n - 1];
        int rowIndex = 0, colIndex = 0;
        for (int i = 0; i < n; i++) {
            if (i != excludedRow) {
                for (int j = 0; j < n; j++) {
                    if (j != excludedCol) {
                        cofactorMatrix[rowIndex][colIndex++] = matrix[i][j];
                    }
                }
                colIndex = 0;
                rowIndex++;
            }
        }
        return cofactorMatrix;
    }

}
