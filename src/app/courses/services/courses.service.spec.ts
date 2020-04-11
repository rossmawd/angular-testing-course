import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'

describe('CoursesService', () => {
  let coursesService: CoursesService,
  HttpTestingController: HttpTestingController

  beforeEach( function() {
   TestBed.configureTestingModule({
     imports: [HttpClientTestingModule],
     providers: [
      CoursesService
     ]
   })
   coursesService = TestBed.get(CoursesService)
   HttpTestingController = TestBed.get(HttpTestingController);
  })

  it('should retrieve all courses', ()=> {
     coursesService.findAllCourses().subscribe(courses => {
       expect(courses).toBeTruthy('No courses Returned')

       expect(courses.length).toBe(12, 'incorrect number of courses')

       const course = courses.find(course => course.id == 12);

       expect(course.titles.description).toBe(
         'Angular Testing Course');
     })

     const req = HttpTestingController.expectOne('/api/courses')
     expect(req.request.method).toEqual("GET")

     req.flush({payload: Object.values(COURSES)})

  })
}

)
