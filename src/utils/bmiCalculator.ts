// BMI Calculator Utilities

/**
 * Calculate BMI from weight and height
 */
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height || height === 0) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Get BMI category and color
 */
export const getBMICategory = (
  bmi: number
): {
  category: string;
  color: string;
  description: string;
} => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3498db',
      description: 'Below normal weight range',
    };
  }
  if (bmi < 25) {
    return {
      category: 'Normal',
      color: '#27ae60',
      description: 'Healthy weight range',
    };
  }
  if (bmi < 30) {
    return {
      category: 'Overweight',
      color: '#f39c12',
      description: 'Above normal weight range',
    };
  }
  return {
    category: 'Obese',
    color: '#e74c3c',
    description: 'Significantly above normal weight range',
  };
};

