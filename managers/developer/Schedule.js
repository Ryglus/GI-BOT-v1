const schedule = require('node-schedule');



/**
 * A class for scheduling tasks using cron expressions.
 */
class Scheduler {

    /**
     * Creates a new Scheduler instance.
     */
    constructor() {
        this.scheduledTasks = [];
    }
    /**
         * Schedule a task to run based on a cron expression.
         *
         * @param {string} crontime - The cron expression specifying when to run the task.
         * @param {Function} task - The function to be executed on the schedule.
    */
    addSchedule(crontime, task) {
        const job = schedule.scheduleJob(crontime, () => {
            task.Update(); // Call the provided task function
        });
        this.scheduledTasks.push(job);
    }
}

module.exports = new Scheduler();
