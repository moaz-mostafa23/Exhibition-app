import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData, query, where } from 'firebase/firestore';
import { Observable, of, combineLatest, pipe, from, } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from './utility.service';


export interface Event {
  agenda: string;
  client_id: string;
  end_date: string;
  hall_id: string;
  name: string;
  picture: string;
  start_date: string;
  status: string;
  hall_name: void;
}


export interface Hall {
  booth_fiting: string;
  capacity: string;
  contact_info: string;
  name: string;
  floor_plan: string;
  start_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  public events$: Observable<DocumentData[]> = this.getDocuments('events');


  constructor(private firestore: Firestore, private utilityService : UtilityService) { }

  async createDocument(collectionName: string, data: any): Promise<DocumentReference<DocumentData> | any> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collectionRef, data);

      // Access the generated document ID
      console.log('Document ID:', docRef.id);

      return docRef;
    } catch (error) {
      console.error("Error creating document: ", error);
    }
  }


  // Get all documents from a collection as an Observable
  getDocuments<T>(collectionName: string): Observable<T[]> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>; // Optionally specify an ID field
    } catch (error) {
      console.error("Error getting documents: ", error);
      return of([]);
    }
  }

  // get a single document by query
  async getDocumentByQuery(collectionName: string, field: string, value: any): Promise<DocumentData | null> {
    try {
      // Create a query to find the document based on the specified field and value
      const q = query(collection(this.firestore, collectionName), where(field, '==', value));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // If there is a document matching the query, return its data
      if (querySnapshot.docs.length > 0) {
        const documentData = querySnapshot.docs[0].data() as DocumentData;
        return documentData;
      } else {
        return null; // No document found with the specified query
      }
    } catch (error) {
      console.error("Error getting document by query: ", error);
      throw error;
    }
  }

  // get all documents matching query
  async getDocumentsByQuery(collectionName: string, field: string, value: any): Promise<DocumentData[]> {
    try {
      // Create a query to find the documents based on the specified field and value
      const q = query(collection(this.firestore, collectionName), where(field, '==', value));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Create an array to store the documents data
      let documentsData: DocumentData[] = [];

      // If there are documents matching the query, add their data to the array
      querySnapshot.forEach((doc) => {
        documentsData.push(doc.data() as DocumentData);
      });

      return documentsData;
    } catch (error) {
      console.error("Error getting documents by query: ", error);
      throw error;
    }
  }


  // Get a specific document by its ID
  async getDocumentById(collectionName: string, documentId: string): Promise<DocumentData | any> {
    try {
      const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
      const docSnapshot = await getDoc(documentRef);
      if (docSnapshot.exists()) {
        return docSnapshot.data() as DocumentData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  }


  // Update a document by its ID
  async updateDocument(collectionName: string, documentId: string, data: any): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
      await updateDoc(documentRef, data);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }

  // Update a document based on a query
  async updateDocumentByQuery(collectionName: string, field: string, value: any, newData: any): Promise<void> {
    try {
      // Create a query to find the document based on the specified field and value
      const q = query(collection(this.firestore, collectionName), where(field, '==', value));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Iterate through the results and update each document
      querySnapshot.forEach(async (doc) => {
        const documentRef: DocumentReference<DocumentData> = doc.ref;

        // Use the updateDoc function to update the document
        await updateDoc(documentRef, newData);

        console.log('Document updated successfully');
      });
    } catch (error) {
      console.error("Error updating document by query: ", error);
    }
  }

  // Delete a document by its ID
  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  // Delete a document based on a query
  async deleteDocumentByQuery(collectionName: string, field: string, value: any): Promise<void> {
    try {
      // Create a query to find the document based on the specified field and value
      const q = query(collection(this.firestore, collectionName), where(field, '==', value));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Iterate through the results and delete each document
      querySnapshot.forEach(async (doc) => {
        const documentRef: DocumentReference<DocumentData> = doc.ref;

        // Use the deleteDoc function to delete the document
        await deleteDoc(documentRef);

        console.log('Document deleted successfully');
      });
    } catch (error) {
      console.error("Error deleting document by query: ", error);
    }
  }

  // Delete all documents in a collection
  async deleteCollection(collectionName: string): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const snapshot = await getDocs(collectionRef);
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting collection: ", error);
    }
  }

  async getEventDetails(eventName : string) : Promise<DocumentData>{
    let myDoc : DocumentData = {} as Event;
    try{
      const collectionRef = collection(this.firestore, 'events');
      const q = query(collectionRef, where("name", "==", eventName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        myDoc = doc.data();
      });
    }catch(err){
      console.log(err);
    }
    return myDoc;
  }

  async getDocumentIdByUniqueKey(collectionName: string, uniqueKey: string, value: string): Promise<string | null> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const q = query(collectionRef, where(uniqueKey, '==', value));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        return snapshot.docs[0].id; // Get the ID of the first document matching the name
      } else {
        return null; // No document found with the given name
      }
    } catch (error) {
      console.error(`Error getting document ID: ${error}`);
      return null;
    }
  }

  async getRegisterationByAttendeeId(attendeeId: string): Promise<DocumentData[]> {
    try {
      // Create a query to find the documents based on the attendee_id
      const q = query(collection(this.firestore, 'registrations'), where('attendee_id', '==', attendeeId));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Create an array to store the event data
      let events: DocumentData[] = [];

      // Iterate through the results and add each event data to the array
      querySnapshot.forEach((doc) => {
        events.push(doc.data() as DocumentData);
      });

      return events;
    } catch (error) {
      console.error("Error getting registered events by attendee ID: ", error);
      return [];
    }
  }

  async getEventsByIds(eventIds: string[]): Promise<DocumentData[]> {
    try {
      // Create an array to store the event data
      let events: DocumentData[] = [];

      // Iterate through the array of event IDs
      for (const eventId of eventIds) {
        // Get the event data for each ID
        const eventData = await this.getDocumentById('events', eventId);

        // If the event data exists, add it to the array
        if (eventData) {
          events.push(eventData);
        }
      }

      return events;
    } catch (error) {
      console.error("Error getting events by IDs: ", error);
      return [];
    }
  }

  async deleteRegisteration(eventId: string, attendeeId: string): Promise<void> {
    try {
      // Create a query to find the document based on the eventId and attendeeId
      const q = query(collection(this.firestore, 'registrations'), where('event_id', '==', eventId), where('attendee_id', '==', attendeeId));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Iterate through the results and delete each document
      querySnapshot.forEach(async (doc) => {
        const documentRef: DocumentReference<DocumentData> = doc.ref;

        // Use the deleteDoc function to delete the document
        await deleteDoc(documentRef);

        console.log('Document deleted successfully');
      });
    } catch (error) {
      console.error("Error deleting registered event: ", error);
    }
  }

  async getEventsByClientId(clientId: string): Promise<DocumentData[]> {
    try {
      // Create a query to find the documents based on the client_id
      const q = query(collection(this.firestore, 'events'), where('client_id', '==', clientId));

      // Execute the query
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      // Create an array to store the event data
      let events: DocumentData[] = [];

      // Iterate through the results and add each event data to the array
      querySnapshot.forEach((doc) => {
        events.push(doc.data() as DocumentData);
      });

      return events;
    } catch (error) {
      console.error("Error getting events by client ID: ", error);
      return [];
    }
  }

  async isEventReserved(start_date: string, end_date: string, hallId: string): Promise<string> {
    // Convert the start and end dates to JavaScript Date objects
    const eventStartDate = new Date(start_date);
    const eventEndDate = new Date(end_date);
  
    // Check if the start date is later than the end date
    if (eventStartDate > eventEndDate) {
      // Start date is later than end date
      return 'Reserved';
    }
  
    // Create a query to find the events in the same hall
    const q = query(collection(this.firestore, 'events'), where('hall_id', '==', hallId));
  
    // Execute the query
    const querySnapshot = await getDocs(q);
  
    // Check each event for a date conflict
    for (let doc of querySnapshot.docs) {
      const eventData = doc.data();
      const eventStart = eventData['start_date'].toDate();
      const eventEnd = eventData['end_date'].toDate();
  
      // Check if the new event's date range overlaps with the existing event's date range
      if ((eventStartDate >= eventStart && eventStartDate <= eventEnd) || 
          (eventEndDate >= eventStart && eventEndDate <= eventEnd)) {
        // Date conflict found
        return 'Reserved';
      }
    }
  
    // No date conflict found
    return 'Not reserved';
  }
  
  getAllDocumentsByCollectionUsingPromise(collectionName: string): Promise<DocumentData[]> {
    return new Promise<DocumentData[]>((resolve, reject) => {
      getDocs(collection(this.firestore, collectionName))
        .then((querySnapshot: QuerySnapshot<DocumentData>) => {
          const documents = querySnapshot.docs.map(doc => doc.data());
          resolve(documents);
        })
        .catch((error: any) => {
          console.error("Error getting documents: ", error);
          reject(error);
        });
    });
  }

  async getAttendeeHomeEvents() : Promise<Event[]>{
    let events : Event[] = [];
    try {
      const collectionRef = collection(this.firestore, 'events');
      const q = query(collectionRef, where("status", "==", "approved"));
      const querySnapshot = await getDocs(q);

    querySnapshot.forEach(
        (doc) => {
          let event = doc.data() as Event;
          event.start_date = this.utilityService.convertFirebaseTimestamp(event.start_date);
          event.end_date =  this.utilityService.convertFirebaseTimestamp(event.end_date);
          events.push(event);
          // console.log("date after editing: " + event.start_date);
        }
      );
      return events;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  }

async getEventsByHallID(hallId: string): Promise<any[]> {
  // Get the document ID of the hall using its name

  // Create a query to find the events in the same hall
  const q = query(collection(this.firestore, 'events'), where('hall_id', '==', hallId));

  // Execute the query
  const querySnapshot = await getDocs(q);

  // Create an array to store the event data
  let events:any = [];

  // Add each event data to the array
  querySnapshot.forEach((doc) => {
    events.push(doc.data());
  });

  return events;
}

  async getEventSpeakers(eventName : any) : Promise<string[]>{
    let eventId = await this.getDocumentIdByUniqueKey('events', 'name', eventName);
    let speakers : any[] = [];
    try {
      const collectionRef = collection(this.firestore, 'speakers');
      const q = query(collectionRef, where("event_id", "==", eventId));
      const querySnapshot = await getDocs(q);

    querySnapshot.forEach(
        (doc) => {
          let speaker = doc.data()['speaker_name'];
          speakers.push(speaker);
        }
      );
      return speakers;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  }

  async getEventFloorPlan(hallId : any) : Promise<any>{
    let floorPlan : any;
    try {
      const collectionRef = collection(this.firestore, 'halls');
      const q = query(collectionRef, where("id", "==", hallId));
      const querySnapshot = await getDoc(doc(this.firestore, 'halls/' + hallId));

      if(querySnapshot.exists()){
        floorPlan = querySnapshot.data()['floor_plan'].substring(0,250);
      }
      return floorPlan;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return null;
    }
  }

  async getEventAttendees(eventName : any) : Promise<string[] | []>{
    let eventId = await this.getDocumentIdByUniqueKey('events', 'name', eventName);
    let attendees : any[] = [];
    try {
      const collectionRef = collection(this.firestore, 'registrations');
      const q = query(collectionRef, where("event_id", "==", eventId));
      const querySnapshot = await getDocs(q);

    querySnapshot.forEach(
        async (doc) => {
          // get attendee name using the id
          
          let attendee = await this.getAttendeeNameById(doc.data()['attendee_id']);
          attendees.push(attendee);
        }
      );
      return attendees;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  }

  async getAttendeeNameById(attendeeId : any) : Promise<string | null>{
    let attendeeName : any;
    try {
      const collectionRef = collection(this.firestore, 'users');
      const querySnapshot = await getDoc(doc(this.firestore, 'users/' + attendeeId));

      if(querySnapshot.exists()){
        attendeeName = querySnapshot.data()['name'];
      }
      return attendeeName;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return null;
    }
  }

}
