import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category == 'BEGINNER')
  const advancedCourses = setupCourses()
    .filter(course => course.category == 'ADVANCED')

  beforeEach(async(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [ //terminology traffic jam (22)
        { provide: CoursesService, useValue: coursesServiceSpy },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent)
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.get(CoursesService)
    }
    )

  }));



  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  //onInit the home component calls reloadCourses, which calls on coursesService
  it("should display only beginner courses", () => {

    //of() - returns an obserbale that immediately emits the value
    //does this INTERCEPT the call of findAllCourses?
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses))

    fixture.detectChanges() //apply data changes to the template

    const tabs = el.queryAll(By.css(".mat-tab-label"))

    expect(tabs.length).toBe(1, 'unexptected number of tabs found')
  });


  it("should display only advanced courses", () => {

    //of() - returns an obserbale that immediately emits the value
    //does this INTERCEPT the call of findAllCourses?
    coursesService.findAllCourses.and.returnValue(of(advancedCourses))

    fixture.detectChanges() //apply data changes to the template

    const tabs = el.queryAll(By.css('.mat-tab-label'))

    expect(tabs.length).toBe(1, 'unexptected number of tabs found')

  });


  it("should display both tabs", () => {

    //of() - returns an obserbale that immediately emits the value
    //does this INTERCEPT the call of findAllCourses?
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))

    fixture.detectChanges() //apply data changes to the template

    const tabs = el.queryAll(By.css('.mat-tab-label'))

    expect(tabs.length).toBe(2, 'Expected to find 2 tabs')

  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))

    fixture.detectChanges() //apply changes to template
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    console.log('we are clicking ', tabs[1])
    click(tabs[1]) // simulated CLICK

    fixture.detectChanges()

    flush()
    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles')

    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course')


  }))

  it("should display advanced courses when tab clicked- async", async(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))

    fixture.detectChanges() //apply changes to template
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    console.log('we are clicking ', tabs[1])
    click(tabs[1]) // simulated CLICK

    fixture.detectChanges()

    fixture.whenStable().then(() => {
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles')

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course')
    })

  }))
});


