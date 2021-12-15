

export const BUBBLE_SORT = 0;
export const SELECTION_SORT = 1;
export const INSERTION_SORT = 2;
export const QUICK_SORT = 3;

export class Algorithms{

    constructor(values){
        this.values = values;
        this.algo_time = 0;
        this.num_iter = 0;
        this.id = BUBBLE_SORT;
    }

    /*
    SETUP FUNCTIONS
    */

    setAlgo(id, new_values)
    {
        this.id = id;
        this.restart(new_values);
    }

    restart(new_values)
    {
        this.values = new_values;
        this.algo_time = 0;
        this.num_iter = 0;
    }

    /*
        STATISTICS GETTERS
     */
    algoTime(){return this.algo_time;}
    numIter(){return this.num_iter;}
    currentAlgo()
    {
        switch(this.id){
            case BUBBLE_SORT:
                return "Bubble Sort";
            case SELECTION_SORT:
                return "Selection Sort";
            case INSERTION_SORT:
                return "Insertion Sort";
            case QUICK_SORT:
                return "Quick Sort";
        }
    }

    getSolution()
    {
        switch(this.id){
            case BUBBLE_SORT:
                return this.bubbleSort();
            case SELECTION_SORT:
                return this.selectionSort();
            case INSERTION_SORT:
                return this.insertionSort();
            case QUICK_SORT:
                return this.quickSortRec();
        }
    }

    /*
    AUXILIARY FUNCTIONS
    */

    swap(j, i) //Swaps elements by their indexes in values array.
    {
        var aux = this.values[j];
        this.values[j] = this.values[i];
        this.values[i] = aux;
    }

    /*
    ALGO FUNCTIONS
    */

    bubbleSort()
    {  

        let queue = [];

        this.algo_time = performance.now();

        //For each element, compares to its neighbohor
        for (var i = 0; i < this.values.length-1; i++)
        {
            this.num_iter +=1; // Statistics gathering

            for (var j = 0; j < this.values.length-i-1; j++)
            {
                this.num_iter +=1; // Statistics gathering

                //If greater, sends to the right
                if (this.values[j] > this.values[j+1])
                {
                    this.swap(j, j+1);
                    queue.push([j+1, j]);
                }
            }
        
        }

        this.algo_time = performance.now() - this.algo_time; // Total time until BS sorted.

        // The steps queue.
        return queue;
    }


    selectionSort()
    {
        var i, j, min;
        let queue = [];

        this.algo_time = performance.now();
    
        for (i = 0; i < this.values.length-1; i++)
        {
            this.num_iter +=1; // Statistics gathering

            // get the smallest element
            min = i;
            for (j = i + 1; j < this.values.length; j++){

                this.num_iter +=1; // Statistics gathering

                if (this.values[j] < this.values[min])
                    min = j;
            }

            // swaps the minimum with element
            this.swap(i, min);
            queue.push([min, i]);
        }

        this.algo_time = performance.now() - this.algo_time; // Total time until SS sorted.

        return queue;
    }

    insertionSort()
    {
        let queue = [];

        this.algo_time = performance.now();

        //Compares neighboring elements
        for(let i = 1; i < this.values.length;i++){

            this.num_iter +=1; // Statistics gathering

            for(let j = i - 1; j > -1; j--){

                this.num_iter +=1;

                //Swaps if greater
                if(this.values[j + 1] < this.values[j]){
                    this.swap(j+1, j);
                    queue.push([j+1, j]);
                }
            }
        };

        this.algo_time = performance.now() - this.algo_time; // Total time until IS sorted.
    
      return queue;
    }


    /** QUICK SORT FUNCTIONS */

    quickSortRec()
    {

        this.algo_time = performance.now();

        let queue = [];
        queue = this.quickSort(queue, 0, this.values.length-1);

        this.algo_time = performance.now() - this.algo_time;

        return queue;
    }

    quickSort(queue, small, big){
        var pivot, partition_i;

        this.num_iter +=1; // Statistics gathering

       if(small < big){
         pivot = big;
         partition_i = this.partition(queue, pivot, small, big);
         
        //sort left and right
        this.quickSort(queue, small, partition_i - 1);
        this.quickSort(queue, partition_i + 1, big);
       }
       return queue;
     }

    partition(queue, pivot, small, big){
        var pivot_value = this.values[pivot],
            partition_i = small;
     
        for(var i = small; i < big; i++){

            this.num_iter +=1; // Statistics gathering

         if(this.values[i] < pivot_value){
           this.swap(i, partition_i);
           queue.push([i, partition_i]);
           partition_i++;
         }
       }
       this.swap(big, partition_i);
       queue.push([big, partition_i]);
       return partition_i;
    }
}


