import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import {provideFirestore, getFirestore} from '@angular/fire/firestore'
import {provideAnalytics, getAnalytics} from '@angular/fire/analytics'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {provideAuth, getAuth} from '@angular/fire/auth'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms'


const firebaseConfig = { apiKey: "AIzaSyCpXrqctZrI4oee53qBKtZyWJBmIA7JDn4",
authDomain: "exhibition-app-eebdc.firebaseapp.com",
projectId: "exhibition-app-eebdc",
storageBucket: "exhibition-app-eebdc.appspot.com",
messagingSenderId: "983679106549",
appId: "1:983679106549:web:29fda1cd732e4bb8a1f4bc",
measurementId: "G-HKJM4K919E"};
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({mode:'ios'}), AppRoutingModule, HttpClientModule, provideFirebaseApp(()=> initializeApp(firebaseConfig)), provideFirestore(()=> getFirestore()), provideAnalytics(()=> getAnalytics()), provideAuth(()=> getAuth()), ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
