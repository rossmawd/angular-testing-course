import { CalculatorService } from './calculator.service';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {

  let calculator: CalculatorService,
  loggerSpy: any; //spy's don't really have a type

  beforeEach(() => {
    console.log('calling beforeEach')
    loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy} //no actual instance
      ]
    })

    calculator = TestBed.get(CalculatorService)
  }
  )

  it('should add two numbers', () => {

    console.log("add test")
   const result = calculator.add(2,2)

   expect(result).toBe(4) //test assertion
   expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  })

  it('should subtract two numbers', () => {
    console.log('subtracting numbers')

    const result = calculator.subtract(2,2)

    expect(result).toBe(0, "Unexpected subtraction result") //test assertion
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  })
})


