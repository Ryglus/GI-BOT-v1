

var events=[]
class Events {
    constructor() {

    }
    addEvent(event) {
        events[events.length]= event;
    }
    Event(event) {
        events.forEach((e) => {
            e.getEvents().forEach((k) => {
                var acceptibleEvent = true;
                Object.keys(k).forEach((ev) => {
                    if (ev.includes(".") && acceptibleEvent) {
                        // Split the property path by periods
                        const segments = ev.split(".");
                        let nestedValue = event;
                        // Traverse the nested object
                        for (const segment of segments) {
                            if (nestedValue && typeof nestedValue === "object" && segment in nestedValue) {                  
                                nestedValue = nestedValue[segment];
                            } else {
                                nestedValue = undefined;
                                break;
                            }
                        }          
                        // Check if the nested value matches
                        if (nestedValue === k[ev]) {
                            acceptibleEvent = true;
                            //console.log(ev,k[ev], true);
                        } else {
                            acceptibleEvent = false;
                            //console.log(ev,k[ev], false);
                        }
                    } else {              
                        if (k[ev] == event[ev] && acceptibleEvent) {
                            acceptibleEvent = true;
                            //console.log(ev,k[ev], true);
                        } else {
                            acceptibleEvent = false;
                            //console.log(ev,k[ev], false);
                        }
                    }
                });
                if (acceptibleEvent) {
                    e.onEventUpdate(event);
                }
            });
        });
    }
}

module.exports = new Events();