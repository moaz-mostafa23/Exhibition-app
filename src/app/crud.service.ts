import { Injectable } from '@angular/core';
import { Firestore, where } from '@angular/fire/firestore';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData, query } from 'firebase/firestore';
import { Observable, of } from 'rxjs';


export interface Event {
  agendas: string;
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


  constructor(private firestore: Firestore) { }

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
  // get a user by uid
  async getUserByUid(uid: string): Promise<any> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const snapshot = await getDocs(q);
  
      if (snapshot.docs.length === 0) {
        return null; // User not found
      }
  
      const doc = snapshot.docs[0];
      const userData = doc.data();
      return userData;
    } catch (error) {
      console.error('Error getting user by uid:', error);
      return null;
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

  async getDocumentIdByUniqueKey(collectionName: string, uniqueKey:string ,value: string): Promise<string | null> {
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
  
  
  
  


  

}
