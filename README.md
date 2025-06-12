
## A working demo is located at  <a href='https://hgsweb.de/addConfirm/'> https://hgsweb.de/addConfirm/</a>  
  
### NOTE:  

The solution described here is probably not the recommended way to deploy confirmation  
dialogs. You should think about this upfront during the analysis/design phase of your application.

I came up with this  *workoaround* when confronted with a clients legacy code,  littered  
with user interactions that deserved a confirmation. Rewriting the code would take to long and  
would further 'spaghettize' the given code, so here you go.


<br> 

# Explanation:

### Problem:

In the given legacy code, instrument HTML elements having the `onclick` attribute   
referring to dangerous functions with confirm dialogs before performing the action.

### Example:

```html
<a class='doit need-confirm' href='changeSalary.html'>Do it!</a>
<button id='b1' class='need-confirm' onclick='deleteCustomer()'>Delete customer</button>
```
### Solution:

Add or extend the class list of the html elements in question with a dummy class need-confirm like :
```html
<a class='doit need-confirm' href='changeSalary.html'>Do it !</a>
<button id='b1' class='need-confirm' onclick='deleteCustomer()'>Delete customer </button>
```
Add:

```html
<script src='addConfirm.js'></script>
<script>addConfirm()</script>
```

## High level of how it works:  
  
- Binds a capture-phase click listener on each matching element.
- Prevents default behavior, stops propagation.
- Shows the confirmation dialog.
- If user clicks "Yes":
Temporarily disables the interceptor.
Redispatches the original click event to trigger native behavior.
Re-enables the interceptor.
- If user clicks "No": closes the dialog silently.

For more details and explanation pleas look add teh sources for ```addConfirm().js``` 
