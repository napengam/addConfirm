# addConfirm
Add modal confirm dialogs in hindsite

## A working demo is located at  <a href='https://hgsweb.de/addConfirm/'> https://hgsweb.de/addConfirm/</a>  
  
  
### NOTE:  

While deploying confirmation dialogs should ideally be planned during the design 
and analysis phase of application development, sometimes legacy code presents
unique challenges.

In one such scenario, I encountered a client’s legacy system heavily interspersed
with user interactions that warranted confirmation prompts. Refactoring the 
codebase would have been time-consuming and risked further complicating 
the already tangled code structure.

To avoid introducing additional complexity and \"spaghettifying\" the code, I 
devised the following workaround to implement confirmation dialogs in a 
minimally invasive way. Though it may not be the most elegant long-term 
solution, it provides an efficient stopgap for managing user confirmations 
without a complete overhaul.


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
  
Within ```addConfirm()``` all elements with a class need-confirm will be located and substituted by their clones.
Such a clone will capture the 'onclick' event and delegate it first to the confirm dialog of your choice.
If the confirmation is positiv/yes the 'onclick' event is fired again but this time the event is delegate to the original
node, that has the reference to the action to be executed.

For more details and explanation pleas look add teh sources for ```addConfirm().js``` 
