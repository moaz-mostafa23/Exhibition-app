import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore';
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

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  public events$: Observable<DocumentData[]> = this.getDocuments('events');


  constructor(private firestore: Firestore) { }

  // Create a new document in a collection
  async createDocument(collectionName: string, data: any): Promise<DocumentReference<DocumentData> | any> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      return await addDoc(collectionRef, data);
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
}
