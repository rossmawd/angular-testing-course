import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { COURSES } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    })
    coursesService = TestBed.get(CoursesService)
    httpTestingController = TestBed.get(HttpTestingController);
  })

  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No courses Returned')
      expect(courses.length).toBe(12, 'incorrect number of courses')

      const course = courses.find(course => course.id == 12);

      expect(course.titles.description).toBe(
        'Angular Testing Course');
    })
    //intercepts the request
    const req = httpTestingController.expectOne('/api/courses')
    expect(req.request.method).toEqual("GET")
    //makes a response that the subscribe block can use
    req.flush({ payload: Object.values(COURSES) })
  })

  it('should find a course by ID', () => {
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      })

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]) //works as the keys in COURSES are numbers
  })

  it('should save the course data', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12)
      })
    //again, expectOne intercepts any calls from saveCourse
    const req = httpTestingController.expectOne('/api/courses/12')
    expect(req.request.method).toEqual('PUT')
    expect(req.request.body.titles.description) //check change has been made
      .toEqual(changes.titles.description)

    req.flush({
      ...COURSES[12],
      ...changes
    })
  })

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }

    coursesService.saveCourse(12, changes)
      .subscribe(() => fail("the saveCourse operation should have failed"),

        (error: HttpErrorResponse) => {
        expect(error.status).toBe(500)
  }
  )

  const req = httpTestingController.expectOne('/api/courses/12')
  expect(req.request.method).toEqual('PUT')

  req.flush('Save course failed', {status: 500,
  statusText: 'Internal Server Error'})
})

afterEach(() => {
  httpTestingController.verify()
})
}
)
