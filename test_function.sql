-- First, let's see current points
SELECT user_id, points, is_pro FROM user_points;

-- Try to deduct points (replace USER_ID with an actual UUID from your table)
SELECT deduct_point('YOUR_USER_ID_HERE', 1) as deduction_success;

-- Check if points were deducted
SELECT user_id, points, is_pro FROM user_points; 