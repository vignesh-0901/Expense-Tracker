import { Injectable } from '@angular/core';
import { Firestore, addDoc, setDoc,collection, collectionData, collectionGroup, deleteDoc, doc, docData, getDoc, getDocs, getDocsFromServer } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { Observable, from } from 'rxjs';
import { query, where } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})

export class ExpenseService {
  
  constructor(private auth:AuthenticationService, private fs: Firestore) { }

  // async allData(e:string,year:string){
  //   return await collection(this.fs,e);

  // var k: Object[]=[];
  // var x=(await getDocs(query(collection(this.fs,e),where('year','==',"2023")))).docChanges()
  // x.forEach(a=>{
  //   console.log(a.doc.data());
  //   k.push(a.doc.data())
  // });
  // if(k.length){
  //   console.log(k);
  //   return k;
  // }
  // return ;

  
//  }


 async addExpense(data:object,e:string){
    const col=collection(this.fs,e);
    console.log("added");
    console.log(col.id)
    const d = doc(col);
    return setDoc(d,{id:d.id,...data});    
  }

async delExpense(e:string,d:any){
  const col = collection(this.fs,e);
  return deleteDoc(doc(col,d.id));
}
}
