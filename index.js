const API = (() => {
    const URL = "http://localhost:3000/events";

    const getEvents = () => {
        return fetch(URL).then((res) => res.json());
    };

    const postEvent = (newEvent) => {
        return fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent),
        }).then((res) => res.json());
    };

    const editEvent = (newEvent, id) => {
        console.log(id)

        return fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent),
        }).then((res) => res.json());
    };

    const removeEvent = (id) => {
        return fetch(`${URL}/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .catch(console.log);
    };

    return {
        getEvents,
        postEvent,
        removeEvent,
        editEvent
    };
})();

class EventModel {
    events;
    constructor() {
        this.events = [];
    }

    fetchEvents() {
        return API.getEvents().then(events => {
            this.setEvents(events);
            return events;
        })
    }

    addEvent(newEvent) {
        return API.postEvent(newEvent).then((addedEvent) => {
            this.events.push(addedEvent);
            return addedEvent;
        });
    }

    editEvent(newEvent, id) {
        const foundIndex = this.events.findIndex(x => x.id == id);
        this.events[foundIndex] = newEvent;


        return API.editEvent(newEvent, id).then((editedEvent) => {
            this.events.push(editedEvent);
            return editedEvent;
        });
    }

    removeEvent(id) {
        return API.removeEvent(id).then((removedEvent) => {
            this.events = this.events.filter((event) => event.id !== +id);

            return removedEvent;
        });
    }

    setEvents(events) {
        this.events = events;
    }

}

class EventView {
    constructor() {
        this.newEventToggle = false;
        this.editEventToggle = false;
        this.addEvent = document.querySelector(".event-list-app__add-btn");
        this.eventList = document.querySelector(".event-list");
        this.eventListForm = document.querySelector(".event-list-form");
        this.eventListTable = document.querySelector(".event-list-table");
    }


    renderEvents(events) {

        const eventsInnerHTML = events
            .map((event) => {
                return this.generateEvent(event);
            })
            .join("");

        this.eventList.innerHTML = eventsInnerHTML;
    }

    removeEventElem(domID) {
        const element = document.getElementById(domID);
        element.remove()
    }

    appendEvent(event) {
        const eventHTML = this.generateEvent(event);
        this.eventList.insertAdjacentHTML("beforeend", eventHTML);
    }

    hideEvent(id) {
        document.getElementById(`Event${id}`).hidden = true;
    }

    unhideEvent(id) {
        console.log(id)
        document.getElementById(`Event${id}`).hidden = false;
    }

    getClass(className) {
        return document.querySelector(`.${className}`)
    }

    getId(id) {
        return document.getElementById(`${id}`)
    }


    generateEvent(event) {
        return `
        <tr class="event" id="Event${event.id}">
        <td>${event.eventName}</td>
        <td>${event.startDate}</td>
        <td>${event.endDate}</td>
        <td><div class="event_action"><button type="button" class="event__edit_btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>  <button type="button" class="event__delete_btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button></div></td>
    </tr>`
    }

    newEvent() {
        return `
        <tr class="event-form">
            <td><input type="text" class="event-form__input_name" required/></td>
            <td><input type="date" class="event-form__input_start_date" required/></td>
            <td><input type="date" class="event-form__input_end_date" required/></td>
            <td><div class="event_action"><button type="submit" class="event-form__save-btn"><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></button> <button type="reset" class="event-form__cancel-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg></button></div></td>
        </tr>`
    }

    editEvent(event) {
        console.log(event)
        return `
        <tr class="event-form" id="EventEdit${event[0].id}">
        <td><input type="text" class="event-form__input_name" value="${event[0].eventName}" required/></td>
        <td><input type="date" class="event-form__input_start_date" value="${event[0].startDate}" required/></td>
        <td><input type="date" class="event-form__input_end_date" value="${event[0].endDate}" required/></td>
        <td><div class="event_action"><button type="submit" class="event-form__save-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg></button> <button type="reset" class="event-form__cancel-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg></button></div></td>
        </tr>
    `
    }
}

class EventController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.initialize();
    }

    initialize() {
        this.model.fetchEvents();
        this.setUpEvents();
        this.model.fetchEvents().then(events => {
            this.view.renderEvents(events);
        })
    }

    setUpEvents() {
        this.setUpAddEvent();
        this.setUpFormEvent();
        this.setUpRemoveEvent();
    }

    setUpFormEvent() {
        this.view.eventListForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (this.view.newEventToggle) {
                this.model
                    .addEvent({
                        eventName: this.view.getClass("event-form__input_name").value,
                        endDate: this.view.getClass("event-form__input_end_date").value,
                        startDate: this.view.getClass("event-form__input_start_date").value,
                    })
                    .then((data) => {
                        this.view.appendEvent(data);
                        this.view.newEventToggle = false;
                        this.view.getClass("event-form").remove();
                    });

            } else {
                this.model.editEvent({
                    eventName: this.view.getClass("event-form__input_name").value,
                    endDate: this.view.getClass("event-form__input_end_date").value,
                    startDate: this.view.getClass("event-form__input_start_date").value,
                }, this.view.editEventToggle).then((data) => {
                    this.view.appendEvent(data);
                    this.view.editEventToggle = false;
                    this.view.getId(`Event${data.id}`).remove();
                    this.view.getClass("event-form").remove();
                });
            }
        });
        this.view.eventListForm.addEventListener("reset", (e) => {
            e.preventDefault();
            if (this.view.newEventToggle) {
                this.view.newEventToggle = false;
            }
            else {
                this.view.unhideEvent(this.view.editEventToggle);
                this.view.editEventToggle = false;

            }
            this.view.getClass("event-form").remove();
        });

    }

    setUpRemoveEvent() {
        this.view.eventListForm.addEventListener("click", (e) => {
            if (e.target.classList.contains("event__delete_btn")) {
                const domID = e.target.parentNode.parentNode.parentNode.getAttribute("id");
                const id = domID.substring(5);
                this.model.removeEvent(id).then((data) => {
                    this.view.removeEventElem(domID)
                });
            }

            if (e.target.classList.contains("event__edit_btn")) {
                if (this.view.newEventToggle) {
                    if (confirm("You will lost all unsaved change, Do you wish to continue?")) {
                        this.view.newEventToggle = false;
                        this.view.getClass("event-form").remove();
                    }
                    else { return }
                }
                if (this.view.editEventToggle) {
                    if (confirm("You will lost all unsaved change, Do you wish to continue?")) {
                        console.log(this.view.editEventToggle)
                        this.view.unhideEvent(this.view.editEventToggle)

                        this.view.editEventToggle = false;
                        this.view.getClass("event-form").remove();

                    }
                    else { return }
                }
                const domID = e.target.parentNode.parentNode.parentNode.getAttribute("id");
                const id = domID.substring(5);
                this.view.editEventToggle = id;
                this.view.hideEvent(id)
                const event = this.model.events.filter(event => event.id == id);
                const editEventElem = this.view.editEvent(event)
                console.log(editEventElem)
                this.view.getId(domID).insertAdjacentHTML('afterend', editEventElem);
            }

        });
    }

    setUpAddEvent() {
        this.view.addEvent.addEventListener("click", () => {
            if (this.view.editEventToggle) {
                if (confirm("You will lost all unsaved change, Do you wish to continue?")) {
                    console.log(this.view.editEventToggle)
                    this.view.unhideEvent(this.view.editEventToggle)

                    this.view.editEventToggle = false;
                    this.view.getClass("event-form").remove();

                }
                else { return }
            }
            if (!this.view.newEventToggle) {
                this.view.newEventToggle = true;
                this.view.eventList.innerHTML += this.view.newEvent();
            }
        });
    }
}

API.getEvents().then(console.log);

const eventView = new EventView();
const eventModel = new EventModel();
const eventController = new EventController(eventView, eventModel);