export class Question {

  questions: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  }

  choices : {
    1: [string,string,string,string],
    2: [string,string,string,string],
    3: [string,string,string,string],
    4: [string,string,string,string],
    5: [string,string,string,string],
  }

  images : Array<string> = ['Q1.jpg','Q1.jpg','Q1.jpg','Q1.jpg']
  answers : Array<number> =[]

}
