import { Injectable } from '@angular/core';
import {Auth, getAuth, signInWithEmailAndPassword,
createUserWithEmailAndPassword,signOut,sendSignInLinkToEmail,
UserCredential
} from '@angular/fire/auth'
import {collection, addDoc, getDocs, where, query} from '@angular/fire/firestore'
import { AlertController } from '@ionic/angular';
import {Firestore} from '@angular/fire/firestore'
import {BehaviorSubject} from 'rxjs'
import { CrudService } from './crud.service';

import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
userLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private crud:CrudService ,private alert:AlertController,private auth: Auth, private firestore: Firestore, private storage:Storage) {
    this.storage.create();
  }

  async signUp(user:User): Promise<void>{
    try{
      const existingUsers = await this.getExistingUsersByEmail(user.email);
      if(existingUsers.length > 0){
        const alertBox = await this.alert.create({
          header: "Email Already Taken",
          message: "Email has been taken by another user. Use another email",
          buttons: ['Cancel']
        });
         alertBox.present();
         throw new Error('Email already in use');

      }

      const credential = await createUserWithEmailAndPassword(this.auth, user.email,user.password);

      // Add user data to users collection
      await this.addUserToFirestore(credential.user, user);
    }catch(error){
      console.log("Error signing up: ",error);
      throw error;
    }
  }
  // User login
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      // Check if email exists
      const existingUsers = await this.getExistingUsersByEmail(email);
      if (!existingUsers.length) {
        const alertBox = await this.alert.create({
          header: "Email Not Found",
          message: "This email address is not registered",
          buttons: ['Cancel']
        });
        alertBox.present();
        throw new Error('Email not found');
      }
  
      // Check password
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential;
    } catch (error:any) {
      console.error('Error logging in:', error);
      if (error.code === 'auth/invalid-credential') {
        const alertBox = await this.alert.create({
          header: "Incorrect credentials.",
          message: "Email or Password might be incorrect.",
          buttons: ['Cancel']
        });
        alertBox.present();
      }
      throw error;
    }
  }

  
  
  // User sign out
  async signout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  
  private async addUserToFirestore(user: any, data: User): Promise<void> {
    const { password, ...userData } = data;
  
    const usersRef = collection(this.firestore, 'users');
    await addDoc(usersRef, {
      ...userData,
      uid: user.uid,
    });
  }
  async updateProfile(user: any): Promise<void> {
    try {
      const currentUser = await this.auth.currentUser;
      if (!currentUser) {
        throw new Error('User not found');
      }
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('uid', '==', currentUser.uid));
      const snapshot = await getDocs(q);
  
      if (snapshot.docs.length === 0) {
        throw new Error('User not found');
      }
  
      const doc = snapshot.docs[0];
      const docId = doc.id;
      await this.crud.updateDocument('users', docId, user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
    



  // Check if email exists in users collection
  private async getExistingUsersByEmail(email: string): Promise<any[]>{
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc)=> doc.data())
  }
  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.auth.currentUser;
       if(user){
        let userData = this.getUserByUid(user.uid);
        await this.storage.set('UserData', userData);
        await this.storage.set('isLoggedIn', true);
        return true;
       }else{
          await this.storage.clear();
          return false;
       } 
    } catch (error) {
      console.error('Error checking user login:', error);
      return false;
    }
  }

  async getUserData(){
    const userData = await this.storage.get('UserData');
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if(userData && isLoggedIn){
      console.log(userData);
      return userData;
    }else{
      return null;
    }
  }


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

  async deleteUserAccount(){
    const currentUser:any = await this.auth.currentUser;
    try{
      const userRef = collection(this.firestore, 'users');
      const q = query(userRef, where('uid', '==', currentUser.uid));
      const snapshot:any = await getDocs(q);
      const docId = snapshot.docs[0].id;
      await this.auth.currentUser?.delete();
      await this.crud.deleteDocument('users', docId);
    }catch(err){
      console.log(err);
    }

  }

  getCurrentUser(){
    return this.auth.currentUser;
  }
  
  
}




export interface User {
  firstName:string,
  lastName:string,
  email:string,
  password:string,
  phone:string,
  userType:string

}
