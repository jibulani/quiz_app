import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Question} from '../shared/question';
import {QuestionsAsyncService} from '../shared/question-async.service';
// import {emailValidator} from './validators/emailValidator';
import {rightAnswerValidator} from './validators/rightAnswerValidator';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  questionForm: FormGroup;

  questions: Question[] = [];

  isQuestionAdded = false;

  newQuestion: Question = {
    questionText: '',
    category: '',
    variants: [],
    answer: ''
  };

  constructor(private formBuilder: FormBuilder,
              private questionsAsyncService: QuestionsAsyncService) {
  }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      questionText: ['', [Validators.required, Validators.minLength(15)]],
      category: ['', Validators.required],
      firstAnswer: ['', Validators.required],
      secondAnswer: ['', Validators.required],
      thirdAnswer: [''],
      rightAnswer: ['', Validators.required]
      // answerVariants: this.formBuilder.group({
      //   firstAnswer: ['', Validators.required],
      //   secondAnswer: ['', Validators.required],
      //   thirdAnswer: '',
      // }),
    }, { validator: rightAnswerValidator('firstAnswer', 'secondAnswer', 'thirdAnswer', 'rightAnswer')});
    // this.questionForm.get(['answerVariants']['rightAnswer']).setValidators([
    //   Validators.required,
    //   rightAnswerValidator.bind(null, this.questionForm.get(['answerVariants', 'rightAnswer']))
    // ]);
    this.updateQuestions();
  }

  private updateQuestions() {
    this.questionsAsyncService.getQuestions()
      .subscribe((data) => {
        this.questions = data;
        console.log(this.questions);
      });

  }

  onSubmit(questionForm) {
    // console.log('--- form', questionForm);
    // console.log(this.questionForm.value.questionText);
    // console.log(this.questionForm.value.answerVariants.firstAnswer);
    this.isQuestionAdded = false;
    this.newQuestion = {
      category: '',
      questionText: '',
      variants: [],
      answer: ''
    };
    this.newQuestion['questionText'] = this.questionForm.value.questionText;
    this.newQuestion['answer'] = this.questionForm.value.rightAnswer;
    this.newQuestion['category'] = this.questionForm.value.category;
    this.newQuestion['variants'].push(this.questionForm.value.firstAnswer);
    this.newQuestion['variants'].push(this.questionForm.value.secondAnswer);
    if (!!this.questionForm.value.thirdAnswer) {
      this.newQuestion['variants'].push(this.questionForm.value.thirdAnswer);
    }
    // this.newQuestion['variants'].push(this.questionForm.value.answerVariants.firstAnswer);
    // this.newQuestion['variants'].push(this.questionForm.value.answerVariants.secondAnswer);
    // if (!!this.questionForm.value.answerVariants.thirdAnswer) {
    //   this.newQuestion['variants'].push(this.questionForm.value.answerVariants.thirdAnswer);
    // }
    console.log(this.newQuestion);
    let index;
    for (index = 0; index < this.questions.length; ++index) {
      if (this.questions[index].questionText === this.newQuestion.questionText) {
        return;
      }
    }
    this.addQuestion(this.newQuestion);
    this.isQuestionAdded = true;
  }

  private addQuestion(question: Question) {
    this.questionsAsyncService.addQuestion(question)
      .subscribe(res => {
        console.log(res);
        this.updateQuestions();
      });
  }
}
