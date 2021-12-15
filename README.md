# SortingAlgos Visualized 

Developed by Luiz François.

This application comopares four different types of well known sorting algorithms: BubbleSort, InsertionSort, SelectionSort and QuickSort. The objective is show, step by step, what the code is doing by simulating a random set of elements, each with its own value. The user can choose the desired algorithm and see, in real time, the process of position swapping that the code does in the background. Built with JavaScript, WEBGL and CSS.

---

 ## 1. Installation and Set-up

Clone down this repository. You will need `npm` installed globally on your machine for local server.

Installation:

`npm install`  

To Run Test Suite:  

`npm test`  

To Start Server:

`npm start`  

To Visit App:

`localhost:3000/index.html`  

---

## 3. Commands Manual

The applications page features a simpple controller, in wich the user can choose the sorting preferences:

* `Boxes Size #`: A selection of each element of the visual interface. The bigger it is, the less elements will be generated, so that all can appear in screen. For a larger set, it is recommended the size of 1.

* `Animation Speed #`: changes the velocity in wich the elements do the swap during the sorting. Can be changed while sorting is running.

* `Random Set #`: By clicking this button, a randomly generated set of values will be presented to the user. The set is yet to be sorted. Multiple sets can be generated, and after each sort, the user can choose a different algorithm by generating a different set.

* `Algo Selection Box #`: lets the user choose what algorithm should be applied to sort the set. To choose a different algo while sorting or sorted, the user must generate a new random set.



