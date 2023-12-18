import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData, query, where } from 'firebase/firestore';
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
  description: string;
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
}
