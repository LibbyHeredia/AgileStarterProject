export class Question {

  questions: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
  }

  choices : {
    0: [string,string,string,string],
    1: [string,string,string,string],
    2: [string,string,string,string],
    3: [string,string,string,string],
    4: [string,string,string,string],
  }

  images : Array<string> = ['Q1.jpg','Q1.jpg','Q1.jpg','Q1.jpg']
  answers : Array<number> =[]

}
