# fitbit_iso8601
new watch place

![iso8601_week_num-screenshot (1)](https://user-images.githubusercontent.com/82346707/194729520-215ec54a-7c5b-4878-90cf-d26630508833.png)



never used the step count, so switching to multiple algorithm evaluation. New 
algorithm (see image line two) has more power efficient algorithm. However, 
requires annual update of date tables (not hard, all done through excel)

03 oct 2022 
there's a bug in when the screen updates. it is 2022-w40, but both 
new and old algo not yet refreshed

08 oct 2022 
week num update code was not being called (global declaration incorrectly done)

09 oct 2022
just need to add a button. two bugs in this method:
 1. when changing apps (workout), then returning to main screen will clear week 
    num variable (something about how it's maintained)
 2. this fitbit randomly turns off. so have to wait until waking up or charging. 
    so probably can remove the charging refresh and just go to a button when it 
    fails to refresh
