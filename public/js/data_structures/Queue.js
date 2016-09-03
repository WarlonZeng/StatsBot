"use strict";

module.exports = class Queue {
    constructor() {
        this.front = 0;
        this.back = -1
        this.reset_back = 0;
        this.line = {};
    }

    size() {
        return (this.back - this.front) + 1;
    }

    enqueue(data) { // void
        this.back++; // this.back = 1001
        if (this.back > 1000) { // if this.back = 1001
            this.reset_back = this.back;
            this.back = 0; // this.back = 0
        }
        this.line[this.back] = data;
    };

    dequeue() { // void
        if (this.front == this.reset_back) { // if this.front = 1001
            this.front = 0;
        }
        delete this.line[this.front];
        this.front++; // this.front = 1001
    };
}
