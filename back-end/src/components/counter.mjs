/**
 * Creates a new instance of the Counter class.
 * @param counter_id - The counter identifier inside the database
 * @param counter_name - The name of the counter
 */
class Counter {
    constructor(counter_id, counter_name) {
        this.counter_id = counter_id;
        this.counter_name = counter_name;
    }
}
export default Counter;