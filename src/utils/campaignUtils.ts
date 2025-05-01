
export const distributeBudget = (totalBudget: number, imageCount: number): number[] => {
  if (imageCount === 0) return [];
  if (imageCount === 1) return [totalBudget];
  
  // Calculate average budget per image
  const averageBudget = Math.floor(totalBudget / imageCount);
  
  // Maximum variation allowed (30% of average)
  const maxVariation = Math.floor(averageBudget * 0.3);
  
  // Initialize with average budget
  const distribution = Array(imageCount).fill(averageBudget);
  
  // Track remaining budget to ensure we use exactly the total amount
  let remainingBudget = totalBudget - (averageBudget * imageCount);
  
  // Apply random variations within the 30% constraint
  for (let i = 0; i < imageCount && remainingBudget > 0; i++) {
    // Random variation between 0 and maxVariation
    const variation = Math.min(
      Math.floor(Math.random() * maxVariation),
      remainingBudget
    );
    
    distribution[i] += variation;
    remainingBudget -= variation;
  }
  
  // If there's still budget left, distribute it evenly
  if (remainingBudget > 0) {
    let i = 0;
    while (remainingBudget > 0) {
      distribution[i % imageCount] += 1;
      remainingBudget -= 1;
      i++;
    }
  }
  
  return distribution;
};
