import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, from, of } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { Auth } from '@angular/fire/auth';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import * as moment from 'moment';
import { query , getDocs, where, collection, Firestore} from '@angular/fire/firestore';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  providers:[
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { 
     provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
   ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  chart:any;
q$:any[]=[];
labels: string[]=['Description', 'Amount'];
chartlabels: any[]=[];
selectedMonth: string;
selectedYear: string;
mail:string;
monthdata: number[]=[];
constructor(
  private es:ExpenseService, 
  private a:Auth,
  private fs:Firestore,
  private breakpointObserver: BreakpointObserver,
){ }

getWidth(){
  if (this.breakpointObserver.isMatched('(min-width: 1150px)')) {
    return 2; // Large screens and above
  } else if (this.breakpointObserver.isMatched('(min-width: 700px)')) {
    return 1; // Medium screens
  } else {
    return 1; // Small screens and extra small screens
  }
}

expenseForm = new FormGroup({
  amount: new FormControl(0,[Validators.required]),
  description: new FormControl('',[Validators.required])
})


year=new FormControl(moment(),[Validators.required]);

disyear=new FormControl(moment(),[Validators.required]);

mon:string;

month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

ngOnInit():void{
  const u = this.a.currentUser?.email
  if(u){
    this.mail = u;
  }
  console.log(u);
  this.year.reset();
  this.disyear.reset();
// this.y = this.disyear.value?.year().toString();
//     if(this.y){
      
//       this.getData(this.y);

//     }
this.createChart();

}


async disyearHandle(e:any,d:any){
  const k = moment();
  k?.year(e.year())
  this.disyear.setValue(k)
  d.close();
  if(this.mail) {
    console.log(this.mail);
   
  const y = this.disyear.value?.year().toString();
  if(y){
    this.selectedYear= y;
  }
    //   this.data$=this.es.allData(this.mail,y);
    // this.data$.subscribe(d =>{
    //   d.forEach((e:any)=>{this.da.push(e)})});
    // console.log(this.da);
    
    }
    
    // for(let i of this.month) {
    //   var sum =0;
    //   da.forEach(function(item,index){
    //     console.log(item.amount,i)
    //     if(item.month == i){
    //       sum = sum + item.amount;
    //     }
    //   })
    // this.monthsum.push(sum);
    // console.log(this.monthsum);
    // };
}

  async getData(y:string,m:string){
    this.q$ = [];
    this.monthdata =[];
    this.chartlabels=[];
    this.chart.destroy();
    var k =(await getDocs(query(collection(this.fs,this.mail),where('year','==',y),where('month','==',m))));
    k.forEach(a=>{
      if(a.data()){
        this.q$.push(a.data());
      }      
    });
    this.q$.forEach(d => this.monthdata.push(Number(d.amount)))
    this.createChart();
    console.log(this.q$)
}

createChart(){
  for(let i=1;i<=this.q$.length;i++){
    this.chartlabels.push(i);
  }
  this.chart = new Chart ( "lchart", {
    type: 'line',
    data: {
      labels: this.chartlabels,
      datasets: [
        {
          data: this.monthdata,
          label: 'Expense',
          fill: true,
          tension: 0.5,
          borderColor: 'rgba(42,151,241,255)',
          backgroundColor: 'rgba(195,229,255,0.44)'
        }
      ]
    }
  })
  
  
}
yearHandle(e:any,d:any){
  const k = moment();
  k?.year(e.year())
  this.year.setValue(k)
  d.close();
}

addExpense(){
  var m:string=''; 
  if(this.year.value){
    this.selectedYear= this.year.value.year()?.toString();
  }
  if(this.mon){
    this.selectedMonth = this.mon;
  }
  
  console.log(this.mail);

  if(!this.expenseForm.valid) return;
  else{
    var data = {
    month:this.selectedMonth,
    year:this.selectedYear,
    amount:this.expenseForm.value.amount,
    description:this.expenseForm.value.description
  }
  
  if(this.selectedMonth&& this.selectedYear){
     var x = this.es.addExpense(data,this.mail)
  }
  this.getData(this.selectedYear, this.selectedMonth);
  this.expenseForm.reset();
  this.mon = ''
  console.log(this.q$);  
  }
  
}

del(d:any){
  console.log(d);
  var k = this.es.delExpense(this.mail,d);
  this.getData(this.selectedYear,this.selectedMonth);
}

// public lineChartData: ChartConfiguration<'line'>['data'] = {
//   labels: [
//     "January","February","March","April","May","June","July",
//             "August","September","October","November","December"
//   ],
//   datasets: [
//     {
//       data: [10,20],
//       label: 'Expense',
//       fill: true,
//       tension: 0.5,
//       borderColor: 'black',
//       backgroundColor: 'rgba(255,0,0,0.3)'
//     }
//   ]
// };
// public lineChartOptions: ChartOptions<'line'> = {
//   responsive: true
// };
// public lineChartLegend = true;

select(month:string){
  if(month&&this.selectedYear){
    this.selectedMonth = month;
    this.getData(this.selectedYear,month);
  }
}

//rgba(230, 237, 245, 1)

}
