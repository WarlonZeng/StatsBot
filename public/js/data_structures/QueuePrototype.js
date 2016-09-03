// don't use this.. it is prototype version for class.. 

//function Queue() {
//    this.front = 0; // oldest
//    this.back = -1; // newest
//    this.reset_back = 0;
//    this.storage = {}; 
//}

//Queue.prototype.size = function () {
//    return (this.back - this.front) + 1;
//};

//Queue.prototype.enqueue = function (data) { // void
//    this.back++; // this.back = 1001
//    if (this.back > 1000) { // if this.back = 1001
//        this.reset_back = this.back;
//        this.back = 0; // this.back = 0
//    }
//    this.storage[this.back] = data;
//};

//Queue.prototype.dequeue = function () { // void

//    if (this.front == this.reset_back) { // if this.front = 1001
//        this.front = 0;
//    }
//    delete this.storage[this.front];
//    this.front++; // this.front = 1001
//};