```java
public class SlidingWindow {
    
    public int slidingWindow(int[] nums, int k) {
        int n = nums.length;
        if (n == 0 || k == 0) {
            return 0;
        }
        
        int maxSum = 0;
        int windowSum = 0;
        
        // 计算初始窗口的和
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        
        maxSum = windowSum;
        
        // 滑动窗口
        for (int i = k; i < n; i++) {
            windowSum = windowSum - nums[i - k] + nums[i];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
}
```