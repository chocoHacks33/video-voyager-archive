
export const distributeBudget = (totalBudget: number, imageCount: number): number[] => {
  if (imageCount === 0) return [];
  if (imageCount === 1) return [totalBudget];
  
  const baseBudgetPool = totalBudget * 0.7;
  const baseBudget = Math.floor(baseBudgetPool / imageCount);
  const distribution = Array(imageCount).fill(baseBudget);
  let toDistribute = totalBudget - (baseBudget * imageCount);
  
  while (toDistribute > 0) {
    for (let i = 0; i < imageCount && toDistribute > 0; i++) {
      const maxExtra = Math.min(toDistribute, Math.floor(baseBudget * 0.3));
      const extra = Math.floor(Math.random() * maxExtra);
      distribution[i] += extra;
      toDistribute -= extra;
    }
    if (toDistribute > 0 && toDistribute < imageCount) {
      const randomIndex = Math.floor(Math.random() * imageCount);
      distribution[randomIndex] += toDistribute;
      toDistribute = 0;
    }
  }
  
  return distribution.sort(() => Math.random() - 0.5);
};
