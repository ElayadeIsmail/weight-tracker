# Weight Tracker

Log daily weight and meals, then follow the trend. The app connects to Supabase for your account and saved logs. A meal photo is sent to a Supabase Edge Function, which uses Groq to estimate calories and macros.

## Supabase and AI meal estimates

Sign-in, weight logs, and meals are stored in Supabase. When you take or upload a meal photo, the app sends it to the `calories_estimate` function. That function only accepts a signed-in user, then asks a Groq vision model to read the photo and return calories, protein, carbs, fat, and fiber. You can still type a meal in by hand.

## Screenshots

<p align="center">
  <img src="docs/screenshots/today.png" width="220" alt="Today screen with latest weight 80.3 kg and today's calories" />
  <img src="docs/screenshots/add-weight.png" width="220" alt="Add weight screen with date, kilogram picker, and feeling chips" />
  <img src="docs/screenshots/calories.png" width="220" alt="Calories screen with daily target, macros, and trend range" />
  <img src="docs/screenshots/track-meal.png" width="220" alt="Track meal screen with take photo, upload photo, and manual entry" />
</p>

<p align="center">
  <img src="docs/screenshots/history.png" width="220" alt="History screen with weight entries by day" />
  <img src="docs/screenshots/history-screen.png" width="220" alt="Day detail with calorie and macro progress" />
  <img src="docs/screenshots/history-screen-scroll.png" width="220" alt="Day detail scrolled to a logged meal with photo" />
</p>

| Screen | What it shows |
| --- | --- |
| Today | Latest weight, today's calories, streak, and goal progress |
| Add weight | Date, weight picker, and how the day felt |
| Calories | Intake against the daily target, macros, and trend |
| Track meal | Photo capture, library upload, or manual entry |
| History | Weight logs by day, with edit and delete |
| Day | Calories and macros for one day |
| Meal | A logged meal with its photo and nutrition |
